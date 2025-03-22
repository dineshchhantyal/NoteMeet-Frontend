import { MeetingInterface } from '@/types';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { generatePresignedUrl } from '@/lib/presigned-url';
import { S3BucketType } from '@/lib/s3';
import UserSubscriptionService from '@/actions/user-subscription-plan';
import {
	EventBridgeClient,
	PutRuleCommand,
	PutTargetsCommand,
} from '@aws-sdk/client-eventbridge';
import { sendMeetingInviteEmail } from '@/lib/mail';

// AWS Configuration for EventBridge - using SDK v3
const eventBridgeClient = new EventBridgeClient({
	region: process.env.AWS_REGION || 'us-east-1',
});

export async function GET() {
	try {
		const session = await currentUser();

		if (!session?.id) {
			// Return empty data array instead of null
			return NextResponse.json({ data: [] });
		}

		// Get user's meetings
		const userMeetings = await db?.meeting.findMany({
			where: {
				userId: session.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Always return an object with a data property, never null
		return NextResponse.json({
			data: userMeetings || [], // Ensure we return an array even if userMeetings is null
		});
	} catch (error) {
		console.error('Error fetching meetings:', error);
		// Return an error object, not null
		return NextResponse.json(
			{
				error: 'Failed to fetch meetings',
				data: [],
			},
			{
				status: 500,
			},
		);
	}
}

export async function POST(req: Request) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const userId = user.id;

		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userSubscriptionService = new UserSubscriptionService(user);

		// Check user meeting limits
		const remainingLimits =
			await userSubscriptionService.getUserRemainingLimits(userId);

		if (remainingLimits.meetingsAllowed <= 0) {
			return NextResponse.json(
				{ error: 'You have reached your meeting limit' },
				{ status: 403 },
			);
		}

		if (remainingLimits.storageLimit <= 0) {
			return NextResponse.json(
				{ error: 'You have reached your storage limit' },
				{ status: 403 },
			);
		}

		const userIdString = Array.isArray(userId) ? userId[0] : userId;
		const body: MeetingInterface = await req.json();

		const {
			title,
			date,
			time,
			duration,
			description,
			provider,
			meetingLink,
			participants,
			notifications,
		} = body;

		// Validate required fields
		if (!meetingLink && provider) {
			return NextResponse.json(
				{ error: 'Meeting link is required when provider is selected' },
				{ status: 400 },
			);
		}
		const meetingDate = new Date(`${date}T${time}`);

		// Create the meeting in the database
		const meeting = await db?.meeting.create({
			data: {
				title,
				date: new Date(date), // Ensure date is properly formatted as a Date object
				time,
				duration: Number.parseFloat(duration.toString()),
				description: description || '',
				provider: provider || null,
				meetingLink: meetingLink || '',
				userId: userIdString,
				participants: {
					create: participants.map((participant: string) => ({
						email: participant,
					})),
				},
				notification: {
					create: {
						sendTranscript: notifications?.sendTranscript || false,
						sendSummary: notifications?.sendSummary || false,
					},
				},
				videoKey: '', // Initialize with empty string
			},
		});

		if (!meeting) {
			throw new Error('Failed to create meeting record');
		}

		// Update the videoKey after meeting creation
		await db?.meeting.update({
			where: { id: meeting.id },
			data: {
				videoKey: meeting.id, // Now we can access meeting.id
			},
		});

		// Only schedule recording if meeting link is provided and meeting is in the future
		if (meetingLink && duration && meetingDate > new Date()) {
			console.log('Scheduling recording for meeting:', meeting.id);
			try {
				// Generate presigned URL for S3 upload
				// Duration in minutes + 10 minutes buffer
				const expiresIn = parseInt(duration) * 60 + 10 * 60;

				const { url: presignedUrl } = await generatePresignedUrl({
					key: meeting.id,
					bucketType: S3BucketType.RAW_RECORDINGS_BUCKET,
					expiresIn: expiresIn,
				});

				// Schedule the meeting recording with EventBridge
				// Format date and time for EventBridge cron expression
				const timeParts = time.split(':');
				meetingDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));

				// Create an ISO string and format it for EventBridge schedule
				const scheduledTimeISO = meetingDate.toISOString();
				// Format for EventBridge: at(yyyy-mm-ddThh:mm:ss)
				const scheduledTime = scheduledTimeISO.replace(/\.\d{3}Z$/, '');

				// Rule name must be unique - use the meeting ID
				const ruleName = `meeting-recording-${meeting.id}`;

				// ECS Task details
				const ecsCluster = process.env.ECS_CLUSTER_ARN;
				const ecsTaskDefinition = process.env.ECS_TASK_DEFINITION_ARN;
				const ecsSubnet = process.env.ECS_SUBNET_ID;
				const ecsSecurityGroup = process.env.ECS_SECURITY_GROUP_ID;

				if (
					!ecsCluster ||
					!ecsTaskDefinition ||
					!ecsSubnet ||
					!ecsSecurityGroup
				) {
					throw new Error('ECS configuration is incomplete');
				}

				// Create EventBridge rule with target to run ECS task - using SDK v3
				const putRuleCommand = new PutRuleCommand({
					Name: ruleName,
					ScheduleExpression: `at(${scheduledTime})`,
					State: 'ENABLED',
					Description: `Recording scheduler for meeting: ${title}`,
				});

				// Create the rule
				const ruleResponse = await eventBridgeClient.send(putRuleCommand);

				if (!ruleResponse.RuleArn) {
					throw new Error('Failed to create EventBridge rule');
				}

				// Set up the ECS task target with environment variables
				const putTargetsCommand = new PutTargetsCommand({
					Rule: ruleName,
					Targets: [
						{
							Id: `ecs-task-${meeting.id}`,
							Arn: ecsCluster,
							RoleArn: process.env.ECS_ROLE_ARN,
							EcsParameters: {
								TaskDefinitionArn: ecsTaskDefinition,
								TaskCount: 1,
								LaunchType: 'FARGATE',
								NetworkConfiguration: {
									awsvpcConfiguration: {
										Subnets: [ecsSubnet],
										SecurityGroups: [ecsSecurityGroup],
										AssignPublicIp: 'ENABLED',
									},
								},
								PlatformVersion: 'LATEST',
							},
							Input: JSON.stringify({
								containerOverrides: [
									{
										name: 'meeting-recording-container',
										environment: [
											{ name: 'MEETING_URL', value: meetingLink },
											{ name: 'USERNAME_GROUP', value: user.name || 'User' },
											{ name: 'DURATION_MINUTES', value: duration.toString() },
											{ name: 'S3_PRESIGNED_UPLOAD_URL', value: presignedUrl }, // Now using presignedUrl
											{ name: 'MEETING_ID', value: meeting.id },
										],
									},
								],
							}),
						},
					],
				});

				// Attach target to the rule
				const event = await eventBridgeClient.send(putTargetsCommand);
				console.log('EventBridge rule created:', event);

				// Update meeting with EventBridge and ECS details
				await db?.meeting.update({
					where: { id: meeting.id },
					data: {
						awsSchedulerArn: ruleResponse.RuleArn,
						awsJobId: ruleName,
						// We'll set ecsTaskId when the task actually runs, as we don't have it yet
					},
				});

				console.log(
					`Successfully scheduled recording for meeting ${meeting.id}`,
				);

				return NextResponse.json(
					{
						data: meeting,
						message: 'Meeting created and recording scheduled',
					},
					{ status: 200 },
				);
			} catch (err) {
				console.error('Failed to schedule meeting recording:', err);

				// Meeting was created but scheduling failed, so we update the user
				return NextResponse.json(
					{
						data: meeting,
						warning: 'Meeting created but recording scheduling failed',
						error:
							err instanceof Error
								? err.message
								: 'Failed to schedule recording',
					},
					{ status: 207 },
				);
			}
		}

		// create MeetingShare for each participant
		for (const participant of participants) {
			const token = crypto.randomUUID();
			await db?.meetingShare.create({
				data: {
					meetingId: meeting.id,
					email: participant,
					token,
					createdBy: userIdString,
					status: 'pending', // Add default status
					permission: 'VIEW', // Add default permission if needed
				},
			});

			await sendMeetingInviteEmail(participant, meeting.id, token);
		}

		// This handles the case where no recording is scheduled
		return NextResponse.json(
			{ data: meeting, message: 'Meeting created successfully' },
			{ status: 200 },
		);
	} catch (error: Error | unknown) {
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : 'Failed to create meeting',
			},
			{ status: 500 },
		);
	}
}

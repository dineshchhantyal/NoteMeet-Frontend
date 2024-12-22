import { MeetingInterface } from '@/interfaces';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

import AWS from 'aws-sdk';

export async function GET() {
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const userId = user.id;
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userIdString = Array.isArray(userId) ? userId[0] : userId;
	const meetings = await db.meeting.findMany({
		where: { userId: userIdString },
	});

	return NextResponse.json({ data: meetings }, { status: 200 });
}

export async function POST(req: Request) {
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const userId = user.id;

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const scheduler = new AWS.Scheduler();

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

	const meeting = await db.meeting.create({
		data: {
			title,
			date: new Date(date),
			time,
			duration,
			description,
			provider,
			meetingLink,
			userId: userIdString,
			participants: {
				create: participants.map((participant: string) => ({
					email: participant,
				})),
			},
			notification: {
				create: {
					sendTranscript: notifications.sendTranscript,
					sendSummary: notifications.sendSummary,
				},
			},
		},
	});
	// Schedule AWS Lambda function
	const lambdaArn = process.env.MEETING_RECORDING_LAMBDA_FUNCTION_ARN; // Set this in your environment variables
	const jobName = `Meeting-${meeting.id}`;
	const scheduleExpression = `at(${date}T${time})`;

	const params = {
		Name: jobName,
		ScheduleExpression: scheduleExpression,
		Target: {
			Arn: lambdaArn,
			RoleArn: process.env.MEETING_RECORDING_AWS_ROLE_ARN, // Set this in your environment variables
			Input: JSON.stringify({ meetingId: meeting.id }),
		},
		FlexibleTimeWindow: { Mode: 'OFF' },
	};

	const schedulerResponse = await scheduler.createSchedule(params).promise();

	// Update the meeting with AWS Scheduler details
	await db.meeting.update({
		where: { id: meeting.id },
		data: {
			awsSchedulerArn: schedulerResponse.ScheduleArn,
			awsJobId: jobName,
		},
	});

	return NextResponse.json(
		{ data: meeting, message: 'Meeting created successfully' },
		{ status: 200 },
	);
}

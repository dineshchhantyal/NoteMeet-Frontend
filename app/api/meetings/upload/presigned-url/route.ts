import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { MeetingStatus } from '@/types/meeting';
import { generatePresignedUrl } from '@/lib/presigned-url';
import { v4 as uuidv4 } from 'uuid';
import { S3BucketType } from '@/lib/s3';
import { format } from 'date-fns';
import UserSubscriptionService from '@/actions/user-subscription-plan';

export async function GET() {
	try {
		const user = await currentUser();
		if (!user || !user.id) {
			return Response.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const userSubscriptionService = new UserSubscriptionService(user);

		const remainingLimits =
			await userSubscriptionService.getUserRemainingLimits(user.id);

		if (remainingLimits.meetingsAllowed <= 0) {
			return Response.json(
				{ message: 'You have reached your meeting limit' },
				{ status: 403 },
			);
		}

		if (remainingLimits.storageLimit <= 0) {
			return Response.json(
				{ message: 'You have reached your storage limit' },
				{ status: 403 },
			);
		}

		const isEarlyAccess =
			await userSubscriptionService.isUserSubscribedToEarlyAccessPlan(user.id);

		if (!isEarlyAccess) {
			return Response.json(
				{ message: 'You do not have access to this feature' },
				{ status: 403 },
			);
		}

		const uid = uuidv4();
		const meeting = await db.meeting.create({
			data: {
				id: uid,
				userId: user.id,
				status: MeetingStatus.InProgress,
				date: new Date(),
				time: new Date().getHours() + ':' + new Date().getMinutes(),
				duration: 60,
				meetingLink: 'N/A',
				title:
					'Instant Meeting Session ' +
					format(new Date(), 'MM/dd/yyyy/HH/mm/ss'),
				description: 'This meeting is recorded on demand by browser extension.',
				provider: 'Extension',
				videoKey: uid,
			},
		});

		if (!meeting) {
			return Response.json(
				{ message: 'Meeting cannot be created' },
				{ status: 400 },
			);
		}

		const { url } = await generatePresignedUrl({
			key: meeting.id,
			bucketType: S3BucketType.RAW_RECORDINGS_BUCKET,
			expiresIn: meeting.duration * 60 + 10 * 60,
		});

		return Response.json({
			presignedUrl: url,
			meeting: meeting,
			maxMeetingDuration: remainingLimits.meetingDuration,
			maxStorageLimit: remainingLimits.storageLimit,
			maxMeetingsAllowed: remainingLimits.meetingsAllowed,
		});
	} catch (error) {
		console.error(error);
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

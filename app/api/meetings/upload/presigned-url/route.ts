import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { MeetingStatus } from '@/types/meeting';
import { generatePresignedUrl } from '@/lib/presigned-url';
import { v4 as uuidv4 } from 'uuid';
import { S3BucketType } from '@/lib/s3';
import { format } from 'date-fns';

export async function GET() {
	try {
		const user = await currentUser();
		if (!user) {
			return Response.json({ message: 'Unauthorized' }, { status: 401 });
		}
		if (!user.isEarlyAccess) {
			return Response.json(
				{ message: 'You do not have access to this feature' },
				{ status: 403 },
			);
		}

		const userId = user.id;
		if (!userId) {
			return Response.json({ message: 'User ID not found' }, { status: 400 });
		}
		const uid = uuidv4();
		const meeting = await db.meeting.create({
			data: {
				id: uid,
				userId: userId,
				status: MeetingStatus.InProgress,
				date: new Date(),
				time: new Date().getHours() + ':' + new Date().getMinutes(),
				duration: 60,
				meetingLink: 'N/A',
				title:
					'Instant Meeting Session ' +
					format(new Date(), 'MM/dd/yyyy/HH/mm/ss'),
				description: 'This meeting is recorded on demand by browser extension.',
				provider: 'Externsion',
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
			maxMeetingDuration: 1 * 60 * 60, // 1 hours
		});
	} catch (error) {
		console.error(error);
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

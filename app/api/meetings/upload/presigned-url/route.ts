import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { MeetingStatus } from '@/types/meeting';
import { generatePresignedUrl, S3BucketType } from '@/lib/presigned-url';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return Response.json({ message: 'Unauthorized' }, { status: 401 });
		}
		console.log('user', user);
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
		const meeting = await db.meeting.create({
			data: {
				id: uuidv4(),
				userId: userId,
				status: MeetingStatus.InProgress,
				date: new Date(),
				time: new Date().getHours() + ':' + new Date().getMinutes(),
				duration: 60,
				meetingLink: 'N/A',
				title: 'On demand meeting: ' + new Date().toISOString(),
				description: 'On demand meeting: ' + new Date().toISOString(),
				provider: 'Externsion',
			},
		});

		console.log('meeting', meeting);

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
		});
	} catch (error) {
		console.error(error);
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

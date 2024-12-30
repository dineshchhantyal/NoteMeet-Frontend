import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { MeetingStatus } from '@/types/meeting';
import { generatePresignedUrl, S3BucketType } from '@/lib/presigned-url';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest) {
	const meetingId = Array.isArray(req.query.id)
		? req.query.id[0]
		: req.query.id;

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

	if (!meetingId) {
		return Response.json(
			{ error: 'File query parameter is required' },
			{ status: 400 },
		);
	}
	let meeting;
	try {
		meeting = await db.meeting.update({
			where: {
				id: meetingId,
				userId: userId,
			},
			data: {
				status: MeetingStatus.InProgress,
			},
		});
	} catch (error) {
		console.error(error);
		return Response.json({ message: 'Meeting not found' }, { status: 404 });
	}

	if (!meeting) {
		return Response.json({ message: 'Meeting not found' }, { status: 404 });
	}

	const { url } = await generatePresignedUrl({
		key: meetingId,
		bucketType: S3BucketType.RAW_RECORDINGS_BUCKET,
		expiresIn: meeting.duration * 60 + 10 * 60,
	});

	return Response.json({
		presignedUrl: url,
		meeting: meeting,
	});
}

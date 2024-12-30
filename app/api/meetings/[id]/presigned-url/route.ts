import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { generetePresigedGetUrl } from '@/lib/presigned-url';
import { NextApiRequest } from 'next';
import { S3BucketType } from '@/lib/s3';

export async function GET(req: NextApiRequest) {
	try {
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

		const meeting = await db.meeting.findFirst({
			where: {
				id: meetingId,
				userId,
			},
		});

		if (!meeting) {
			return Response.json({ message: 'Meeting not found' }, { status: 404 });
		}

		if (!meeting.videoKey) {
			return Response.json({ message: 'Video not found' }, { status: 404 });
		}

		const presignedUrl = await generetePresigedGetUrl({
			bucketType: S3BucketType.RAW_RECORDINGS_BUCKET,
			key: meeting.videoKey,
			expiresIn: 60 * 60,
		});

		return Response.json(
			{ presignedUrl, message: 'Presigned url get successfully.' },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error in GET presigned-url:', error);
		return Response.json({ message: 'Internal server error' }, { status: 500 });
	}
}

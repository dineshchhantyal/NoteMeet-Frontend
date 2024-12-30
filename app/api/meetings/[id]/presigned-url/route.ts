import { generetePresigedGetUrl } from '@/lib/presigned-url';
import { S3BucketType } from '@/lib/s3';
import { NextRequest } from 'next/server';
import { checkMeetingUserAuthorization } from '@/lib/meeting';

export async function GET(req: NextRequest) {
	try {
		const path = req.nextUrl.pathname.split('/');
		const meetingId = path[path.length - 2];

		const meeting = await checkMeetingUserAuthorization(meetingId);

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

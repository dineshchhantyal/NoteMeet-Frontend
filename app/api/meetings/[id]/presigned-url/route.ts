import { generetePresigedGetUrl } from '@/lib/presigned-url';
import { S3BucketType } from '@/lib/s3';
import { NextRequest } from 'next/server';
import { checkMeetingUserAuthorization } from '@/lib/meeting';
import { currentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
	try {
		const meetingId = req.nextUrl.pathname.split('/').at(-2) as string;

		const user = await currentUser();

		if (!user) {
			return Response.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const meeting = await checkMeetingUserAuthorization(user, meetingId);

		if (!meeting) {
			return Response.json({ message: 'Meeting not found' }, { status: 404 });
		}

		if (!meeting.videoKey) {
			return Response.json({ message: 'Video not found' }, { status: 404 });
		}

		const sources = [];
		if (
			Number(meeting.status) > 3 &&
			meeting.status !== 6 &&
			meeting.videoKey
		) {
			const mp4PresignedUrl = await generetePresigedGetUrl({
				bucketType: S3BucketType.MAIN_BUCKET,
				key: 'recordings/video/' + meeting.videoKey + '.mp4',
				expiresIn: 60 * 60,
				contentType: 'video/mp4',
			});
			sources.push({ src: mp4PresignedUrl, type: 'video/mp4' });
		} else {
			const webmPresignedUrl = await generetePresigedGetUrl({
				bucketType: S3BucketType.RAW_RECORDINGS_BUCKET,
				key: meeting.videoKey + '.webm',
				expiresIn: 60 * 60,
				contentType: 'video/webm',
			});
			sources.push({ src: webmPresignedUrl, type: 'video/webm' });
		}

		return Response.json(
			{
				sources,
				message: 'Presigned url get successfully.',
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error in GET presigned-url:', error);
		return Response.json({ message: 'Internal server error' }, { status: 500 });
	}
}

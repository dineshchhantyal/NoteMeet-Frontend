import { generetePresigedGetUrl } from '@/lib/presigned-url';
import { getObject, S3BucketType } from '@/lib/s3';
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

		if (!meeting.transcriptKey) {
			return Response.json({ message: 'Video not found' }, { status: 404 });
		}

		let transcript = '';

		if (Number(meeting.status) >= 5) {
			// const mp4PresignedUrl = await generetePresigedGetUrl({
			//     bucketType: S3BucketType.MAIN_BUCKET,
			//     key: 'recordings/transcript/' + meeting.transcriptKey + '.mp4',
			//     expiresIn: 60 * 60,
			//     contentType: 'text/plain',
			// });

			transcript =
				(await getObject(
					'recordings/transcript/' + meeting.transcriptKey,
					S3BucketType.MAIN_BUCKET,
				)) ?? '';
		}
		return Response.json(
			{
				transcript,
				message: 'Presigned url get successfully.',
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error in GET presigned-url:', error);
		return Response.json({ message: 'Internal server error' }, { status: 500 });
	}
}

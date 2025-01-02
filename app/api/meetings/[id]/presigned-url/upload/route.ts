import { db } from '@/lib/db';
import { checkMeetingUserAuthorization } from '@/lib/meeting';
import { generatePresignedUrl } from '@/lib/presigned-url';
import { S3BucketType } from '@/lib/s3';
import { MeetingStatus } from '@/types/meeting';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const meetingId = req.nextUrl.pathname.split('/').at(-3) as string;

		if (!meetingId) {
			return Response.json({ message: 'Meeting not found' }, { status: 404 });
		}

		const meeting = await checkMeetingUserAuthorization(meetingId);

		if (!meeting) {
			return Response.json({ message: 'Meeting not found' }, { status: 404 });
		}

		const { url, expiresAt } = await generatePresignedUrl({
			key: meetingId,
			expiresIn: 60 * 60,
			bucketType: S3BucketType.RAW_RECORDINGS_BUCKET,
		});

		await db.meeting.update({
			where: { id: meetingId },
			data: { status: MeetingStatus.InProgress, videoKey: meetingId },
		});

		return Response.json(
			{
				presignedUrl: url,
				expiresAt,
				meeting,
				message: 'Presigned url get successfully.',
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return Response.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}

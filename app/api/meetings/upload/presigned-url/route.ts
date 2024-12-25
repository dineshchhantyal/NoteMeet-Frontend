import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

const client = new S3Client({
	region: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_ACCESS_KEY!,
		secretAccessKey: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_SECRET_KEY!,
	},
});

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;

	const user = await currentUser();
	if (!user) {
		return Response.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const userId = user.id;

	const meetingId = searchParams.get('meeting-id');

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
				status: 'In Progress',
			},
		});
	} catch (error) {
		return Response.json({ message: 'Meeting not found' }, { status: 404 });
	}

	if (!meeting) {
		return Response.json({ message: 'Meeting not found' }, { status: 404 });
	}

	const command = new PutObjectCommand({
		Bucket: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_NAME,
		Key: meetingId,
	});

	const url = await getSignedUrl(client, command, {
		expiresIn:
			meeting && meeting.duration ? meeting.duration * 60 + 10 * 60 : 10 * 60, // 10 minutes extra
	});

	return Response.json({
		presignedUrl: url,
		meeting: meeting,
	});
}
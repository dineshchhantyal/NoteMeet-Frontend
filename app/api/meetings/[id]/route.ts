import { db } from '@/lib/db';
import {
	checkMeetingUserAuthorization,
	checkTranscriberAuthorization,
} from '@/lib/meeting';
import { deleteS3Object, S3BucketType } from '@/lib/s3';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const id = req.nextUrl.pathname.split('/').pop();

		const meeting = await checkMeetingUserAuthorization(id!);
		return NextResponse.json(meeting);
	} catch (error) {
		console.error('GET Meeting Error:', error);
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message },
				{ status: getErrorStatus(error.message) },
			);
		}
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const id = req.nextUrl.pathname.split('/').pop();
		const body = await req.json();

		if (body?.role === 'transcriber') {
			await checkTranscriberAuthorization(body.awsVerification);
		} else {
			await checkMeetingUserAuthorization(id!);
		}

		const updatedMeeting = await db.meeting.update({
			where: { id: id! },
			data: body,
		});

		return NextResponse.json(updatedMeeting);
	} catch (error) {
		console.error('PUT Meeting Error:', error);
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message },
				{ status: getErrorStatus(error.message) },
			);
		}
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const id = req.nextUrl.pathname.split('/').pop();

		await checkMeetingUserAuthorization(id!);
		const meeting = await db.meeting.findUnique({
			where: { id },
		});

		if (!meeting) {
			throw new Error('Meeting not found');
		}

		if (meeting.videoKey) {
			try {
				await deleteS3Object(
					meeting.videoKey,
					S3BucketType.RAW_RECORDINGS_BUCKET,
				);
			} catch (error) {
				console.error('Error deleting video key:', error);
			}
			try {
				if (Number(meeting.status) >= 3) {
					await deleteS3Object(
						'recordings/video/' + meeting.videoKey + '.mp4',
						S3BucketType.MAIN_BUCKET,
					);
				}
			} catch (error) {
				console.error('Error deleting video key:', error);
			}
			try {
				await deleteS3Object(
					'recordings/thumbnail/' + meeting.videoKey + '.jpg',
					S3BucketType.MAIN_BUCKET,
				);
			} catch (error) {
				console.error('Error deleting thumbnail key:', error);
			}
		}
		try {
			await db.participant.deleteMany({
				where: { meetingId: id! },
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				console.error('Error deleting participants:', error);
			} else throw error;
		}

		try {
			await db.notification.delete({
				where: { meetingId: id! },
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				console.error('Error deleting notification:', error);
			} else throw error;
		}

		try {
			await db.meeting.delete({
				where: { id: id! },
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				console.error('Error deleting meeting:', error);
			} else throw error;
		}

		return NextResponse.json({ message: 'Meeting deleted successfully' });
	} catch (error) {
		console.error('DELETE Meeting Error:', error);
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message },
				{ status: getErrorStatus(error.message) },
			);
		}
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

function getErrorStatus(message: string): number {
	switch (message) {
		case 'Invalid meeting ID':
			return 400;
		case 'Unauthorized':
			return 401;
		case 'Access denied':
			return 403;
		default:
			return 500;
	}
}

import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

async function checkAuthorization(id: string, userId: string | null) {
	if (!id) {
		throw new Error('Invalid meeting ID');
	}

	if (!userId) {
		throw new Error('Unauthorized');
	}

	const user = await db.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new Error('Unauthorized');
	}

	const meeting = await db.meeting.findUnique({
		where: { id },
		include: { createdBy: true },
	});

	if (!meeting || meeting.userId !== userId) {
		throw new Error('Access denied');
	}

	return meeting;
}

export async function GET(req: NextRequest) {
	try {
		const id = req.nextUrl.pathname.split('/').pop();
		const userId = req.headers.get('user-id');

		const meeting = await checkAuthorization(id!, userId);
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
		const userId = req.headers.get('user-id');
		const body = await req.json();

		await checkAuthorization(id!, userId);

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
		const userId = req.headers.get('user-id');

		await checkAuthorization(id!, userId);

		await db.meeting.delete({
			where: { id: id! },
		});

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

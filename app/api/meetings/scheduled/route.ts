import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { MeetingStatus } from '@/types/meeting';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const userId = user.id;
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const meetings = await db.meeting.findMany({
			where: { status: MeetingStatus.Scheduled, userId },
		});

		return NextResponse.json({ data: meetings }, { status: 200 });
	} catch (error) {
		console.error('GET Scheduled Meetings Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

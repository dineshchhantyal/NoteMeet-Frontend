import { MeetingInterface } from '@/interfaces';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const userId = user.id;
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userIdString = Array.isArray(userId) ? userId[0] : userId;
	const meetings = await db.meeting.findMany({
		where: { userId: userIdString },
	});

	return NextResponse.json({ data: meetings }, { status: 200 });
}

export async function POST(req: Request) {
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const userId = user.id;

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userIdString = Array.isArray(userId) ? userId[0] : userId;
	const body: MeetingInterface = await req.json();

	const {
		title,
		date,
		time,
		duration,
		description,
		provider,
		meetingLink,
		participants,
		notifications,
	} = body;

	const meeting = await db.meeting.create({
		data: {
			title,
			date: new Date(date),
			time,
			duration,
			description,
			provider,
			meetingLink,
			userId: userIdString,
			participants: {
				create: participants.map((participant: string) => ({
					email: participant,
				})),
			},
			notification: {
				create: {
					sendTranscript: notifications.sendTranscript,
					sendSummary: notifications.sendSummary,
				},
			},
		},
	});

	return NextResponse.json(
		{ data: meeting, message: 'Meeting created successfully' },
		{ status: 200 },
	);
}

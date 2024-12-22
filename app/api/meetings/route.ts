import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
	const userId = req.headers['user-id']; // Replace with proper auth mechanism
	if (!userId) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const userIdString = Array.isArray(userId) ? userId[0] : userId;
	const meetings = await db.meeting.findMany({
		where: { userId: userIdString },
	});

	return res
		.status(200)
		.json({ data: meetings, messge: 'Meetings fetched successfully' });
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
	const userId = req.headers['user-id']; // Replace with proper auth mechanism
	if (!userId) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const userIdString = Array.isArray(userId) ? userId[0] : userId;

	const meeting = await db.meeting.create({
		data: {
			...req.body,
			userId: userIdString,
		},
	});

	return res
		.status(200)
		.json({ data: meeting, message: 'Meeting created successfully' });
}

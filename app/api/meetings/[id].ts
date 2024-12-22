import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	const userId = req.headers['user-id'];

	if (typeof id !== 'string') {
		return res.status(400).json({ error: 'Invalid meeting ID' });
	}

	if (!userId || typeof userId !== 'string') {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const meeting = await db.meeting.findUnique({
			where: { id },
			include: { createdBy: true },
		});

		if (!meeting || meeting.userId !== userId) {
			return res.status(403).json({ error: 'Access denied' });
		}

		return res.status(200).json(meeting);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Something went wrong' });
	}
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	const userId = req.headers['user-id'];

	if (typeof id !== 'string') {
		return res.status(400).json({ error: 'Invalid meeting ID' });
	}

	if (!userId || typeof userId !== 'string') {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const existingMeeting = await db.meeting.findUnique({
			where: { id },
		});

		if (!existingMeeting || existingMeeting.userId !== userId) {
			return res.status(403).json({ error: 'Access denied' });
		}

		const meeting = await db.meeting.update({
			where: { id },
			data: req.body,
		});

		return res.status(200).json(meeting);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Something went wrong' });
	}
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	const userId = req.headers['user-id'];

	if (typeof id !== 'string') {
		return res.status(400).json({ error: 'Invalid meeting ID' });
	}

	if (!userId || typeof userId !== 'string') {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const existingMeeting = await db.meeting.findUnique({
			where: { id },
		});

		if (!existingMeeting || existingMeeting.userId !== userId) {
			return res.status(403).json({ error: 'Access denied' });
		}

		await db.meeting.delete({
			where: { id },
		});

		return res.status(200).json({ message: 'Meeting deleted successfully' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Something went wrong' });
	}
}

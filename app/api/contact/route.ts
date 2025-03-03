import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { name, email, subject, message } = await req.json();
		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			);
		}

		if (
			await db?.contactMessage.findFirst({ where: { email, isRead: false } })
		) {
			return NextResponse.json(
				{ error: 'You have already sent a message' },
				{ status: 400 },
			);
		} else {
			await db?.contactMessage.create({
				data: { name, email, subject, message },
			});

			return NextResponse.json(
				{ message: 'Message saved successfully!' },
				{ status: 200 },
			);
		}
	} catch (error) {
		console.error('Error saving contact message:', error);
		return NextResponse.json(
			{ error: 'Failed to save message' },
			{ status: 500 },
		);
	}
}

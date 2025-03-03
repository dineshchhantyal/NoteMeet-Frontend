import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const subscribeSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

export async function POST(req: NextRequest) {
	try {
		if (!db) {
			throw new Error('Database connection not available');
		}

		const body = await req.json();
		const { email } = subscribeSchema.parse(body);

		// Check if email already exists
		const existing = await db.newsletterSubscription.findUnique({
			where: { email },
		});

		if (existing) {
			if (existing.status === 'unsubscribed') {
				// Re-subscribe if previously unsubscribed
				await db.newsletterSubscription.update({
					where: { email },
					data: { status: 'active' },
				});
				return NextResponse.json({
					success: true,
					message: 'Welcome back! You have been re-subscribed.',
				});
			}
			return NextResponse.json({
				success: true,
				message: 'You are already subscribed to our newsletter!',
			});
		}

		// Create new subscription
		await db.newsletterSubscription.create({
			data: {
				email,
				status: 'active',
			},
		});

		return NextResponse.json({
			success: true,
			message: 'Successfully subscribed to our newsletter!',
		});
	} catch (error) {
		console.error('Newsletter subscription error:', error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					message: error.errors[0].message,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: 'Something went wrong. Please try again later.',
			},
			{ status: 500 },
		);
	}
}

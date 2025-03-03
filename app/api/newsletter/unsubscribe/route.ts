import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const unsubscribeSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

export async function POST(req: NextRequest) {
	try {
		if (!db) {
			throw new Error('Database connection not available');
		}

		const body = await req.json();
		const { email } = unsubscribeSchema.parse(body);

		// Check if email exists
		const subscription = await db.newsletterSubscription.findUnique({
			where: { email },
		});

		if (!subscription) {
			return NextResponse.json(
				{
					success: false,
					message: 'Email not found in our subscription list',
				},
				{ status: 404 },
			);
		}

		if (subscription.status === 'unsubscribed') {
			return NextResponse.json({
				success: true,
				message: 'You have already unsubscribed from our newsletter',
			});
		}

		// Update subscription status
		await db.newsletterSubscription.update({
			where: { email },
			data: { status: 'unsubscribed' },
		});

		return NextResponse.json({
			success: true,
			message: 'You have been successfully unsubscribed from our newsletter',
		});
	} catch (error) {
		console.error('Newsletter unsubscribe error:', error);

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

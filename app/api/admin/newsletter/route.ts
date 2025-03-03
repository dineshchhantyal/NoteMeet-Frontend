import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// Admin-only authorization helper
async function authorizeAdmin() {
	const user = await currentUser();
	if (!user) {
		throw new Response('Unauthorized', { status: 401 });
	}
	if (user.role !== UserRole.ADMIN) {
		throw new Response('Forbidden', { status: 403 });
	}
	return user;
}

// Get all newsletter subscriptions
export async function GET(req: NextRequest) {
	try {
		await authorizeAdmin();

		if (!db) {
			throw new Error('Database connection not available');
		}

		// Parse query parameters
		const url = new URL(req.url);
		const status = url.searchParams.get('status') || undefined;
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const skip = (page - 1) * limit;

		// Build where clause
		const where = status ? { status } : {};

		// Get subscribers with pagination
		const [subscribers, total] = await Promise.all([
			db.newsletterSubscription.findMany({
				where,
				orderBy: { createdAt: 'desc' },
				skip,
				take: limit,
			}),
			db.newsletterSubscription.count({ where }),
		]);

		return NextResponse.json({
			subscribers,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('Admin newsletter listing error:', error);

		if (error instanceof Response) {
			return NextResponse.json(
				{
					success: false,
					message: error.statusText,
				},
				{ status: error.status },
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

// POST - Send newsletter to all subscribers
export async function POST(req: NextRequest) {
	try {
		await authorizeAdmin();

		if (!db) {
			throw new Error('Database connection not available');
		}

		const body = await req.json();
		const { subject, content } = body;

		if (!subject || !content) {
			return NextResponse.json(
				{ error: 'Subject and content are required' },
				{ status: 400 },
			);
		}

		// Get all active subscribers
		const subscribers = await db.newsletterSubscription.findMany({
			where: { status: 'active' },
			select: { email: true },
		});

		// Here you would integrate with your email service to send the newsletter
		// This is a placeholder for the actual email sending implementation
		// const emailsSent = await sendBulkEmail({
		//   to: subscribers.map(sub => sub.email),
		//   subject,
		//   html: content
		// });

		return NextResponse.json({
			success: true,
			message: `Newsletter queued for ${subscribers.length} subscribers`,
			subscriberCount: subscribers.length,
		});
	} catch (error) {
		console.error('Error sending newsletter:', error);

		if (error instanceof Response) {
			return NextResponse.json(
				{ error: error.statusText },
				{ status: error.status },
			);
		}

		return NextResponse.json(
			{ error: 'An error occurred while sending the newsletter' },
			{ status: 500 },
		);
	}
}

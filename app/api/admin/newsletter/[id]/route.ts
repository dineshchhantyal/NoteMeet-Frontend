import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// Authorize admin helper function
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

// PATCH - Update subscriber status
export async function PATCH(
	req: NextRequest,
	context: { params: { id: string } },
) {
	try {
		await authorizeAdmin();

		if (!db) {
			throw new Error('Database connection not available');
		}

		const { id } = context.params;
		const body = await req.json();
		const { status } = body;

		if (!status || !['active', 'unsubscribed'].includes(status)) {
			return NextResponse.json(
				{ error: 'Invalid status value' },
				{ status: 400 },
			);
		}

		const updated = await db.newsletterSubscription.update({
			where: { id },
			data: { status },
		});

		return NextResponse.json(updated);
	} catch (error) {
		console.error('Error updating subscriber:', error);

		if (error instanceof Response) {
			return NextResponse.json(
				{ error: error.statusText },
				{ status: error.status },
			);
		}

		return NextResponse.json(
			{ error: 'An error occurred while updating the subscriber' },
			{ status: 500 },
		);
	}
}

// DELETE - Remove a subscriber
export async function DELETE(
	req: NextRequest,
	context: { params: { id: string } },
) {
	try {
		await authorizeAdmin();

		if (!db) {
			throw new Error('Database connection not available');
		}

		const { id } = context.params;

		await db.newsletterSubscription.delete({
			where: { id },
		});

		return NextResponse.json({
			success: true,
			message: 'Subscriber successfully removed',
		});
	} catch (error) {
		console.error('Error deleting subscriber:', error);

		if (error instanceof Response) {
			return NextResponse.json(
				{ error: error.statusText },
				{ status: error.status },
			);
		}

		return NextResponse.json(
			{ error: 'An error occurred while removing the subscriber' },
			{ status: 500 },
		);
	}
}

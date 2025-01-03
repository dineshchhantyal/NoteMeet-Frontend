import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';

// Function to authorize an admin
async function authorizeAdmin() {
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	if (user.role !== UserRole.ADMIN) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
}

// API route to get users by subscription plan
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		// Authorize admin access
		await authorizeAdmin();

		const subscriptionPlanId = params.id;

		// Check if the subscription plan exists
		let subscriptionPlan;
		try {
			subscriptionPlan = await db.subscriptionPlan.findUnique({
				where: { id: subscriptionPlanId },
			});

			if (!subscriptionPlan) {
				return NextResponse.json(
					{ error: 'Subscription plan not found' },
					{ status: 404 },
				);
			}
		} catch (error) {
			console.error('Error in GET subscriptions/users/[id]:', error);
			return NextResponse.json(
				{ error: 'Internal server error' },
				{ status: 500 },
			);
		}

		// Fetch users associated with the subscription plan
		const users = await db.subscription.findMany({
			where: {
				planId: subscriptionPlanId,
			},
			select: {
				id: true,
				activeUser: {
					select: {
						name: true,
						email: true,
					},
				},
				planId: true,
			},
		});

		// Return the list of users
		return NextResponse.json(users);
	} catch (error) {
		console.error('Error in GET subscriptions/users/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

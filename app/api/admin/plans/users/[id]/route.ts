import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';
import UserSubscriptionService from '@/actions/user-subscription-plan';

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
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		// Authorize admin access
		await authorizeAdmin();

		const subscriptionPlanId = (await params).id;

		// Check if the subscription plan exists
		let subscriptionPlan;
		try {
			subscriptionPlan = await db?.subscriptionPlan.findUnique({
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
		const users = await db?.subscription.findMany({
			where: {
				planId: subscriptionPlanId,
			},
			select: {
				id: true,
				activeUser: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				planId: true,
				createdAt: true,
				status: true,
			},
		});

		// Return the list of users
		return NextResponse.json({
			users,
			subscriptionPlan,
		});
	} catch (error) {
		console.error('Error in GET subscriptions/users/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const body = await req.json();
		const subscriptionId = body.subscriptionId;

		if (!subscriptionId) {
			return NextResponse.json(
				{ error: 'User ID is required' },
				{ status: 400 },
			);
		}

		const planId = (await params).id;

		if (!planId) {
			return NextResponse.json(
				{ error: 'Subscription ID is required' },
				{ status: 400 },
			);
		}

		const user = await currentUser();
		if (!user || user.role !== UserRole.ADMIN) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userSubscriptionService = new UserSubscriptionService(user);
		await userSubscriptionService.cancelSubscription(subscriptionId);

		return NextResponse.json({ message: 'User subscription canceled' });
	} catch (error) {
		console.error('Error in DELETE subscriptions/users/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

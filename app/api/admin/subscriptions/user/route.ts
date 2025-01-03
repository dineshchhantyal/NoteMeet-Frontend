import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import UserSubscriptionService from '@/actions/user-subscription-plan';

async function authorizeAdmin() {
	const user = await currentUser();
	if (!user) {
		throw new Error('Unauthorized');
	}
	if (user.role !== UserRole.ADMIN) {
		throw new Error('Unauthorized');
	}

	return user;
}

export async function POST(req: NextRequest) {
	const user = await authorizeAdmin();
	const body = await req.json();

	if (!body.userId || !body.subscriptionPlanId) {
		throw new Error('User ID and subscription plan ID are required');
	}

	const userSubscriptionService = new UserSubscriptionService(user);

	await userSubscriptionService.userSubscribeToPlan(
		body.userId,
		body.subscriptionPlanId,
	);

	return NextResponse.json({ message: 'Subscription updated' });
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import UserSubscriptionService from '@/actions/user-subscription-plan';

export async function GET() {
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!user.subscriptionId) {
		return NextResponse.json(
			{ error: 'No subscription found' },
			{ status: 404 },
		);
	}

	try {
		const subscription = await db?.subscription.findUnique({
			where: { id: user.subscriptionId },
		});
		if (!subscription) {
			return NextResponse.json(
				{ error: 'Subscription not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json(subscription);
	} catch (error) {
		console.error('Error in GET subscriptions/me:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	const { subscriptionId } = await req.json();
	// Fetch the current user
	const loggedInUser = await currentUser();

	if (!loggedInUser || !loggedInUser.id) {
		throw new Error('User not found or not authenticated');
	}

	const userSubscriptionService = new UserSubscriptionService(loggedInUser);

	await userSubscriptionService.userSubscribeToPlan(
		loggedInUser.id,
		subscriptionId,
	);

	return NextResponse.json({ message: 'Subscription updated' });
}

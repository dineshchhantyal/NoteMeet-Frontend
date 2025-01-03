import UserSubscriptionService from '@/actions/user-subscription-plan';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';

async function PATCH(req: Request) {
	try {
		const user = await currentUser();
		if (!user || user.role !== UserRole.ADMIN) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { subscriptionId } = await req.json();

		const subscriptionService = new UserSubscriptionService(user);
		await subscriptionService.renewSubscription(subscriptionId);

		return NextResponse.json({ message: 'Subscription renewed' });
	} catch (error) {
		console.error('Error in PATCH /api/admin/subsciption:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export { PATCH };

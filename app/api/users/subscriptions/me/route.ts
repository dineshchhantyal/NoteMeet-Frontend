import UserSubscriptionService from '@/actions/user-subscription-plan';
import { currentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
	const user = await currentUser();

	if (!user || !user.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userSubscriptionService = new UserSubscriptionService(user);

	const { subscriptions, limits } =
		await userSubscriptionService.getUserTotalLimits(user.id);

	return NextResponse.json({ subscriptions, limits });
}

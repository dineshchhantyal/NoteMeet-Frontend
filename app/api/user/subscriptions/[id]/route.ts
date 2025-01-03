import UserSubscriptionService from '@/actions/user-subscription-plan';
import { currentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const user = await currentUser();

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;

	const userSubscriptionService = new UserSubscriptionService(user);

	const { subscriptions, limits } =
		await userSubscriptionService.getUserTotalLimits(id);

	return NextResponse.json({ subscriptions, limits });
}

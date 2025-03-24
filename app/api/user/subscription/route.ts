import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import UserSubscriptionService from '@/actions/user-subscription-plan';

export async function GET() {
	try {
		const user = await currentUser();

		if (!user || !user.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const subscriptionService = new UserSubscriptionService(user);

		// Get all subscription data in parallel for efficiency
		const [subscriptionPlans, totalLimits, remainingLimits] = await Promise.all(
			[
				subscriptionService.getUserSubscriptionPlans(user.id),
				subscriptionService.getUserTotalLimits(user.id),
				subscriptionService.getUserRemainingLimits(user.id),
			],
		);

		return NextResponse.json({
			subscriptions: subscriptionPlans.subscriptions.map((sub) => ({
				id: sub.id,
				planId: sub.planId,
				planName: sub.plan.name,
				status: sub.status,
				billingPeriod: sub.billingPeriod,
				startDate: sub.startDate,
				endDate: sub.endDate,
				price: {
					base: sub.basePrice,
					total: sub.totalPrice,
				},
			})),
			limits: totalLimits.limits,
			remaining: remainingLimits,
			isEarlyAccess:
				await subscriptionService.isUserSubscribedToEarlyAccessPlan(user.id),
		});
	} catch (error) {
		console.error('Error fetching subscription data:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch subscription information' },
			{ status: 500 },
		);
	}
}

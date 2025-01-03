'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubscriptionPlanSchema } from '@/schemas/subscriptions';
import { BillingPeriod, SubscriptionTier, UserRole } from '@prisma/client';
import { z } from 'zod';

export async function createSubscriptionPlan(
	data: z.infer<typeof SubscriptionPlanSchema>,
) {
	try {
		const user = await currentUser();
		if (!user || user.role !== UserRole.ADMIN) {
			return { error: 'Unauthorized' };
		}
		const {
			name,
			tier,
			description,
			basePrice,
			currency,
			features,
			meetingsAllowed,
			meetingDuration,
			storageLimit,
			billingPeriods,
			trialDays,
		} = data;

		try {
			// Create the subscription plan in the database
			const newPlan = await db.subscriptionPlan.create({
				data: {
					name,
					tier: tier as SubscriptionTier,
					description: description as string,
					basePrice:
						typeof basePrice === 'number' ? basePrice : parseFloat(basePrice),
					currency: currency as string,
					features: features as string[],
					meetingsAllowed: meetingsAllowed as number,
					meetingDuration: meetingDuration as number,
					storageLimit: storageLimit as number,
					billingPeriods: billingPeriods as BillingPeriod,
					trialDays: trialDays as number,
				},
			});

			return { success: 'Subscription created successfully' };
		} catch (error) {
			console.error('Error creating subscription:', error);
			return { error: 'Failed to create subscription' };
		}
	} catch (error) {
		console.error('Error creating subscription:', error);
		return { error: 'Failed to create subscription' };
	}
}

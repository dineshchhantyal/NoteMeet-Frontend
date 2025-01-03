'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import {
	AddUserToSubscriptionPlanSchema,
	SubscriptionPlanSchema,
	UpdateSubscriptionPlanSchema,
} from '@/schemas/subscriptions';
import { BillingPeriod, SubscriptionTier, UserRole } from '@prisma/client';
import { z } from 'zod';
import UserSubscriptionService from './user-subscription-plan';

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

			return { success: 'Subscription created successfully', data: newPlan };
		} catch (error) {
			console.error('Error creating subscription:', error);
			return { error: 'Failed to create subscription' };
		}
	} catch (error) {
		console.error('Error creating subscription:', error);
		return { error: 'Failed to create subscription' };
	}
}

export async function updateSubscriptionPlan(
	data: z.infer<typeof UpdateSubscriptionPlanSchema>,
) {
	try {
		const user = await currentUser();
		if (!user || user.role !== UserRole.ADMIN) {
			return { error: 'Unauthorized' };
		}

		const { id, ...rest } = data;

		const updatedPlan = await db.subscriptionPlan.update({
			where: { id: id },
			data: rest,
		});

		return { success: 'Subscription updated successfully', data: updatedPlan };
	} catch (error) {
		console.error('Error updating subscription:', error);
		return { error: 'Failed to update subscription' };
	}
}

export async function addUserToSubscriptionPlan(
	data: z.infer<typeof AddUserToSubscriptionPlanSchema>,
) {
	try {
		const user = await currentUser();
		if (!user) {
			return { error: 'Unauthorized' };
		}
		const { email, subscriptionPlanId } = data;

		const customer = await db.user.findFirst({
			where: { email },
		});

		if (!customer) {
			return { error: 'User not found' };
		}

		const subcriptionService = new UserSubscriptionService(user);

		await subcriptionService.userSubscribeToPlan(
			customer.id,
			subscriptionPlanId,
		);

		return { success: 'User added to subscription successfully' };
	} catch (error) {
		console.error('Error adding user to subscription:', error);
		return { error: 'Failed to add user to subscription' };
	}
}

export async function getUserByEmail(email: string) {
	try {
		const user = await db.user.findUnique({ where: { email } });
		return user;
	} catch (error) {
		console.error('Error getting user by email:', error);
		return null;
	}
}

import { z } from 'zod';
import { SubscriptionTier, BillingPeriod, Currency } from '@prisma/client';

export const SubscriptionPlanSchema = z.object({
	name: z.string().min(1, {
		message: 'Please provide a name for the subscription plan.',
	}),
	isActive: z.boolean().optional(),
	isPublic: z.boolean().optional(),
	tier: z.nativeEnum(SubscriptionTier, {
		message: 'Please select a subscription tier.',
	}),
	basePrice: z.number().min(0, {
		message: 'Base price must be a positive number.',
	}),
	currency: z.nativeEnum(Currency, {
		message: 'Please select a valid currency.',
	}),
	billingPeriods: z.nativeEnum(BillingPeriod, {
		message: 'Please choose at least one billing period.',
	}),
	meetingsAllowed: z.number().min(1, {
		message: 'Please specify the number of meetings allowed.',
	}),
	meetingDuration: z.number().min(1, {
		message: 'Meeting duration must be at least 1 minute.',
	}),
	storageLimit: z.number().min(1, {
		message: 'Please specify the amount of cloud storage in GB.',
	}),
	features: z
		.array(z.string())
		.min(0, {
			message: 'Please provide at least one feature for the subscription.',
		})
		.optional(),
	description: z.string().optional(),
	trialDays: z
		.number()
		.min(0, {
			message: 'Trial days must be a non-negative number.',
		})
		.optional(),
});

export const UpdateSubscriptionPlanSchema = SubscriptionPlanSchema.extend({
	id: z.string(),
});

export const AddUserToSubscriptionPlanSchema = z.object({
	email: z.string().email(),
	subscriptionPlanId: z.string(),
});

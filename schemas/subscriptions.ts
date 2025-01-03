import { z } from 'zod';

export enum SubscriptionPlan {
	FREE = 'FREE',
	TRIAL = 'TRIAL',
	PRO = 'PRO',
	BUSINESS = 'BUSINESS',
	CUSTOM = 'CUSTOM',
}

export enum SubscriptionStatus {
	ACTIVE = 'ACTIVE',
	CANCELED = 'CANCELED',
	EXPIRED = 'EXPIRED',
}

export enum SubscriptionBillingCycle {
	MONTHLY = 'MONTHLY',
	YEARLY = 'YEARLY',
}

export enum SubscriptionBillingFrequency {
	ONE_TIME = 'ONE_TIME',
	RECURRING = 'RECURRING',
}

export enum SubscriptionCurrency {
	USD = 'USD',
	EUR = 'EUR',
	GBP = 'GBP',
}

export interface Subscription {
	id: string;
	name: string;
	cost: number;
	currency: SubscriptionCurrency;
	billingCycle: SubscriptionBillingCycle;
	billingFrequency: SubscriptionBillingFrequency;
	description?: string;
	plan: SubscriptionPlan;
	startDate: Date;
	endDate?: Date;
	meetingsAllowed: number;
	meetingDuration: number;
	cloudStorage: number;
	customLimits?: any;
	createdAt: Date;
	updatedAt: Date;
	features: string[];
}

export const SubscriptionSchema = z.object({
	name: z.string().min(1, {
		message: 'Please provide a name for the subscription plan.',
	}),
	cost: z.number().min(0, {
		message: 'Cost must be a positive number.',
	}),
	currency: z.nativeEnum(SubscriptionCurrency, {
		message: 'Please select a valid currency.',
	}),
	billingCycle: z.nativeEnum(SubscriptionBillingCycle, {
		message: 'Please choose a billing cycle (Monthly or Yearly).',
	}),
	billingFrequency: z.nativeEnum(SubscriptionBillingFrequency, {
		message: 'Please specify the billing frequency (One-time or Recurring).',
	}),
	plan: z.nativeEnum(SubscriptionPlan, {
		message: 'Please select a subscription plan.',
	}),
	meetingsAllowed: z.number().min(1, {
		message: 'Please specify the number of meetings allowed.',
	}),
	meetingDuration: z.number().min(1, {
		message: 'Meeting duration must be at least 1 minute.',
	}),
	cloudStorage: z.number().min(1, {
		message: 'Please specify the amount of cloud storage in GB.',
	}),
	features: z
		.array(z.string())
		.min(1, {
			message: 'Please provide at least one feature for the subscription.',
		})
		.optional(),
	description: z.string().optional(),
});

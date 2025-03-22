import { BillingPeriod, SubscriptionTier } from '@prisma/client';

export interface SubscriptionPlan {
	id: string;
	name: string;
	description?: string;

	// Match Prisma schema fields
	tier: SubscriptionTier;
	isActive: boolean;
	isPublic: boolean;
	public: boolean;

	// Pricing (using schema field names)
	basePrice: number;
	currency: string;

	// Features and Limits
	features: string[];
	meetingsAllowed: number;
	meetingDuration: number;
	storageLimit: number;

	// Billing settings
	billingPeriods: BillingPeriod;
	trialDays: number;

	// Timestamps
	createdAt: string | Date;
	updatedAt: string | Date;
}

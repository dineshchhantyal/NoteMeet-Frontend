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

export interface Subscription {
	id: string;
	name: string;
	cost: number;
	currency: string;
	billingCycle: string;
	billingFrequency: string;
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
}

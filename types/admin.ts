export enum UserRole {
	USER = 'USER',
	MODERATOR = 'MODERATOR',
	ADMIN = 'ADMIN',
}

export enum UserStatus {
	ACTIVE = 'ACTIVE',
	PENDING = 'PENDING',
	SUSPENDED = 'SUSPENDED',
}

export enum UserPlanType {
	MONTHLY = 'MONTHLY',
	YEARLY = 'YEARLY',
	LIFETIME = 'LIFETIME',
}

export enum UserSubscriptionStatus {
	ACTIVE = 'ACTIVE',
	CANCELED = 'CANCELED',
	PAST_DUE = 'PAST_DUE',
	UNPAID = 'UNPAID',
}

export type SortField =
	| 'name'
	| 'email'
	| 'createdAt'
	| 'lastActive'
	| 'status'
	| 'role';

export interface UserFilter {
	search: string;
	status?: UserStatus;
	role?: UserRole;
}

export interface UserSubscription {
	id: string;
	planName: string;
	planType: UserPlanType;
	status: UserSubscriptionStatus;
	price: number;
	startDate: string;
	endDate?: string;
}

export interface UserInvoice {
	id: string;
	amount: number;
	description: string;
	status: 'paid' | 'pending' | 'failed';
	date: string;
}

export interface User {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
	role: UserRole;
	status: UserStatus;
	bio?: string;
	createdAt: string;
	lastActiveAt?: string;
	billingEmail?: string;
	totalMeetings?: number;
	subscription?: UserSubscription;
	invoices?: UserInvoice[];
}

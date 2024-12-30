import { z } from 'zod';

export const subscriptionOptions = ['starter', 'pro', 'enterprise'] as const;
export const paymentMethodOptions = [
	'credit_card',
	'paypal',
	'bank_transfer',
] as const;
export const statusOptions = ['pending', 'approved', 'rejected'] as const;

export const earlyAccessSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email address'),
	company: z.string().min(2, 'Company name must be at least 2 characters'),
	subscription: z.enum(subscriptionOptions),
	paymentMethod: z.enum(paymentMethodOptions),
	features: z.array(z.string()).min(1, 'Select at least one feature'),
	message: z.string().optional(),
	agreeTerms: z
		.boolean()
		.refine((val) => val === true, 'You must agree to the terms'),
});

export type EarlyAccessForm = z.infer<typeof earlyAccessSchema>;

export interface EarlyAccessSubmission extends EarlyAccessForm {
	id: string;
	isVerified: boolean;
	status: (typeof statusOptions)[number];
	createdAt: string;
	updatedAt: string;
}

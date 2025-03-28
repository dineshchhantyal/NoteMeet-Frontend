import { newPassword } from '@/actions/password';
import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z.string().min(1, {
		message: 'Password is required',
	}),
	code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z.string().min(6, {
		message: 'Minimum 6 characters required',
	}),
	name: z.string().min(1, {
		message: 'Name is required',
	}),
});

export const ResetSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
});

export const NewPasswordSchema = z.object({
	password: z.string().min(6, {
		message: 'Minimum 6 characters required',
	}),
});

export const SettingsSchema = z
	.object({
		name: z.optional(z.string()),
		isTwoFactorEnabled: z.optional(z.boolean()),
		role: z.enum([UserRole.ADMIN, UserRole.USER]),
		email: z.optional(z.string().email()),
		password: z.optional(z.string().min(6)),
		newPassword: z.optional(z.string().min(6)),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false;
			}

			return true;
		},
		{
			message: 'New password is required',
			path: ['newPassword'],
		},
	)
	.refine(
		(data) => {
			if (data.newPassword && !data.password) {
				return false;
			}

			return true;
		},
		{
			message: 'Password is required',
			path: ['password'],
		},
	);

// Personal Info Schema
export const PersonalInfoSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	email: z.string().email({ message: 'Invalid email address' }),
});

// Password Update Schema
export const PasswordSchema = z.object({
	password: z.string().min(1, { message: 'Current password is required' }),
	newPassword: z
		.string()
		.min(6, { message: 'New password must be at least 6 characters' }),
});

// Communication Preferences Schema
export const CommunicationPreferencesSchema = z.object({
	emailNotifications: z.boolean().default(true),
	newsletterSubscribed: z.boolean().default(false),
});

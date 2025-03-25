'use server';

import * as z from 'zod';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import {
	PersonalInfoSchema,
	PasswordSchema,
	CommunicationPreferencesSchema,
} from '@/schemas';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

export const updatePersonalInfo = async (
	values: z.infer<typeof PersonalInfoSchema>,
) => {
	try {
		const user = await currentUser();

		if (!user) {
			return { error: 'Unauthorized' };
		}

		await db?.user.update({
			where: { id: user.id },
			data: {
				name: values.name,
				email: values.email,
			},
		});

		revalidatePath('/settings');
		return { success: 'Personal information updated successfully!' };
	} catch (error) {
		console.error('[SETTINGS_ERROR]', error);
		return { error: 'Failed to update personal information' };
	}
};

export const updatePassword = async (
	values: z.infer<typeof PasswordSchema>,
) => {
	try {
		const user = await currentUser();

		if (!user || !user.id) {
			return { error: 'Unauthorized' };
		}

		const dbUser = await db?.user.findUnique({
			where: { id: user.id },
		});

		if (!dbUser || !dbUser.password) {
			return { error: 'Invalid credentials' };
		}

		// Verify current password
		const isValid = await bcrypt.compare(values.password, dbUser.password);

		if (!isValid) {
			return { error: 'Current password is incorrect' };
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(values.newPassword, 10);

		// Update the password
		await db?.user.update({
			where: { id: user.id },
			data: { password: hashedPassword },
		});

		return { success: 'Password updated successfully!' };
	} catch (error) {
		console.error('[SETTINGS_ERROR]', error);
		return { error: 'Failed to update password' };
	}
};

export const toggleTwoFactor = async (enabled: boolean) => {
	try {
		const user = await currentUser();

		if (!user) {
			return { error: 'Unauthorized' };
		}

		await db?.user.update({
			where: { id: user.id },
			data: { isTwoFactorEnabled: enabled },
		});

		return {
			success: enabled
				? 'Two-factor authentication enabled'
				: 'Two-factor authentication disabled',
		};
	} catch (error) {
		console.error('[SETTINGS_ERROR]', error);
		return { error: 'Failed to update two-factor authentication' };
	}
};

export const updateCommunicationPreferences = async (
	values: z.infer<typeof CommunicationPreferencesSchema>,
) => {
	try {
		const user = await currentUser();

		if (!user || !user.email) {
			return { error: 'Unauthorized' };
		}

		// Update newsletter subscription
		if (values.newsletterSubscribed) {
			// Add to newsletter subscriptions
			await db?.newsletterSubscription.upsert({
				where: { email: user.email },
				update: { status: 'active' },
				create: {
					email: user.email,
					status: 'active',
				},
			});
		} else {
			// Update existing subscription to unsubscribed
			const existingSubscription = await db?.newsletterSubscription.findUnique({
				where: { email: user.email },
			});

			if (existingSubscription) {
				await db?.newsletterSubscription.update({
					where: { email: user.email },
					data: { status: 'unsubscribed' },
				});
			}
		}

		// For email notifications, we'll need to add this field to the User model
		// This is a placeholder assuming you'll migrate the schema later

		return { success: 'Communication preferences updated successfully!' };
	} catch (error) {
		console.error('[SETTINGS_ERROR]', error);
		return { error: 'Failed to update communication preferences' };
	}
};

export const updateAdminSettings = async (role: UserRole) => {
	try {
		const user = await currentUser();

		if (!user || user.role !== UserRole.ADMIN) {
			return { error: 'Unauthorized' };
		}

		// Admin-only operations here

		return { success: 'Admin settings updated successfully!' };
	} catch (error) {
		console.error('[SETTINGS_ERROR]', error);
		return { error: 'Failed to update admin settings' };
	}
};

export const settings = async ({ role }: { role?: UserRole }) => {
	try {
		const user = await currentUser();

		if (!user) {
			return { error: 'Unauthorized' };
		}

		if (user.role !== UserRole.ADMIN) {
			return { error: 'Only admins can change roles' };
		}

		if (role) {
			// Update the user's role
			await db?.user.update({
				where: { id: user.id },
				data: { role },
			});
		}

		revalidatePath('/settings');
		return { success: 'Settings updated successfully!' };
	} catch (error) {
		console.error('[SETTINGS_ERROR]', error);
		return { error: 'Failed to update settings' };
	}
};

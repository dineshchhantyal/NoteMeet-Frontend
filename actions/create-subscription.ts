'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubscriptionSchema } from '@/schemas/subscriptions';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

export async function createSubscription(
	data: z.infer<typeof SubscriptionSchema>,
) {
	try {
		const user = await currentUser();
		if (!user || user.role !== UserRole.ADMIN) {
			return { error: 'Unauthorized' };
		}

		await db.subscription.create({
			data: {
				...data,
			},
		});

		return { success: 'Subscription created successfully' };
	} catch (error) {
		console.error('Error creating subscription:', error);
		return { error: 'Failed to create subscription' };
	}
}

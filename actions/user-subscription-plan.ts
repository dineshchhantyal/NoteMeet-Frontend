import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth'; // Assuming this is how you get the current user
import { db } from '@/lib/db';
import {
	BillingPeriod,
	SubscriptionStatus,
	User,
	UserRole,
} from '@prisma/client';

/**
 * This class is used to manage user subscriptions and limits.
 * It is used to get the user's subscription plan, limits, and remaining limits.
 * It is also used to subscribe a user to a plan and cancel a user's subscription.
 * The user must be authenticated before using this class.
 *
 * @class UserSubscriptionService
 * @classdesc This class is used to manage user subscriptions and limits.
 * @method getUserSubscriptionPlan - Get the user's subscription plan
 * @method getUserLimits - Get the user's limits
 * @method getUserTotalLimits - Get the user's total limits
 * @method getUserRemainingLimits - Get the user's remaining limits
 * @method userSubscribeToPlan - Subscribe a user to a plan
 * @method userCancelSubscription - Cancel a user's subscription
 */
class UserSubscriptionService {
	private loggedInUser: Partial<User>;

	constructor(loggedInUser: Partial<User>) {
		this.loggedInUser = loggedInUser;
	}

	async getUserSubscriptionPlan(userId: string) {
		try {
			if (
				this.loggedInUser.id !== userId &&
				this.loggedInUser.role !== UserRole.ADMIN
			) {
				throw new Error(
					"You are not authorized to view this user's subscription plan",
				);
			}

			const user = await getUserById(userId);

			// If no user is found, return an error message
			if (!user) {
				throw new Error('User not found or not authenticated');
			}

			// Retrieve the user's subscription plan by their user ID
			const userSubscriptions = await db.subscription.findMany({
				where: { userId: user.id, status: SubscriptionStatus.ACTIVE },
				include: {
					plan: true,
				},
			});

			// If the user does not have a subscription, return a message indicating that
			if (!userSubscriptions) {
				throw new Error('No subscription plan found for the user');
			}

			// Return the subscription details
			return { subscriptions: userSubscriptions, user };
		} catch (error) {
			throw new Error('Error getting user subscription: ' + error);
		}
	}

	async getUserLimits(userId: string) {
		const user = await getUserById(userId);
		const subscription = await this.getUserSubscriptionPlan(userId);
		return { user, subscription };
	}

	async getUserTotalLimits(userId: string) {
		const subscriptions = await this.getUserSubscriptionPlan(userId);

		const limits = {
			storageLimit: 0,
			meetingDuration: 0,
			meetingsAllowed: 0,
		};

		for (const subscription of subscriptions.subscriptions) {
			limits.storageLimit += subscription.plan.storageLimit;
			limits.meetingDuration += subscription.plan.meetingDuration;
			limits.meetingsAllowed += subscription.plan.meetingsAllowed;
		}

		return limits;
	}

	async getUserRemainingLimits(userId: string) {
		const totalLimits = await this.getUserTotalLimits(userId);
		const meetingsCount = await db.meeting.count({ where: { userId } });
		const storage = await db.userStorage.findUnique({ where: { userId } });

		if (!storage) {
			throw new Error('User storage not found');
		}

		const remainingLimits = {
			storageLimit: totalLimits.storageLimit - storage.usedStorage,
			meetingDuration: totalLimits.meetingDuration,
			meetingsAllowed: totalLimits.meetingsAllowed - meetingsCount,
		};

		return remainingLimits;
	}

	async userSubscribeToPlan(userId: string, planId: string) {
		const plan = await this.getUserSubscriptionPlan(userId);
		if (plan.subscriptions.length > 0) {
			throw new Error(
				'User already has an active subscription, please cancel the current subscription before subscribing to a new plan',
			);
		}

		const subscription = await db.subscription.create({
			data: {
				userId,
				planId,
				status: SubscriptionStatus.ACTIVE,
				billingPeriod: BillingPeriod.MONTHLY,
				startDate: new Date(),
				basePrice: 0,
				totalPrice: 0,
			},
		});

		return subscription;
	}

	async userCancelSubscription(userId: string) {
		const subscription = await db.subscription.update({
			where: { userId_status: { userId, status: SubscriptionStatus.ACTIVE } },
			data: { status: SubscriptionStatus.CANCELED, updatedAt: new Date() },
		});
		return subscription;
	}
}

export default UserSubscriptionService;

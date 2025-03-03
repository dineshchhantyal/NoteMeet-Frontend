import { getUserById } from '@/data/user';
import { db } from '@/lib/db';
import {
	BillingPeriod,
	Subscription,
	SubscriptionPlan,
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
 * @method cancelSubscription - Cancel a subscription
 * @method renewSubscription - Renew a subscription
 */
class UserSubscriptionService {
	static earlyAccessPlanId = 'cm5oucr4l0000128d5xzw8qdh';
	private loggedInUser: Partial<User>;

	constructor(loggedInUser: Partial<User>) {
		this.loggedInUser = loggedInUser;
	}

	async getUserSubscriptionPlans(userId: string): Promise<{
		subscriptions: (Subscription & { plan: SubscriptionPlan })[];
		user: User;
	}> {
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
			const userSubscriptions = await db?.subscription.findMany({
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
		const subscriptions = await this.getUserSubscriptionPlans(userId);
		return { user, subscriptions };
	}

	async getUserTotalLimits(userId: string) {
		const { subscriptions } = await this.getUserSubscriptionPlans(userId);

		const limits = {
			storageLimit: 0,
			meetingDuration: 0,
			meetingsAllowed: 0,
		};

		for (const subscription of subscriptions) {
			limits.storageLimit += subscription.plan.storageLimit;
			limits.meetingDuration += subscription.plan.meetingDuration;
			limits.meetingsAllowed += subscription.plan.meetingsAllowed;
		}

		return { limits, subscriptions };
	}

	async getUserRemainingLimits(userId: string) {
		const totalLimits = await this.getUserTotalLimits(userId);
		const meetingsCount = (await db?.meeting.count({ where: { userId } })) ?? 0;

		// if not storage, create one
		const storage = await db?.userStorage.upsert({
			where: { userId },
			create: { userId, usedStorage: 0 },
			update: {},
		});

		if (!storage) {
			throw new Error('User storage not found');
		}

		const remainingLimits = {
			storageLimit: totalLimits.limits.storageLimit - storage.usedStorage,
			meetingDuration: totalLimits.limits.meetingDuration,
			meetingsAllowed: totalLimits.limits.meetingsAllowed - meetingsCount,
		};

		return remainingLimits;
	}

	async userSubscribeToPlan(userId: string, planId: string) {
		const subscriptions = await this.getUserSubscriptionPlans(userId);

		const isAlreadySubscribed = subscriptions.subscriptions.some(
			(subscription) => subscription.planId === planId,
		);

		if (isAlreadySubscribed) {
			throw new Error('User already has an active subscription');
		}

		const subscription = await db?.subscription.create({
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

	async userCancelAllActiveSubscriptions(userId: string) {
		const subscription = await db?.subscription.updateMany({
			where: {
				userId,
				status: SubscriptionStatus.ACTIVE,
			},
			data: { status: SubscriptionStatus.CANCELED, updatedAt: new Date() },
		});
		return subscription;
	}

	async userCancelSubscription(userId: string, planId: string) {
		console.log('userId', userId);
		console.log('planId', planId);
		const subscription = await db?.subscription.updateMany({
			where: {
				planId,
				userId,
				status: SubscriptionStatus.ACTIVE,
			},
			data: { status: SubscriptionStatus.CANCELED, updatedAt: new Date() },
		});

		return subscription;
	}

	async cancelSubscription(subscriptionId: string) {
		const subscription = await db?.subscription.update({
			where: { id: subscriptionId },
			data: { status: SubscriptionStatus.CANCELED, updatedAt: new Date() },
		});
		return subscription;
	}

	async renewSubscription(subscriptionId: string) {
		const subscription = await db?.subscription.update({
			where: { id: subscriptionId },
			data: { status: SubscriptionStatus.ACTIVE, updatedAt: new Date() },
		});
		return subscription;
	}

	async isUserSubscribedToEarlyAccessPlan(userId: string) {
		const subscription = await db?.subscription.findFirst({
			where: {
				userId,
				planId: UserSubscriptionService.earlyAccessPlanId,
				status: SubscriptionStatus.ACTIVE,
			},
		});
		return !!subscription;
	}
}

export default UserSubscriptionService;

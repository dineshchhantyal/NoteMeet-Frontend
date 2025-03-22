import {
	PrismaClient,
	UserRole,
	BillingPeriod,
	SubscriptionTier,
} from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding...`);

	// Create admin user
	const adminPassword = await hash('Admin@123', 10);
	const admin = await prisma.user.upsert({
		where: { email: 'admin@notemeet.com' },
		update: {},
		create: {
			email: 'admin@notemeet.com',
			name: 'Admin User',
			password: adminPassword,
			role: UserRole.ADMIN,
			emailVerified: new Date(),
		},
	});
	console.log(`Created admin user: ${admin.email}`);

	// Create regular user
	const userPassword = await hash('User@123', 10);
	const user = await prisma.user.upsert({
		where: { email: 'user@notemeet.com' },
		update: {},
		create: {
			email: 'user@notemeet.com',
			name: 'Regular User',
			password: userPassword,
			role: UserRole.USER,
			emailVerified: new Date(),
		},
	});
	console.log(`Created regular user: ${user.email}`);

	// Create subscription plans with fixed IDs
	const freePlan = await prisma.subscriptionPlan.upsert({
		where: { id: 'free-plan-id' }, // Use a constant ID
		update: {},
		create: {
			id: 'free-plan-id', // Specify ID in create
			name: 'Free Plan',
			description: 'Basic features for personal use',
			basePrice: 0,
			currency: 'USD',
			billingPeriods: BillingPeriod.MONTHLY,
			tier: SubscriptionTier.FREE,
			features: ['1 user', 'Basic note-taking', 'Limited storage'],
			meetingsAllowed: 3,
			meetingDuration: 30, // minutes
			storageLimit: 1, // GB
			isActive: true,
			isPublic: true,
			public: true,
			trialDays: 0,
		},
	});
	console.log(`Created subscription plan: ${freePlan.name}`);

	const proPlan = await prisma.subscriptionPlan.upsert({
		where: { id: 'pro-plan-id' },
		update: {},
		create: {
			id: 'pro-plan-id',
			name: 'Pro Plan',
			description: 'Advanced features for professionals',
			basePrice: 19.99,
			currency: 'USD',
			billingPeriods: BillingPeriod.MONTHLY,
			tier: SubscriptionTier.PRO,
			features: [
				'Unlimited users',
				'Advanced note-taking',
				'Cloud storage',
				'Meeting recordings',
				'Priority support',
			],
			meetingsAllowed: 20,
			meetingDuration: 60, // minutes
			storageLimit: 10, // GB
			isActive: true,
			isPublic: true,
			public: true,
			trialDays: 14,
		},
	});
	console.log(`Created subscription plan: ${proPlan.name}`);

	const businessPlan = await prisma.subscriptionPlan.upsert({
		where: { id: 'business-plan-id' },
		update: {},
		create: {
			id: 'business-plan-id',
			name: 'Business Plan',
			description: 'Enterprise-grade features for teams',
			basePrice: 49.99,
			currency: 'USD',
			billingPeriods: BillingPeriod.MONTHLY,
			tier: SubscriptionTier.BUSINESS,
			features: [
				'Unlimited users',
				'Team collaboration',
				'Advanced security',
				'Custom integrations',
				'Dedicated support',
				'Analytics dashboard',
				'Admin controls',
			],
			meetingsAllowed: 100,
			meetingDuration: 120, // minutes
			storageLimit: 50, // GB
			isActive: true,
			isPublic: true,
			public: true,
			trialDays: 30,
		},
	});
	console.log(`Created subscription plan: ${businessPlan.name}`);

	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

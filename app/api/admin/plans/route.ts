import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function GET() {
	try {
		const user = await currentUser();

		// Non-admins only see active plans
		const subscriptions =
			user?.role === UserRole.ADMIN
				? await db?.subscriptionPlan.findMany()
				: await db?.subscriptionPlan.findMany({
						where: { isActive: true },
					});

		return NextResponse.json({
			success: true,
			data: subscriptions || [],
		});
	} catch (error) {
		console.error('Error fetching subscription plans:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch plans' },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		// Authorization check
		const user = await currentUser();

		if (!user) {
			return new Response(
				JSON.stringify({ success: false, error: 'Unauthorized' }),
				{ status: 401, headers: { 'Content-Type': 'application/json' } },
			);
		}

		if (user.role !== UserRole.ADMIN) {
			return new Response(
				JSON.stringify({ success: false, error: 'Forbidden' }),
				{ status: 403, headers: { 'Content-Type': 'application/json' } },
			);
		}

		// Parse request body
		const formData = await req.json();

		// No need to transform - use the form data directly
		// The form already matches the schema
		const subscriptionPlan = await db?.subscriptionPlan.create({
			data: {
				name: formData.name,
				description: formData.description,
				basePrice: formData.basePrice,
				currency: formData.currency,
				billingPeriods: formData.billingPeriods,
				tier: formData.tier,
				meetingsAllowed: formData.meetingsAllowed,
				meetingDuration: formData.meetingDuration,
				storageLimit: formData.storageLimit,
				isActive: formData.isActive,
				isPublic: formData.isPublic,
				public: formData.public,
				trialDays: formData.trialDays,
				features: formData.features || [],
			},
		});

		// Return success
		return new Response(
			JSON.stringify({ success: true, data: subscriptionPlan }),
			{ status: 201, headers: { 'Content-Type': 'application/json' } },
		);
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error';
		console.error('Plan creation error:', errorMessage);

		return new Response(
			JSON.stringify({ success: false, error: errorMessage }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const authResult = await authorizeAdmin();
		if (authResult) return authResult;

		const { id, ...data } = await req.json();

		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Plan ID is required' },
				{ status: 400 },
			);
		}

		const updated = await db?.subscriptionPlan.update({
			where: { id },
			data,
		});

		return NextResponse.json({ success: true, data: updated });
	} catch (error) {
		console.error('Error updating subscription plan:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update subscription plan' },
			{ status: 500 },
		);
	}
}

// Helper function for admin authorization that returns a response object if unauthorized
async function authorizeAdmin() {
	const user = await currentUser();

	if (!user) {
		return NextResponse.json(
			{ success: false, error: 'Unauthorized' },
			{ status: 401 },
		);
	}

	if (user.role !== UserRole.ADMIN) {
		return NextResponse.json(
			{ success: false, error: 'Forbidden: Admin access required' },
			{ status: 403 },
		);
	}

	// Return null if authorized (this is important!)
	return null;
}

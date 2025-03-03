import UserSubscriptionService from '@/actions/user-subscription-plan';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';

import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const forms = await db?.earlyAccessForm.findMany({
			orderBy: { createdAt: 'desc' },
		});
		return NextResponse.json({ success: true, data: forms });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: Request) {
	try {
		const loggedInUser = await isApproved();
		const { id, status, isVerified } = await request.json();
		const updatedEntry = await db?.earlyAccessForm.update({
			where: { id },
			data: {
				status,
				isVerified,
			},
		});

		if (!updatedEntry) {
			return NextResponse.json(
				{ success: false, error: 'Entry not found' },
				{ status: 404 },
			);
		}

		const user = await db?.user.findUnique({
			where: { email: updatedEntry.email },
		});

		if (!user) {
			throw new Error('User not found');
		}

		const earlyAccessPlanId = 'cm5gdkrv00000le8ly7x83j8v'; // early access plan id

		const subscriptionService = new UserSubscriptionService(loggedInUser);
		await subscriptionService.userSubscribeToPlan(user.id, earlyAccessPlanId);

		return NextResponse.json({ success: true, data: updatedEntry });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}

async function isApproved() {
	const user = await currentUser();
	if (!user || user.role !== UserRole.ADMIN) {
		throw new Error('Unauthorized');
	}

	return user;
}

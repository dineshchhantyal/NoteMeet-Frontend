import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';

async function authorizeAdmin() {
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	if (user.role !== UserRole.ADMIN) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
}

export async function GET(
	req: NextRequest,
	{ params }: { params: { subscriptionId: string } },
) {
	try {
		await authorizeAdmin();
		const subscriptionId = params.subscriptionId;
		let subscription;
		try {
			subscription = await db.subscription.findUnique({
				where: { id: subscriptionId },
			});

			if (!subscription) {
				return NextResponse.json(
					{ error: 'Subscription not found' },
					{ status: 404 },
				);
			}
		} catch (error) {
			console.error('Error in GET subscriptions/users/[id]:', error);
			return NextResponse.json(
				{ error: 'Internal server error' },
				{ status: 500 },
			);
		}

		const users = await db.user.findMany({
			where: { subscriptionId: subscriptionId },
		});

		return NextResponse.json(users);
	} catch (error) {
		console.error('Error in GET subscriptions/users/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

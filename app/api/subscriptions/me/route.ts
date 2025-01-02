import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export async function GET() {
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!user.subscriptionId) {
		return NextResponse.json(
			{ error: 'No subscription found' },
			{ status: 404 },
		);
	}

	try {
		const subscription = await db.subscription.findUnique({
			where: { id: user.subscriptionId },
		});
		if (!subscription) {
			return NextResponse.json(
				{ error: 'Subscription not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json(subscription);
	} catch (error) {
		console.error('Error in GET subscriptions/me:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await req.json();

	if (body && body.subscriptionId) {
		const subscription = await db.subscription.findUnique({
			where: { id: body.subscriptionId },
		});

		// payment must be made before updating the subscription
		if (subscription) {
			user.subscriptionId = subscription.id;
			await db.user.update({
				where: { id: user.id },
				data: { subscriptionId: subscription.id },
			});
		}
	}

	return NextResponse.json({ message: 'Subscription updated' });
}

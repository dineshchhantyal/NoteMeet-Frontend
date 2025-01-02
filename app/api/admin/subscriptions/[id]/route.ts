import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	await authorizeAdmin();
	const subscription = await db.subscription.findUnique({
		where: { id: params.id },
	});
	if (!subscription) {
		return NextResponse.json(
			{ error: 'Subscription not found' },
			{ status: 404 },
		);
	}
	return NextResponse.json(subscription);
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	await authorizeAdmin();
	const subscription = await db.subscription.delete({
		where: { id: params.id },
	});
	return NextResponse.json(subscription);
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	await authorizeAdmin();
	const body = await req.json();
	const subscription = await db.subscription.update({
		where: { id: params.id },
		data: body,
	});
	return NextResponse.json(subscription);
}

async function authorizeAdmin() {
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	if (user.role !== UserRole.ADMIN) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
}

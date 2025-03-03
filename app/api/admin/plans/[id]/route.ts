import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	await authorizeAdmin();
	const subscriptionPlan = await db?.subscriptionPlan.findUnique({
		where: { id: (await params).id },
	});
	if (!subscriptionPlan) {
		return NextResponse.json(
			{ error: 'Subscription plan not found' },
			{ status: 404 },
		);
	}
	return NextResponse.json(subscriptionPlan);
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	await authorizeAdmin();
	const subscriptionPlan = await db?.subscriptionPlan.delete({
		where: { id: (await params).id },
	});
	return NextResponse.json(subscriptionPlan);
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	await authorizeAdmin();
	const body = await req.json();
	const subscriptionPlan = await db?.subscriptionPlan.update({
		where: { id: (await params).id },
		data: body,
	});
	return NextResponse.json(subscriptionPlan);
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

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function GET() {
	const subscriptions = await db.subscriptionPlan.findMany();
	return NextResponse.json(subscriptions);
}

export async function POST(req: NextRequest) {
	await authorizeAdmin();
	const body = await req.json();

	const subscriptionPlan = await db.subscriptionPlan.create({
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

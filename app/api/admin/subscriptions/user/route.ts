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

export async function POST(req: NextRequest) {
	await authorizeAdmin();
	const body = await req.json();

	const subscription = await db.user.update({
		where: { id: body.userId },
		data: {
			subscriptionId: body.subscriptionId,
			status: body.status,
		},
	});

	return NextResponse.json(subscription);
}

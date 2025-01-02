import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const subscription = await db.subscription.findUnique({
		where: { id: params.id },
	});
	return NextResponse.json(subscription);
}

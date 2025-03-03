import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const subscription = await db?.subscription.findUnique({
		where: { id: (await params).id },
	});
	return NextResponse.json(subscription);
}

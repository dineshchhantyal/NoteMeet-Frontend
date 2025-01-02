import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
	const subscriptions = await db.subscription.findMany();
	return NextResponse.json(subscriptions);
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const subscription = await db.subscription.create({
		data: body,
	});
	return NextResponse.json(subscription);
}

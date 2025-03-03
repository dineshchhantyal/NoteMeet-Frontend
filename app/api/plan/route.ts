import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Get all subscription plans
export async function GET() {
	const subscriptions = await db?.subscription.findMany();
	return NextResponse.json(subscriptions);
}

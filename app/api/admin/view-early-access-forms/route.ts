import { db } from '@/lib/db';

import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const forms = await db.earlyAccessForm.findMany({
			orderBy: { createdAt: 'desc' },
		});
		return NextResponse.json({ success: true, data: forms });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: Request) {
	try {
		const { id, status, isVerified } = await request.json();
		const updatedEntry = await db.earlyAccessForm.update({
			where: { id },
			data: {
				status,
				isVerified,
			},
		});
		await db.user.update({
			where: { email: updatedEntry.email },
			data: {
				isEarlyAccess: status === 'approved',
			},
		});

		return NextResponse.json({ success: true, data: updatedEntry });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}

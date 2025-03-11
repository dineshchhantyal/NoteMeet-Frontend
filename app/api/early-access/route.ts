import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	if (req.method === 'POST') {
		const {
			name,
			email,
			company,
			subscription,
			paymentMethod,
			features,
			message,
			agreeTerms,
		} = await req.json();

		try {
			const newEntry = await db?.earlyAccessForm.create({
				data: {
					name,
					email,
					company,
					subscription,
					paymentMethod,
					features,
					message,
					agreeTerms,
				},
			});
			return NextResponse.json(
				{ success: true, data: newEntry },
				{ status: 201 },
			);
		} catch (error) {
			console.error(error);
			return NextResponse.json(
				{ success: false, error: 'Internal Server Error' },
				{ status: 500 },
			);
		}
	}
}

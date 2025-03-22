import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
	try {
		const session = await currentUser();

		if (!session?.email) {
			return NextResponse.json({ data: [] });
		}

		// Find all shares where the current user is the recipient
		const userShares = await db?.meetingShare.findMany({
			where: {
				email: session.email,
				status: 'ACCEPTED',
			},
			include: {
				meeting: true,
			},
		});

		// Transform the data to maintain the expected structure in the frontend
		const transformedData = userShares?.map((share) => ({
			...share,
		}));

		return NextResponse.json({
			data: transformedData,
		});
	} catch (error) {
		console.error('Error fetching shared meetings:', error);
		return NextResponse.json({ data: [] });
	}
}

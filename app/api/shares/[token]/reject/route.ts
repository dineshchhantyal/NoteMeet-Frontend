import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ token: string }> },
) {
	const user = await currentUser();

	if (!user || !user.id || !user.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { token } = await params;

	try {
		// Find the share by token
		const share = await db?.meetingShare.findUnique({
			where: { token },
		});

		if (!share) {
			return NextResponse.json(
				{ error: 'Invalid invitation' },
				{ status: 404 },
			);
		}

		// Update the share status
		const updatedShare = await db?.meetingShare.update({
			where: { id: share.id },
			data: {
				status: 'rejected',
				// No need for userId field
			},
		});

		return NextResponse.json({ success: true, share: updatedShare });
	} catch (error) {
		console.error('Error rejecting invitation:', error);
		return NextResponse.json(
			{ error: 'Failed to reject invitation' },
			{ status: 500 },
		);
	}
}

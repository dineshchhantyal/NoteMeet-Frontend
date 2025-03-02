import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

// GET - Access shared meeting by token
export async function GET(
	req: NextRequest,
	{ params }: { params: { token: string } },
) {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { token } = params;

		// Find the share by token
		const share = await db.meetingShare.findUnique({
			where: { token },
			include: {
				meeting: true,
			},
		});

		if (!share) {
			return NextResponse.json({ error: 'Share not found' }, { status: 404 });
		}

		// Check if the share is for the current user
		if (share.email !== user.email) {
			return NextResponse.json(
				{ error: 'This share is for a different user' },
				{ status: 403 },
			);
		}

		// Update the share status if it's pending
		if (share.status === 'pending') {
			await db.meetingShare.update({
				where: { id: share.id },
				data: {
					status: 'accepted',
					lastAccessAt: new Date(),
				},
			});
		} else {
			// Just update the last access time
			await db.meetingShare.update({
				where: { id: share.id },
				data: {
					lastAccessAt: new Date(),
				},
			});
		}

		return NextResponse.json({ share }, { status: 200 });
	} catch (error) {
		console.error('Error accessing shared meeting:', error);
		return NextResponse.json(
			{ error: 'Failed to access shared meeting' },
			{ status: 500 },
		);
	}
}

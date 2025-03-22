import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import crypto from 'crypto'; // Add this import

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
			include: {
				meeting: true,
			},
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
				status: 'accepted',
				lastAccessAt: new Date(),
			},
		});

		// For public link shares, create a new personal share
		if (share && share.email.startsWith('link_')) {
			// Create a new share with only the necessary fields
			await db?.meetingShare.create({
				data: {
					token: crypto.randomBytes(16).toString('hex'),
					meetingId: share.meetingId,
					email: user.email,
					permission: share.permission,
					status: 'accepted',
					createdBy: share.createdBy, // If using string field
					lastAccessAt: new Date(),
				},
			});
		}

		return NextResponse.json({ success: true, share: updatedShare });
	} catch (error) {
		console.error('Error accepting invitation:', error);
		return NextResponse.json(
			{ error: 'Failed to accept invitation' },
			{ status: 500 },
		);
	}
}

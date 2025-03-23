import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { checkMeetingUserAuthorization } from '@/lib/meeting';

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string; itemId: string }> },
) {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id: meetingId, itemId } = await params;

		// Check authorization
		await checkMeetingUserAuthorization(user, meetingId);

		// Get updates from request body
		const updates = await request.json();

		// In a real implementation, you'd update the item in the database
		// For now, just return success with the updates

		return NextResponse.json({
			success: true,
			message: 'Action item updated',
			itemId,
			updates,
		});
	} catch (error) {
		console.error('Error updating action item:', error);
		return NextResponse.json(
			{ error: 'Failed to update action item' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string; itemId: string }> },
) {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id: meetingId, itemId } = await params;

		// Check authorization
		await checkMeetingUserAuthorization(user, meetingId);

		// In a real implementation, you'd delete the item from the database
		// For now, just return success

		return NextResponse.json({
			success: true,
			message: 'Action item deleted',
			itemId,
		});
	} catch (error) {
		console.error('Error deleting action item:', error);
		return NextResponse.json(
			{ error: 'Failed to delete action item' },
			{ status: 500 },
		);
	}
}

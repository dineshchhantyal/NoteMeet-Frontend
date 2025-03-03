import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { currentUser } from '@/lib/auth';

// Update a share's permission
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string; shareId: string }> },
) {
	const user = await currentUser();

	if (!user || !user.id || !user.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id, shareId } = await params;

	try {
		// Check if user has access to this meeting
		const meeting = await db?.meeting.findFirst({
			where: {
				id,
				OR: [
					{ userId: user.id }, // User is the owner
					{
						shares: {
							some: {
								email: user.email, // Now we've verified email exists
								permission: 'ADMIN',
								status: 'accepted',
							},
						},
					},
				],
			},
		});

		if (!meeting) {
			return NextResponse.json(
				{ error: 'Meeting not found or access denied' },
				{ status: 404 },
			);
		}

		// Validate request body
		const schema = z.object({
			permission: z.enum(['VIEW', 'EDIT', 'ADMIN']),
		});

		const body = await req.json();
		const { permission } = schema.parse(body);

		// Update the share
		const share = await db?.meetingShare.update({
			where: { id: shareId },
			data: { permission },
		});

		return NextResponse.json({ share });
	} catch (error) {
		console.error('Error updating share:', error);
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 });
		}
		return NextResponse.json(
			{ error: 'Failed to update share' },
			{ status: 500 },
		);
	}
}

// Delete a share
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string; shareId: string }> },
) {
	const user = await currentUser();

	if (!user || !user.id || !user.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id, shareId } = await params;

	try {
		// Check if user has access to this meeting
		const meeting = await db?.meeting.findFirst({
			where: {
				id,
				OR: [
					{ userId: user.id }, // User is the owner
					{
						shares: {
							some: {
								email: user.email,
								permission: 'ADMIN',
								status: 'accepted',
							},
						},
					},
				],
			},
		});

		if (!meeting) {
			return NextResponse.json(
				{ error: 'Meeting not found or access denied' },
				{ status: 404 },
			);
		}

		// Delete the share
		await db?.meetingShare.delete({
			where: { id: shareId },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting share:', error);
		return NextResponse.json(
			{ error: 'Failed to delete share' },
			{ status: 500 },
		);
	}
}

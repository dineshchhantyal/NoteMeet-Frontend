import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { currentUser } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const currentAuthUser = await currentUser();

	if (!currentAuthUser || !currentAuthUser.id || !currentAuthUser.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;

	try {
		// Check if user has access to this meeting
		const meeting = await db.meeting.findFirst({
			where: {
				id,
				OR: [
					{ userId: currentAuthUser.id }, // User is the owner
					{
						shares: {
							some: {
								email: currentAuthUser.email,
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

		// Create an anonymous share link that doesn't have a specific email
		const token = crypto.randomUUID();
		const expiry = new Date();
		expiry.setDate(expiry.getDate() + 7); // Token expires in 7 days

		// Create or update the share link
		const share = await db.meetingShare.create({
			data: {
				meetingId: id,
				email: `link_${token.substring(0, 8)}@shareable.link`, // Create a placeholder email
				permission,
				token,
				status: 'pending', // The status is pending until someone claims it
				createdBy: currentAuthUser.id,
				// Set an expiry time for the link (not in schema yet)
			},
		});

		return NextResponse.json(
			{
				token: share.token,
				permission: share.permission,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error creating share link:', error);
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 });
		}
		return NextResponse.json(
			{ error: 'Failed to generate share link' },
			{ status: 500 },
		);
	}
}

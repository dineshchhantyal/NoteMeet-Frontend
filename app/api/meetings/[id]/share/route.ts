import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { currentUser } from '@/lib/auth';

// Get all shares for a meeting
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const user = await currentUser();

	if (!user || !user.id || !user.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;

	try {
		// Check if user has access to this meeting
		const meeting = await db.meeting.findFirst({
			where: {
				id,
				OR: [
					{ userId: user.id }, // User is the owner
					{
						shares: {
							some: {
								email: user.email,
								permission: { in: ['EDIT', 'ADMIN'] },
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

		// Get all shares
		const shares = await db.meetingShare.findMany({
			where: { meetingId: id },
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json({ shares });
	} catch (error) {
		console.error('Error fetching shares:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch shares' },
			{ status: 500 },
		);
	}
}

// Create a new share
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
			email: z.string().email(),
			permission: z.enum(['VIEW', 'EDIT', 'ADMIN']),
		});

		const body = await req.json();
		const { email, permission } = schema.parse(body);

		// Check if share already exists
		const existingShare = await db.meetingShare.findFirst({
			where: { meetingId: id, email },
		});

		if (existingShare) {
			return NextResponse.json(
				{ error: 'This email already has access to the meeting' },
				{ status: 400 },
			);
		}

		// Create new share
		const share = await db.meetingShare.create({
			data: {
				meetingId: id,
				email,
				permission,
				status: 'pending',
				token: crypto.randomUUID(), // Generate unique token
				createdBy: currentAuthUser.id, // Add this field
			},
		});

		// TODO: Send email notification to the invitee

		return NextResponse.json({ share }, { status: 201 });
	} catch (error) {
		console.error('Error creating share:', error);
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 });
		}
		return NextResponse.json(
			{ error: 'Failed to share meeting' },
			{ status: 500 },
		);
	}
}

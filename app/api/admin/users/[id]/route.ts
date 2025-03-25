import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { db } from '@/lib/db';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		// Authenticate and authorize admin user
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check if user is an admin
		if (user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Forbidden: Admin access required' },
				{ status: 403 },
			);
		}

		// Get user ID from params
		const userId = (await params).id;

		// Fetch user details with related data
		const userData = await db?.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				emailVerified: true,
				image: true,
				createdAt: true,
				meetings: {
					select: {
						id: true,
						title: true,
						createdAt: true,
						status: true,
					},
					take: 5,
					orderBy: { createdAt: 'desc' },
				},
				_count: {
					select: {
						meetings: true,
					},
				},
			},
		});

		if (!userData) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({ user: userData });
	} catch (error) {
		console.error('Error fetching user details:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user details' },
			{ status: 500 },
		);
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		// Authenticate and authorize
		const user = await currentUser();
		if (!user || user.role !== UserRole.ADMIN) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = (await params).id;
		const data = await req.json();

		// Fields that can be updated (whitelist approach)
		const allowedFields = ['name', 'email', 'bio', 'billingEmail'];

		// Filter only allowed fields
		const updateData: Record<string, string> = {};
		Object.keys(data).forEach((key) => {
			if (allowedFields.includes(key)) {
				updateData[key] = data[key];
			}
		});

		// Update the user
		const updatedUser = await db?.user.update({
			where: { id: userId },
			data: updateData,
		});

		return NextResponse.json({
			success: true,
			user: {
				id: updatedUser?.id,
				name: updatedUser?.name,
				email: updatedUser?.email,
			},
		});
	} catch (error) {
		console.error('Error updating user:', error);
		return NextResponse.json(
			{ error: 'Failed to update user' },
			{ status: 500 },
		);
	}
}

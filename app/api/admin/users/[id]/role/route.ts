import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@/types/admin';
import { db } from '@/lib/db';

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		// Authenticate and authorize the admin user
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

		// Parse the request body to get the new role
		const { role } = await req.json();

		// Validate the role
		if (!Object.values(UserRole).includes(role)) {
			return NextResponse.json(
				{ error: 'Invalid role specified' },
				{ status: 400 },
			);
		}

		// Don't allow changing your own role (security measure)
		if (userId === user.id) {
			return NextResponse.json(
				{ error: 'Cannot change your own role' },
				{ status: 400 },
			);
		}

		// Update the user's role in the database
		const updatedUser = await db?.user.update({
			where: { id: userId },
			data: { role },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				emailVerified: true,
				createdAt: true,
			},
		});

		return NextResponse.json({
			success: true,
			user: updatedUser,
		});
	} catch (error) {
		console.error('Error updating user role:', error);
		return NextResponse.json(
			{ error: 'Failed to update user role' },
			{ status: 500 },
		);
	}
}

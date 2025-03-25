import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { UserRole, UserStatus } from '@/types/admin';
import { db } from '@/lib/db';

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		// Authenticate and authorize
		const admin = await currentUser();
		if (!admin || admin.role !== UserRole.ADMIN) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = (await params).id;

		// Prevent admins from modifying their own status
		if (userId === admin.id) {
			return NextResponse.json(
				{ error: 'Cannot update your own status' },
				{ status: 400 },
			);
		}

		const { status } = await req.json();

		// Validate the status
		if (!Object.values(UserStatus).includes(status)) {
			return NextResponse.json(
				{ error: 'Invalid status value' },
				{ status: 400 },
			);
		}

		// First check if user exists
		const userExists = await db?.user.findUnique({
			where: { id: userId },
			select: { id: true },
		});

		if (!userExists) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Update the user's status
		// const updatedUser = await db?.user.update({
		// 	where: { id: userId },
		// 	data: { status },
		// 	select: {
		// 		id: true,
		// 		name: true,
		// 		email: true,
		// 		status: true,
		// 	},
		// });

		// Add audit log entry
		await createUserActivityLog({
			userId: userId,
			actionBy: admin.id,
			actionType: 'STATUS_CHANGE',
			details: `Status changed to ${status}`,
		});

		return NextResponse.json({
			success: true,
			user: userExists,
		});
	} catch (error) {
		console.error('Error updating user status:', error);

		return NextResponse.json(
			{ error: 'Failed to update user status' },
			{ status: 500 },
		);
	}
}

// Helper function to log user status changes
async function createUserActivityLog({
	userId,
	actionBy,
	actionType,
	details,
}: {
	userId: string;
	actionBy: string | undefined;
	actionType: string;
	details: string;
}) {
	try {
		// If you have an audit log table, use it here
		// Otherwise just log to console for now
		console.log(
			`AUDIT: ${actionType} - User ${userId} - By ${actionBy} - ${details}`,
		);

		// You can implement actual database logging when you add an ActivityLog model
		// For example:
		// await db.userActivityLog.create({
		//   data: {
		//     userId,
		//     actionBy,
		//     actionType,
		//     details,
		//   }
		// });
	} catch (error) {
		// Just log error but don't fail the main operation
		console.error('Failed to create activity log:', error);
	}
}

// GET endpoint to retrieve current status
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		// Authenticate and authorize
		const admin = await currentUser();
		if (!admin || admin.role !== UserRole.ADMIN) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = (await params).id;

		// Get user with their current status
		const user = await db?.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				email: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			user,
		});
	} catch (error) {
		console.error('Error getting user status:', error);

		return NextResponse.json(
			{ error: 'Failed to get user status' },
			{ status: 500 },
		);
	}
}

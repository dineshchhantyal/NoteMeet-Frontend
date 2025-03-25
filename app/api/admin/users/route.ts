import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
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

		// Parse query parameters
		const searchParams = req.nextUrl.searchParams;
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '10');
		const search = searchParams.get('search') || '';

		// Calculate pagination values
		const skip = (page - 1) * limit;
		// Build the where clause based on filters
		const where: Prisma.UserWhereInput = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ email: { contains: search, mode: 'insensitive' } },
			];
		}

		// Query users with pagination and filters
		const users = await db?.user.findMany({
			where,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				emailVerified: true,
				image: true,
				createdAt: true,
				// Count meetings and other relevant data
				_count: {
					select: {
						meetings: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
			skip,
			take: limit,
		});

		// Get the total count for pagination
		const totalUsers = (await db?.user.count({ where })) || 0;

		// Return the paginated results
		return NextResponse.json({
			users,
			pagination: {
				total: totalUsers,
				page,
				limit,
				pages: Math.ceil(totalUsers / limit),
			},
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch users' },
			{ status: 500 },
		);
	}
}

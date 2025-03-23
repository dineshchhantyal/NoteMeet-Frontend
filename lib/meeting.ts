import { User } from '@prisma/client';
import { db } from './db';

export async function checkMeetingUserAuthorization(
	user: Partial<User>,
	meetingId: string,
) {
	if (!meetingId) {
		throw new Error('Invalid meeting ID');
	}

	if (!user || !user.email) {
		throw new Error('Unauthorized');
	}

	const meeting = await db?.meeting.findUnique({
		where: { id: meetingId },
		include: { participants: true },
	});

	if (!meeting) {
		throw new Error('Meeting not found');
	}

	// Check if user is the owner
	if (meeting.userId === user.id) {
		return meeting; // Owner has full access
	}

	// If not owner, check for shares - IMPORTANT: add await here
	const shared = await db?.meetingShare.findFirst({
		where: {
			meetingId,
			email: user.email,
			status: 'accepted', // Only consider accepted shares
		},
	});

	console.log({ meeting, shared });

	// Only throw access denied if user is not owner AND has no share
	if (!shared) {
		throw new Error('Access denied - This meeting is not shared with you');
	}

	return meeting;
}

export async function checkTranscriberAuthorization(awsVerification: string) {
	const databaseUrl = process.env.DATABASE_URL!;

	if (!databaseUrl || !awsVerification || databaseUrl !== awsVerification) {
		throw new Error('Unauthorized');
	}

	return true;
}

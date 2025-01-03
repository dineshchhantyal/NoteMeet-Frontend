import { User } from '@prisma/client';
import { db } from './db';

export async function checkMeetingUserAuthorization(
	user: Partial<User>,
	meetingId: string,
) {
	if (!meetingId) {
		throw new Error('Invalid meeting ID');
	}

	if (!user) {
		throw new Error('Unauthorized');
	}

	const meeting = await db.meeting.findUnique({
		where: { id: meetingId },
		include: { participants: true },
	});

	if (!meeting || meeting.userId !== user.id) {
		throw new Error('Access denied');
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

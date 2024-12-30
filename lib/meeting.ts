import { currentUser } from './auth';
import { db } from './db';

export async function checkMeetingUserAuthorization(meetingId: string) {
	if (!meetingId) {
		throw new Error('Invalid meeting ID');
	}
	const user = await currentUser();

	if (!user) {
		throw new Error('Unauthorized');
	}

	const meeting = await db.meeting.findUnique({
		where: { id: meetingId },
		include: { createdBy: true },
	});

	if (!meeting || meeting.userId !== user.id) {
		throw new Error('Access denied');
	}

	return meeting;
}

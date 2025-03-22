import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const meetingId = (await params).id;

		// Fetch the meeting to get actual participants if available
		const meeting = await db?.meeting.findUnique({
			where: { id: meetingId },
			include: {
				participants: true,
			},
		});

		if (!meeting) {
			return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
		}

		// Get participant names (or use dummy data if not available)
		const participants = meeting.participants?.map((p) => p.email) || [
			'John Doe',
			'Jane Smith',
			'Mike Johnson',
			'Sarah Williams',
		];

		// Generate dummy topic distribution
		const keyTopics = [
			'Project Timeline',
			'Budget Review',
			'Design Updates',
			'Marketing Strategy',
			'Technical Discussion',
			'Client Feedback',
		];

		// Select 3-5 topics based on meeting id
		const meetingSpecificTopics = keyTopics.slice(
			0,
			(parseInt(meetingId.slice(-1), 16) % 3) + 3,
		);

		// Calculate total duration (30-90 minutes)
		const totalDuration = (30 + (parseInt(meetingId.slice(-2), 16) % 60)) * 60;

		// Generate analytics data
		const analytics = {
			totalDuration: totalDuration,
			attendees: participants.map((name, index) => {
				// Give the meeting creator more speaking time
				const isMeetingCreator = index === 0;
				const speakingTimeBase = isMeetingCreator ? 0.4 : 0.2;
				const variability =
					(parseInt(meetingId.slice(-3 + index), 16) % 10) / 100;

				return {
					name,
					// Speaking time varies by participant (with creator speaking more)
					speakingTime: Math.floor(
						(speakingTimeBase + variability) * totalDuration,
					),
					// Message count 5-35
					messageCount: Math.floor(Math.random() * 30) + 5,
					// Attendance rate 70-100%
					attendanceRate: Math.floor(Math.random() * 30) + 70,
				};
			}),
			topicDistribution: generateTopicDistribution(
				meetingSpecificTopics,
				totalDuration,
				meetingId,
			),
		};

		return NextResponse.json({ analytics });
	} catch (error) {
		console.error('Error generating meeting analytics:', error);
		return NextResponse.json(
			{ error: 'Failed to generate analytics' },
			{ status: 500 },
		);
	}
}

// Helper function to generate realistic topic distribution
function generateTopicDistribution(
	topics: string[],
	totalDuration: number,
	meetingId: string,
) {
	let remainingPercentage = 100;
	let remainingDuration = totalDuration;

	return topics.map((topic, index) => {
		const isLastTopic = index === topics.length - 1;

		if (isLastTopic) {
			return {
				topic,
				duration: remainingDuration,
				percentage: remainingPercentage,
			};
		}

		// Use meeting ID to create some variability
		const seed = parseInt(meetingId.slice(-2 + index), 16) % 20;
		const basePercentage = Math.floor(100 / topics.length);
		const percentage = basePercentage + (seed - 10);

		remainingPercentage -= percentage;
		const duration = Math.floor((percentage / 100) * totalDuration);
		remainingDuration -= duration;

		return {
			topic,
			duration,
			percentage,
		};
	});
}

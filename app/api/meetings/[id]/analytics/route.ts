import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { checkMeetingUserAuthorization } from '@/lib/meeting';

export async function GET(req: NextRequest) {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const meetingId = req.nextUrl.pathname.split('/').at(-2) as string;

		// Use the authorization helper to get the meeting
		const meeting = await checkMeetingUserAuthorization(user, meetingId);

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

		// Default topics if no summary exists
		const defaultTopics = [
			'Project Updates',
			'Q&A Session',
			'Strategy Discussion',
			'Budget Planning',
			'Action Items',
		];

		// Safely extract key topics from summary if it exists
		let keyTopics = defaultTopics;

		if (meeting.summary) {
			try {
				// Parse summary if it's a string, otherwise use it directly
				let summary;
				if (typeof meeting.summary === 'string') {
					summary = JSON.parse(meeting.summary);
				} else {
					summary = meeting.summary;
				}

				// Check we have a valid summary object with keyTopics
				if (
					summary &&
					Array.isArray(summary.keyTopics) &&
					summary.keyTopics.length > 0
				) {
					keyTopics = summary.keyTopics;
				}
			} catch (error) {
				console.error('Error parsing meeting summary:', error);
				// Continue with default topics if parsing fails
			}
		}

		// Select a subset of topics (3-5) based on meeting ID
		const getRandomInt = (min: number, max: number) => {
			// Simple hash function to get consistent results for the same meeting ID
			const hash: number = meetingId
				.split('')
				.reduce(
					(acc: number, char: string): number => acc + char.charCodeAt(0),
					0,
				);
			return min + (hash % (max - min + 1));
		};

		// Select 3-5 topics, but never more than we have available
		const numTopicsToSelect = Math.min(keyTopics.length, getRandomInt(3, 5));

		// Ensure we always select at least 1 topic
		const safeNumTopics = Math.max(1, numTopicsToSelect);

		// Select topics (take first N to keep it deterministic)
		const meetingSpecificTopics = keyTopics.slice(0, safeNumTopics);

		// Final safety check for empty array
		if (meetingSpecificTopics.length === 0) {
			meetingSpecificTopics.push('General Discussion');
		}

		// The selected code remains the same, just with type annotation added:
		const durationHash: number = meetingId
			.split('')
			.reduce(
				(acc: number, char: string): number => acc + char.charCodeAt(0),
				0,
			);
		const totalDuration = (30 + (durationHash % 60)) * 60;

		// Generate analytics data
		const analytics = {
			totalDuration: totalDuration,
			attendees: participants.map((name, index) => {
				// Give the meeting creator more speaking time
				const isMeetingCreator = index === 0;
				const speakingTimeBase = isMeetingCreator ? 0.4 : 0.2;

				// Create a stable "random" factor based on meeting ID and participant
				const charCode = (name.charCodeAt(0) || 65) % 10;
				const variability = charCode / 100;

				return {
					name,
					speakingTime: Math.floor(
						(speakingTimeBase + variability) * totalDuration,
					),
					messageCount: Math.floor(getRandomInt(5, 35)),
					attendanceRate: getRandomInt(70, 100),
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

// Improved function to generate realistic topic distribution
function generateTopicDistribution(
	topics: string[],
	totalDuration: number,
	meetingId: string,
) {
	// Safety check - if no topics, add a default one
	if (!topics || !Array.isArray(topics) || topics.length === 0) {
		topics = ['General Discussion'];
	}

	// Minimum percentage for any topic (5%)
	const minPercentage = 5;

	// Calculate how much percentage is available for variable allocation
	// after giving each topic the minimum
	const reservedPercentage = topics.length * minPercentage;
	const availablePercentage = 100 - reservedPercentage;

	// Create a consistent "random" distribution based on topic text and meeting ID
	const getTopicWeight = (topic: string, index: number) => {
		// Use characters from topic and meeting ID to create a hash
		const hash =
			(topic.charCodeAt(0) || 65) +
			(meetingId.charCodeAt(index % meetingId.length) || 65);
		return (hash % 10) + 1; // Weight between 1-10
	};

	// Calculate weights for variable distribution
	const weights = topics.map((topic, index) => getTopicWeight(topic, index));
	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

	// Distribute the available percentage according to weights
	const variablePercentages = weights.map((weight) =>
		Math.floor((weight / totalWeight) * availablePercentage),
	);

	// Calculate the final percentages (minimum + variable)
	const percentages = variablePercentages.map(
		(percent) => percent + minPercentage,
	);

	// Adjust for rounding errors to ensure sum is exactly 100%
	const sum = percentages.reduce((total, percent) => total + percent, 0);
	const diff = 100 - sum;

	if (diff !== 0) {
		// Add any remaining percentage to the largest topic
		const largestIndex = percentages.indexOf(Math.max(...percentages));
		percentages[largestIndex] += diff;
	}

	// Calculate durations based on percentages
	let remainingDuration = totalDuration;

	return topics.map((topic, index) => {
		const isLastTopic = index === topics.length - 1;
		const percentage = percentages[index];

		if (isLastTopic) {
			// Last topic gets any remaining duration to avoid rounding errors
			return {
				topic,
				duration: remainingDuration,
				percentage,
			};
		}

		// Calculate duration based on percentage
		const duration = Math.floor((percentage / 100) * totalDuration);
		remainingDuration -= duration;

		return {
			topic,
			duration,
			percentage,
		};
	});
}

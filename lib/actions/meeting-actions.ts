'use server';

import { db } from '@/lib/db';
import { Meeting, MeetingStatus } from '@/types/meeting';
import { Summary } from '@/types/summary';
import { Prisma } from '@prisma/client';
import { getObject, S3BucketType } from '@/lib/s3';

// Define a more specific type for the prisma meeting with relations
type DBMeetingWithRelations = Prisma.MeetingGetPayload<{
	include: {
		participants: true;
		notification: true;
	};
}>;

// Convert database meeting to our Meeting type
function convertToMeetingInterface(dbMeeting: DBMeetingWithRelations): Meeting {
	return {
		id: dbMeeting.id,
		title: dbMeeting.title,
		date: dbMeeting.date.toISOString().split('T')[0],
		time: dbMeeting.time,
		duration: String(dbMeeting.duration),
		videoKey: dbMeeting.videoKey || undefined,
		transcriptKey: dbMeeting.transcriptKey || undefined,
		transcriptUrl: dbMeeting.transcriptUrl || undefined,
		summary: dbMeeting.summary
			? (JSON.parse(dbMeeting.summary as string) as Summary)
			: undefined,
		status: dbMeeting.status as MeetingStatus,
		description: dbMeeting.description || '',
		provider: validateProvider(dbMeeting.provider),
		meetingLink: dbMeeting.meetingLink,
		participants: dbMeeting.participants?.map((p) => p.email) || [],
		notifications: {
			sendTranscript: dbMeeting.notification?.sendTranscript || false,
			sendSummary: dbMeeting.notification?.sendSummary || false,
		},
	};
}

// Helper function to validate provider type
function validateProvider(provider: string): 'zoom' | 'teams' | 'google-meet' {
	if (['zoom', 'teams', 'google-meet'].includes(provider)) {
		return provider as 'zoom' | 'teams' | 'google-meet';
	}
	// Default to zoom if the value is unexpected
	console.warn(
		`Invalid provider value: ${provider}. Using default: google-meet`,
	);
	return 'google-meet';
}

/**
 * Get meeting details by ID
 */
export async function getMeetingById(
	meetingId: string,
): Promise<Meeting | null> {
	try {
		const meeting = await db?.meeting.findUnique({
			where: { id: meetingId },
			include: {
				participants: true,
				notification: true,
			},
		});

		if (!meeting) return null;
		return convertToMeetingInterface(meeting);
	} catch (error) {
		console.error('Error fetching meeting:', error);
		return null;
	}
}

/**
 * Get meeting transcript
 */
export async function getMeetingTranscript(
	meetingId: string,
): Promise<string | null> {
	try {
		const meeting = await db?.meeting.findUnique({
			where: { id: meetingId },
			select: { transcriptKey: true },
		});

		if (!meeting?.transcriptKey) return null;

		// Fetch directly from S3 instead of using API
		const transcript =
			(await getObject(
				'recordings/transcript/' + meeting.transcriptKey,
				S3BucketType.MAIN_BUCKET,
			)) ?? '';

		// Handle JSON transcripts
		if (typeof transcript === 'string' && transcript.startsWith('{')) {
			try {
				const parsedTranscript = JSON.parse(transcript);
				if (
					parsedTranscript.results &&
					Array.isArray(parsedTranscript.results)
				) {
					return parsedTranscript.results
						.map(
							(segment: {
								speaker_label?: string;
								alternatives?: { transcript?: string }[];
							}) => {
								const speaker = segment.speaker_label || 'Speaker';
								const text = segment.alternatives?.[0]?.transcript || '';
								return `${speaker}: ${text}`;
							},
						)
						.join('\n');
				}
			} catch (e) {
				console.warn('Error parsing transcript:', e);
			}
		}

		return transcript;
	} catch (error) {
		console.error('Error fetching transcript from S3:', error);
		return null;
	}
}

/**
 * Get meeting summary
 */
export async function getMeetingSummary(
	meetingId: string,
): Promise<string | null> {
	try {
		const meeting = await db?.meeting.findUnique({
			where: { id: meetingId },
			select: { summary: true },
		});

		if (!meeting?.summary) return null;

		const summary = meeting.summary;

		// Handle JSON summaries
		if (typeof summary === 'string' && summary.startsWith('{')) {
			try {
				const parsedSummary = JSON.parse(summary as string);
				return parsedSummary.text || parsedSummary.summary || String(summary);
			} catch (e) {
				console.warn('Error parsing summary:', e);
			}
		}

		return String(summary);
	} catch (error) {
		console.error('Error fetching summary:', error);
		return null;
	}
}

/**
 * Extract action items from meeting transcript
 */
export async function extractActionItems(
	meetingId: string,
	assignee?: string,
): Promise<string[]> {
	try {
		const transcript = await getMeetingTranscript(meetingId);
		const summary = await getMeetingSummary(meetingId);

		if (!transcript && !summary) return [];

		const content = summary || transcript || '';
		const regex =
			/action\s*item|to-do|task|assign|responsible for|will|should|needs to/gi;

		if (!content.match(regex)) return [];

		const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
		const actionItems = sentences.filter((s) => s.match(regex));

		if (assignee) {
			return actionItems.filter((item) =>
				item.toLowerCase().includes(assignee.toLowerCase()),
			);
		}

		return actionItems;
	} catch (error) {
		console.error('Error extracting action items:', error);
		return [];
	}
}

/**
 * Get participant statistics
 */
export async function getParticipantStats(
	meetingId: string,
	specificParticipant?: string,
): Promise<{ name: string; speakingTurns: number }[] | string> {
	try {
		const meeting = await getMeetingById(meetingId);
		const transcript = await getMeetingTranscript(meetingId);

		if (!meeting || !transcript) return [];
		if (!meeting.participants || meeting.participants.length === 0) return [];

		const stats = meeting.participants.map((name) => {
			const regex = new RegExp(`${name}:`, 'gi');
			const matches = transcript.match(regex) || [];
			return { name, speakingTurns: matches.length };
		});

		if (specificParticipant) {
			const personStats = stats.find(
				(s) => s.name.toLowerCase() === specificParticipant.toLowerCase(),
			);

			if (!personStats) {
				return `Could not find participant named ${specificParticipant}.`;
			}

			return [personStats];
		}

		// Sort by speaking turns (most active first)
		return stats.sort((a, b) => b.speakingTurns - a.speakingTurns);
	} catch (error) {
		console.error('Error getting participant stats:', error);
		return [];
	}
}

/**
 * Search meeting transcript for specific content
 */
export async function searchTranscript(
	meetingId: string,
	query: string,
): Promise<string[]> {
	try {
		const transcript = await getMeetingTranscript(meetingId);

		if (!transcript) return [];

		// Simple search implementation
		return transcript
			.split('\n')
			.filter((line) => line.toLowerCase().includes(query.toLowerCase()))
			.slice(0, 5); // Return up to 5 matching lines
	} catch (error) {
		console.error('Error searching transcript:', error);
		return [];
	}
}

/**
 * Analyze sentiment in the meeting
 */
export async function analyzeSentiment(
	meetingId: string,
	participant?: string,
): Promise<{ sentiment: string; confidence: number; examples: string[] }> {
	try {
		const transcript = await getMeetingTranscript(meetingId);
		if (!transcript)
			return { sentiment: 'neutral', confidence: 0, examples: [] };

		// For simplicity, we're using a basic approach
		// In a real app, you might use a sentiment analysis API
		const positiveWords = [
			'great',
			'excellent',
			'amazing',
			'good',
			'positive',
			'agree',
			'happy',
		];
		const negativeWords = [
			'bad',
			'issue',
			'problem',
			'disagree',
			'difficult',
			'concerned',
			'worried',
		];

		// Filter by participant if provided
		const lines = participant
			? transcript
					.split('\n')
					.filter((line) =>
						line.toLowerCase().startsWith(participant.toLowerCase()),
					)
			: transcript.split('\n');

		if (lines.length === 0) {
			return { sentiment: 'neutral', confidence: 0, examples: [] };
		}

		let positiveCount = 0;
		let negativeCount = 0;
		const examples: string[] = [];

		lines.forEach((line) => {
			const lowerLine = line.toLowerCase();
			const hasPositive = positiveWords.some((word) =>
				lowerLine.includes(word),
			);
			const hasNegative = negativeWords.some((word) =>
				lowerLine.includes(word),
			);

			if (hasPositive) {
				positiveCount++;
				if (examples.length < 3 && !examples.includes(line)) {
					examples.push(line);
				}
			}

			if (hasNegative) {
				negativeCount++;
				if (examples.length < 3 && !examples.includes(line)) {
					examples.push(line);
				}
			}
		});

		let sentiment = 'neutral';
		let confidence = 0;

		if (positiveCount > negativeCount) {
			sentiment = 'positive';
			confidence = Math.min(
				0.9,
				(positiveCount - negativeCount) / lines.length,
			);
		} else if (negativeCount > positiveCount) {
			sentiment = 'negative';
			confidence = Math.min(
				0.9,
				(negativeCount - positiveCount) / lines.length,
			);
		}

		return { sentiment, confidence, examples };
	} catch (error) {
		console.error('Error analyzing sentiment:', error);
		return { sentiment: 'neutral', confidence: 0, examples: [] };
	}
}

/**
 * Extract key people mentioned in the meeting
 */
export async function extractPeopleMentioned(
	meetingId: string,
): Promise<{ name: string; mentions: number }[]> {
	try {
		const transcript = await getMeetingTranscript(meetingId);
		const meeting = await getMeetingById(meetingId);

		if (!transcript || !meeting) return [];

		// First get all participants to exclude them
		const participants = meeting.participants || [];

		// Look for capitalized names not in participants list
		const nameRegex = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g;
		const potentialNames = Array.from(
			transcript.matchAll(nameRegex),
			(m) => m[0],
		);

		// Count occurrences and filter out participants
		const nameCounts: Record<string, number> = {};
		potentialNames.forEach((name) => {
			if (!participants.includes(name)) {
				nameCounts[name] = (nameCounts[name] || 0) + 1;
			}
		});

		return Object.entries(nameCounts)
			.map(([name, mentions]) => ({ name, mentions }))
			.filter((item) => item.mentions > 1) // Only include names mentioned multiple times
			.sort((a, b) => b.mentions - a.mentions);
	} catch (error) {
		console.error('Error extracting people mentioned:', error);
		return [];
	}
}

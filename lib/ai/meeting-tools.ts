import { tool } from 'ai';
import { z } from 'zod';
import { MeetingStatus } from '@/types/meeting';
import {
	getMeetingById,
	getMeetingTranscript,
	getMeetingSummary,
	extractActionItems,
	getParticipantStats,
	searchTranscript,
	analyzeSentiment,
	extractPeopleMentioned,
} from '@/lib/actions/meeting-actions';

/**
 * Collection of AI tools for analyzing and extracting information from meeting data
 */
export const createMeetingTools = (meetingId: string) => ({
	/**
	 * Search the meeting transcript for specific information
	 */
	searchTranscript: tool({
		description:
			'Search the meeting transcript for specific information or keywords',
		parameters: z.object({
			query: z.string().describe('The search query to find in the transcript'),
		}),
		execute: async ({ query }) => {
			const lines = await searchTranscript(meetingId, query);

			if (lines.length === 0) return 'No matches found in the transcript.';
			return lines.join('\n');
		},
	}),

	/**
	 * Get statistics about participant contributions
	 */
	getParticipantStats: tool({
		description:
			'Get statistics about participant speaking time and contributions',
		parameters: z.object({
			participant: z
				.string()
				.optional()
				.describe('Optional specific participant to analyze'),
		}),
		execute: async ({ participant }) => {
			const stats = await getParticipantStats(meetingId, participant);

			if (Array.isArray(stats)) {
				if (stats.length === 0) return 'No participant data available.';

				if (participant) {
					const personStats = stats[0]; // We already filtered in the action
					return `${personStats.name} spoke ${personStats.speakingTurns} times in the meeting.`;
				}

				return stats
					.map((s) => `${s.name}: ${s.speakingTurns} speaking turns`)
					.join('\n');
			}

			return stats; // This is the error message
		},
	}),

	/**
	 * Extract action items from the meeting
	 */
	extractActionItems: tool({
		description: 'Extract action items and tasks assigned during the meeting',
		parameters: z.object({
			assignee: z
				.string()
				.optional()
				.describe('Optional filter for specific assignee'),
		}),
		execute: async ({ assignee }) => {
			const actionItems = await extractActionItems(meetingId, assignee);

			if (actionItems.length === 0) {
				return assignee
					? `No action items found for ${assignee}.`
					: 'No action items found in the meeting.';
			}

			return actionItems.join('\n');
		},
	}),

	/**
	 * Get or generate a summary of the meeting
	 */
	getMeetingSummary: tool({
		description: 'Get or generate a summary of the meeting content',
		parameters: z.object({}),
		execute: async () => {
			const meeting = await getMeetingById(meetingId);
			const summary = await getMeetingSummary(meetingId);

			if (summary) return summary;

			return `Meeting "${meeting?.title}" on ${meeting?.date} with participants (${meeting?.participants?.join(', ') || 'unknown'}) doesn't have a summary available. Please ask for a summary to be generated based on the transcript.`;
		},
	}),

	/**
	 * Extract key decisions from the meeting
	 */
	extractKeyDecisions: tool({
		description: 'Find key decisions made during the meeting',
		parameters: z.object({
			topic: z
				.string()
				.optional()
				.describe('Optional specific topic to focus on'),
		}),
		execute: async ({ topic }) => {
			const transcript = await getMeetingTranscript(meetingId);
			const summary = await getMeetingSummary(meetingId);

			if (!transcript && !summary)
				return 'No meeting content available for analysis.';

			const content = summary || transcript || '';
			const decisionPatterns = [
				/decided|agreed|concluded|resolved|finalized|approved|confirmed|consensus|vote/gi,
				/decision|agreement|conclusion|resolution|plan/gi,
			];

			// Look for sentences that might contain decisions
			const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
			let decisions = sentences.filter((sentence) =>
				decisionPatterns.some((pattern) => sentence.match(pattern)),
			);

			// If topic provided, filter further
			if (topic && decisions.length > 0) {
				const topicRegex = new RegExp(topic, 'gi');
				decisions = decisions.filter((decision) => decision.match(topicRegex));
			}

			if (decisions.length === 0) {
				return topic
					? `No decisions found related to "${topic}".`
					: 'No clear decisions identified in the meeting.';
			}

			return decisions.join('\n');
		},
	}),

	/**
	 * Get meeting metadata like status, provider, date
	 */
	getMeetingMetadata: tool({
		description: 'Get general information about the meeting',
		parameters: z.object({}),
		execute: async () => {
			const meeting = await getMeetingById(meetingId);

			if (!meeting) return 'Meeting not found.';

			const statusString =
				typeof meeting.status === 'number'
					? MeetingStatus[meeting.status] || 'Unknown'
					: meeting.status || 'Unknown';

			return JSON.stringify(
				{
					title: meeting.title,
					date: meeting.date,
					time: meeting.time || 'Not specified',
					duration: meeting.duration || 'Not specified',
					provider: meeting.provider || 'Not specified',
					status: statusString,
					participantCount: meeting.participants?.length || 0,
				},
				null,
				2,
			);
		},
	}),

	/**
	 * Find topics discussed in the meeting
	 */
	identifyTopics: tool({
		description: 'Identify main topics discussed in the meeting',
		parameters: z.object({}),
		execute: async () => {
			const transcript = await getMeetingTranscript(meetingId);
			const summary = await getMeetingSummary(meetingId);

			if (!transcript && !summary)
				return 'No meeting content available to identify topics.';

			const content = summary || transcript || '';
			if (content.length < 50)
				return 'The meeting content is too short to identify meaningful topics.';

			// Simple keyword extraction - in a real implementation,
			// you'd use more sophisticated NLP techniques
			const commonWords = [
				'the',
				'and',
				'to',
				'a',
				'of',
				'in',
				'that',
				'is',
				'for',
				'it',
				'with',
				'as',
				'was',
				'be',
				'on',
				'at',
				'by',
				'an',
				'we',
				'i',
			];

			const words = content
				.toLowerCase()
				.replace(/[^\w\s]/g, '')
				.split(/\s+/)
				.filter((word) => word.length > 4 && !commonWords.includes(word));

			const wordFrequency: Record<string, number> = {};
			words.forEach((word) => {
				wordFrequency[word] = (wordFrequency[word] || 0) + 1;
			});

			const sortedWords = Object.entries(wordFrequency)
				.filter(([, count]) => count > 2) // Only words that appear more than twice
				.sort((a, b) => b[1] - a[1])
				.slice(0, 10) // Top 10 words
				.map(([word, count]) => `${word} (${count} mentions)`);

			if (sortedWords.length === 0)
				return "Couldn't identify clear topics from the meeting content.";

			return (
				'Based on keyword frequency, these likely topics were discussed:\n\n' +
				sortedWords.join('\n')
			);
		},
	}),

	/**
	 * Find dates and scheduling information mentioned in the meeting
	 */
	findSchedulingInfo: tool({
		description:
			'Extract scheduling information, dates, and deadlines mentioned in the meeting',
		parameters: z.object({}),
		execute: async () => {
			const transcript = await getMeetingTranscript(meetingId);

			if (!transcript)
				return 'No transcript available to extract scheduling information.';

			// Date patterns to look for
			const datePatterns = [
				// MM/DD/YYYY or DD/MM/YYYY
				/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
				// Month Day, Year or Day Month Year
				/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{2,4}\b/gi,
				// Day of week
				/\b(?:next|this|coming|following)\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi,
				// Relative dates
				/\b(?:tomorrow|next week|next month|in \d+ (?:days?|weeks?|months?|years?))\b/gi,
			];

			let allMatches: string[] = [];

			// Find all potential date mentions
			datePatterns.forEach((pattern) => {
				const matches = transcript.match(pattern);
				if (matches) allMatches = [...allMatches, ...matches];
			});

			// Find sentences containing these dates
			const dateContexts: string[] = [];
			if (allMatches.length > 0) {
				const sentences = transcript.match(/[^.!?]+[.!?]+/g) || [];
				allMatches.forEach((dateMatch) => {
					sentences.forEach((sentence) => {
						if (
							sentence.includes(dateMatch) &&
							!dateContexts.includes(sentence)
						) {
							dateContexts.push(sentence.trim());
						}
					});
				});
			}

			if (dateContexts.length === 0) {
				return 'No specific dates or scheduling information found in the meeting transcript.';
			}

			return 'Scheduling information found:\n\n' + dateContexts.join('\n\n');
		},
	}),

	/**
	 * Analyze the overall sentiment or tone of the meeting
	 */
	analyzeMeetingSentiment: tool({
		description: 'Analyze the overall sentiment or tone of the meeting',
		parameters: z.object({
			participant: z
				.string()
				.optional()
				.describe('Optional specific participant to analyze'),
		}),
		execute: async ({ participant }) => {
			const result = await analyzeSentiment(meetingId, participant);

			const sentimentDescription = {
				positive: 'generally positive',
				negative: 'generally negative',
				neutral: 'neutral or mixed',
			}[result.sentiment];

			const confidenceLevel =
				result.confidence < 0.3
					? 'low'
					: result.confidence < 0.7
						? 'moderate'
						: 'high';

			let response = `The meeting tone was ${sentimentDescription} with ${confidenceLevel} confidence.`;

			if (result.examples.length > 0) {
				response +=
					'\n\nExamples:\n' +
					result.examples.map((ex) => `- "${ex}"`).join('\n');
			}

			return response;
		},
	}),

	/**
	 * Find non-participant people mentioned in the meeting
	 */
	findPeopleMentioned: tool({
		description: 'Find non-participant people mentioned in the meeting',
		parameters: z.object({}),
		execute: async () => {
			const people = await extractPeopleMentioned(meetingId);

			if (people.length === 0) {
				return 'No significant external people were mentioned in this meeting.';
			}

			return (
				'External people mentioned in the meeting:\n\n' +
				people.map((p) => `- ${p.name}: ${p.mentions} mentions`).join('\n')
			);
		},
	}),
});

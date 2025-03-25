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
import {
	generateMeetingImage,
	listMeetingImages,
} from '@/lib/ai/dalleImageGenerator';

// Replace the TranscriptSearchResult interface with this:
interface WordMatch {
	text: string;
	start?: number;
	end?: number;
	confidence?: number;
	speaker?: string | null;
}

interface TranscriptSearchResult {
	text?: string;
	words?: Array<WordMatch>;
	[key: string]: unknown; // Use unknown instead of any for index signature
}

/**
 * Collection of AI tools for analyzing and extracting information from meeting data
 */
export const createMeetingTools = (meetingId: string) => ({
	/**
	 * Search the meeting transcript for specific information
	 */
	searchTranscript: tool({
		description:
			'Search the meeting transcript for specific information or keywords. If time is returned, it is approximate and will be in seconds, convert to minutes for more accuracy.',
		parameters: z.object({
			query: z.string().describe('The search query to find in the transcript'),
		}),
		execute: async ({ query }) => {
			const result = await searchTranscript(meetingId, query);

			// If no matches found, return early
			if (!result || (Array.isArray(result) && result.length === 0)) {
				return 'No matches found in the transcript.';
			}

			// If the result is an array of strings (simple text matches)
			if (Array.isArray(result)) {
				if (result.length > 0 && typeof result[0] === 'string') {
					// Return only up to 10 matches to avoid overwhelming responses
					const limitedResults = result.slice(0, 10);
					const remainingCount = result.length > 10 ? result.length - 10 : 0;

					let response = limitedResults.join('\n\n');
					if (remainingCount > 0) {
						response += `\n\n...and ${remainingCount} more matches.`;
					}

					return response;
				}
				return 'Found matches in the transcript.';
			}

			// If it's an object with transcript data
			if (result && typeof result === 'object') {
				// Use a type assertion to help TypeScript
				const typedResult = result as TranscriptSearchResult;

				// Extract just a relevant portion of the text
				const textContent =
					typeof typedResult.text === 'string' ? typedResult.text : '';
				if (textContent) {
					const excerptLength = 500;
					const textExcerpt =
						textContent.length > excerptLength
							? textContent.substring(0, excerptLength) + '...'
							: textContent;

					// Count word matches if available
					const matchCount = Array.isArray(typedResult.words)
						? typedResult.words.length
						: 0;

					return `Found ${matchCount} matches for "${query}" in the transcript.\n\nExcerpt:\n${textExcerpt}`;
				}
			}

			// Fallback for other result formats
			return `Found matches for "${query}" in the transcript. Use getMeetingTranscript tool for the full content.`;
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
				/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{2,4}\b/gi,
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

	/**
	 * Generate an image related to the meeting content
	 */
	generateImage: tool({
		description: 'Generate an image related to meeting content with DALL-E',
		parameters: z.object({
			description: z
				.string()
				.describe(
					'Brief description or theme for the image. Will be enhanced with meeting context automatically.',
				),
			style: z
				.enum(['professional', 'creative', 'abstract'])
				.optional()
				.describe(
					'Style of the image: professional (default), creative, or abstract',
				),
		}),
		execute: async ({ description, style = 'professional' }) => {
			try {
				// Get meeting metadata to enhance the image context
				const meeting = await getMeetingById(meetingId);
				let summary = '';

				try {
					summary = (await getMeetingSummary(meetingId)) || '';
				} catch (summaryError) {
					console.error('Error fetching meeting summary:', summaryError);
					// Continue without summary if it fails
				}

				if (!meeting) {
					return {
						success: false,
						message: "Couldn't find meeting data to generate a relevant image",
						imageUrl: null,
						markdown: '⚠️ Unable to generate image: Meeting data not found.',
					};
				}

				// Extract key meeting information
				const meetingTitle = meeting.title || 'Business Meeting';

				// Create a context-aware prompt that includes meeting details
				const contextualDescription = description || 'meeting visualization';

				// Build an enhanced prompt with meeting context
				let enhancedDescription = `Create a visual representation for a meeting titled "${meetingTitle}"`;

				// Add summary context if available
				if (summary && summary.length > 0) {
					// Extract key points from summary (first 100 chars max)
					const summaryExcerpt =
						summary.substring(0, 100) + (summary.length > 100 ? '...' : '');
					enhancedDescription += ` about: ${summaryExcerpt}`;
				}

				// Add the user's description
				enhancedDescription += `. Specifically focusing on: ${contextualDescription}.`;

				// Apply style variations
				switch (style) {
					case 'creative':
						enhancedDescription +=
							' Use vibrant colors, dynamic elements, and a creative, modern style. Include visual metaphors related to collaboration and innovation.';
						break;
					case 'abstract':
						enhancedDescription +=
							' Create an abstract representation with geometric shapes, minimal colors, and subtle business symbolism. Use a clean, minimalist approach.';
						break;
					default: // professional
						enhancedDescription +=
							' Use a professional corporate style with clean design. Include subtle business elements like charts, handshakes, or conference room imagery where appropriate.';
				}

				console.log(
					`Generating meeting image with context: ${enhancedDescription.substring(0, 100)}...`,
				);

				// Generate the image with meeting context
				const imageUrl = await generateMeetingImage(
					meetingId,
					enhancedDescription,
				);

				return {
					success: true,
					message: `Image successfully generated for "${meetingTitle}" meeting`,
					description: enhancedDescription.substring(0, 100) + '...',
					imageUrl: imageUrl,
					markdown: `![Generated image for ${meetingTitle}](${imageUrl})`,
				};
			} catch (error) {
				console.error('Error in generateImage tool:', error);
				// CRITICAL: Always return a result object even on failure
				return {
					success: false,
					message: `Failed to generate meeting image: ${(error as Error).message}`,
					imageUrl: null,
					markdown:
						'⚠️ Unable to generate the requested image at this time. Please try again later.',
				};
			}
		},
	}),

	/**
	 * List previously generated images for this meeting
	 */
	listGeneratedImages: tool({
		description: 'List all previously generated images for this meeting',
		parameters: z.object({
			limit: z
				.number()
				.optional()
				.describe('Maximum number of images to return (default: 10)'),
			sortBy: z
				.enum(['newest', 'oldest'])
				.optional()
				.describe('Sort order for images (default: newest)'),
		}),
		execute: async ({ limit = 10, sortBy = 'newest' }) => {
			try {
				const result = await listMeetingImages(meetingId);

				if (!result.images || result.images.length === 0) {
					return {
						message: 'No images have been generated for this meeting yet.',
						images: [],
					};
				}

				// Sort images by generation date
				const sortedImages = [...result.images].sort((a, b) => {
					const dateA = new Date(a.generatedAt).getTime();
					const dateB = new Date(b.generatedAt).getTime();
					return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
				});

				// Limit the number of images returned
				const limitedImages = sortedImages.slice(0, limit);

				// Format the response
				const imageList = limitedImages.map((img, index) => {
					const date = new Date(img.generatedAt).toLocaleString();
					return `${index + 1}. Image generated on ${date}\n![Image ${
						index + 1
					}](${img.url})`;
				});

				return {
					message: `Found ${result.images.length} images for this meeting. Showing ${limitedImages.length}:`,
					images: limitedImages,
					markdown: imageList.join('\n\n'),
				};
			} catch (error) {
				console.error('Error listing generated images:', error);
				return {
					success: false,
					message: `Failed to list generated images: ${
						(error as Error).message
					}`,
					images: [],
				};
			}
		},
	}),
});

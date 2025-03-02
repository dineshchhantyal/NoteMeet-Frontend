import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Define the model
const meetingAssistantModel = google('gemini-1.5-pro');

// Tools for analyzing meeting data
const meetingTools = {
	searchTranscript: tool({
		description: 'Search the meeting transcript for specific information',
		parameters: z.object({
			query: z.string().describe('The search query to find in the transcript'),
		}),
		execute: async ({ query }, { transcript }) => {
			if (!transcript) return 'No transcript available for this meeting.';

			// Simple search implementation - in a real app, you might use better search algorithms
			const lines = transcript
				.split('\n')
				.filter((line) => line.toLowerCase().includes(query.toLowerCase()));

			if (lines.length === 0) return 'No matches found in the transcript.';
			return lines.slice(0, 5).join('\n'); // Return up to 5 matching lines
		},
	}),

	getParticipantStats: tool({
		description: 'Get statistics about participant contributions',
		parameters: z.object({
			participant: z
				.string()
				.optional()
				.describe('Optional specific participant to analyze'),
		}),
		execute: async ({ participant }, { transcript, participants }) => {
			if (!transcript) return 'No transcript available for analysis.';
			if (!participants || participants.length === 0)
				return 'No participant data available.';

			const stats = participants.map((name) => {
				const regex = new RegExp(`${name}:`, 'gi');
				const matches = transcript.match(regex) || [];
				return { name, speakingTurns: matches.length };
			});

			if (participant) {
				const personStats = stats.find(
					(s) => s.name.toLowerCase() === participant.toLowerCase(),
				);
				return personStats
					? `${personStats.name} spoke ${personStats.speakingTurns} times in the meeting.`
					: `Could not find participant named ${participant}.`;
			}

			// Sort by speaking turns (most active first)
			stats.sort((a, b) => b.speakingTurns - a.speakingTurns);

			return stats
				.map((s) => `${s.name}: ${s.speakingTurns} speaking turns`)
				.join('\n');
		},
	}),

	extractActionItems: tool({
		description: 'Extract action items from the meeting',
		parameters: z.object({
			assignee: z
				.string()
				.optional()
				.describe('Optional filter for specific assignee'),
		}),
		execute: async ({ assignee }, { transcript, summary }) => {
			if (!transcript && !summary)
				return 'No meeting content available for analysis.';

			const content = summary || transcript;
			const regex =
				/action\s*item|to-do|task|assign|responsible for|will|should|needs to/gi;

			if (!content.match(regex)) return 'No action items found in the meeting.';

			// Extract sentences containing likely action items
			const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
			const actionItems = sentences.filter((s) => s.match(regex));

			if (assignee) {
				const assigneeItems = actionItems.filter((item) =>
					item.toLowerCase().includes(assignee.toLowerCase()),
				);
				return assigneeItems.length > 0
					? assigneeItems.join('\n')
					: `No action items found for ${assignee}.`;
			}

			return actionItems.join('\n');
		},
	}),

	getMeetingSummary: tool({
		description: 'Get or generate a summary of the meeting',
		parameters: z.object({}),
		execute: async ({}, { summary, title, date, participants }) => {
			if (summary) return summary;

			return `Meeting "${title}" on ${date} with participants (${participants?.join(', ') || 'unknown'}) doesn't have a summary available. Please ask for a summary to be generated based on the transcript.`;
		},
	}),
};

// Generate AI response with streaming
export async function generateAIResponse(
	meetingId: string,
	userMessage: string,
	history: any[],
	meetingData: any,
) {
	try {
		const systemMessage = `You are NoteMeet's AI Meeting Assistant, a helpful AI that answers questions about meetings.
You're currently discussing a meeting called "${meetingData.title}" from ${meetingData.date}.
The meeting had these participants: ${meetingData.participants.join(', ')}.

You have access to the meeting transcript and summary. Use the provided tools to search for specific information.
When answering questions:
- Be concise but thorough
- Use a professional tone
- Reference specific parts of the meeting when relevant
- Admit when you don't know something
- Don't make up information that isn't in the transcript or summary`;

		const formattedHistory = history.map((msg) => ({
			role: msg.role,
			content: msg.content,
		}));

		// Create a stream response
		const stream = await streamText({
			model: meetingAssistantModel,
			system: systemMessage,
			messages: [...formattedHistory, { role: 'user', content: userMessage }],
			tools: meetingTools,
			maxSteps: 5, // Allow up to 5 tool calls if needed
			context: {
				transcript: meetingData.transcript || '',
				summary: meetingData.summary || '',
				title: meetingData.title,
				date: meetingData.date,
				participants: meetingData.participants,
			},
		});

		return new Response(stream);
	} catch (error) {
		console.error('Error generating AI response:', error);
		throw error;
	}
}

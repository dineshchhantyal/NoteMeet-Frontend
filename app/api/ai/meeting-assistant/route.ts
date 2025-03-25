import { NextRequest, NextResponse } from 'next/server';
import { createMeetingTools } from '@/lib/ai/meeting-tools';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import {
	getMeetingById,
	getMeetingTranscription,
} from '@/lib/actions/meeting-actions';
import { currentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
	try {
		const { messages, meetingId } = await req.json();
		const user = await currentUser();

		if (!user) {
			return NextResponse.json(
				{ error: 'User is not authenticated' },
				{ status: 401 },
			);
		}

		if (!meetingId) {
			return NextResponse.json(
				{ error: 'Meeting ID is required' },
				{ status: 400 },
			);
		}

		// Fetch real meeting data from the database
		const meetingData = await fetchMeetingData(meetingId);

		try {
			const systemMessage = `You are NoteMeet's AI Meeting Assistant, a helpful AI that answers questions about meetings.
You're currently discussing a meeting called "${meetingData.title}" from ${meetingData.date}.
The meeting had these participants: ${meetingData.participants?.join(', ')}.

This is the complete information about the meeting:
- ${JSON.stringify(meetingData, null, 2)}

The users in this chat is ${user?.name}. Be sure to provide the best assistance possible.

You have access to the meeting transcript and summary. Use the provided tools to search for specific information.
When answering questions:
- Be concise but thorough
- Use a professional tone
- Reference specific parts of the meeting when relevant
- Admit when you don't know something
- Don't make up information that isn't in the transcript or summary
- Format your responses using Markdown for better readability
- Use bullet points or numbered lists when appropriate`;

			const meetingAssistantModel = google('gemini-2.0-flash-001', {});

			const augmentedMessages = [
				{ role: 'system', content: systemMessage },
				...messages,
			];

			// Get all meeting tools
			const meetingTools = createMeetingTools(meetingId);

			// Create a stream response
			const stream = await streamText({
				model: meetingAssistantModel,
				system: systemMessage,
				messages: augmentedMessages,
				tools: meetingTools,
				maxSteps: 3,
			});

			return stream.toDataStreamResponse();
		} catch (error) {
			console.error('Error generating AI response:', error);
			throw error;
		}
	} catch (error) {
		console.error('Error in AI meeting assistant:', error);
		return NextResponse.json(
			{ error: 'Failed to process the request' },
			{ status: 500 },
		);
	}
}

// Enhanced function to fetch meeting data - in a real app, this would query your database
async function fetchMeetingData(meetingId: string) {
	try {
		// First attempt to get data from your real API

		const meeting = await getMeetingById(meetingId);

		if (meeting) {
			const transcript = await getMeetingTranscription(meetingId);
			return {
				title: meeting.title,
				transcript: transcript,
				summary: meeting.summary,
				date: meeting.date,
				participants: meeting.participants,
			};
		}
	} catch (error) {
		console.error('Error fetching real meeting data:', error);
	}

	return {
		title: 'Quarterly Planning Session',
		transcript: 'This is a sample transcript of the meeting...',
		summary:
			'The team discussed Q3 goals and assigned responsibilities for the upcoming product launch.',
		date: '2025-02-15',
		participants: ['Alex', 'Jamie', 'Taylor', 'Jordan'],
	};
}

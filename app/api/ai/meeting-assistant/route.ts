import { NextRequest, NextResponse } from 'next/server';
import { createMeetingTools } from '@/lib/ai/meeting-tools';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import {
	getMeetingById,
	getMeetingTranscript,
} from '@/lib/actions/meeting-actions';

export async function POST(req: NextRequest) {
	try {
		const { messages, meetingId } = await req.json();

		if (!meetingId) {
			return NextResponse.json(
				{ error: 'Meeting ID is required' },
				{ status: 400 },
			);
		}

		// Fetch real meeting data from the database
		const meetingData = await fetchMeetingData(meetingId);

		console.log('Fetched meeting data:', meetingData);

		try {
			const systemMessage = `You are NoteMeet's AI Meeting Assistant, a helpful AI that answers questions about meetings.
You're currently discussing a meeting called "${meetingData.title}" from ${meetingData.date}.
The meeting had these participants: ${meetingData.participants.join(', ')}.

This is the complete information about the meeting:
- ${JSON.stringify(meetingData, null, 2)}

You have access to the meeting transcript and summary. Use the provided tools to search for specific information.
When answering questions:
- Be concise but thorough
- Use a professional tone
- Reference specific parts of the meeting when relevant
- Admit when you don't know something
- Don't make up information that isn't in the transcript or summary
- Format your responses using Markdown for better readability
- Use bullet points or numbered lists when appropriate`;
			const meetingAssistantModel = google('gemini-1.5-pro', {});

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
				maxSteps: 5,
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
			const transcript = await getMeetingTranscript(meetingId);
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

	// Fallback to mock data if real data fetch fails
	console.warn('Using mock meeting data as fallback');
	return {
		title: 'Quarterly Planning Session',
		transcript: 'This is a sample transcript of the meeting...',
		summary:
			'The team discussed Q3 goals and assigned responsibilities for the upcoming product launch.',
		date: '2025-02-15',
		participants: ['Alex', 'Jamie', 'Taylor', 'Jordan'],
	};
}

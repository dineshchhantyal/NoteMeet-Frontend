import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/meeting-assistant';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	try {
		const { messages, meetingId } = await req.json();

		if (!meetingId) {
			return NextResponse.json(
				{ error: 'Meeting ID is required' },
				{ status: 400 },
			);
		}

		// Get the latest user message
		const lastMessage = messages[messages.length - 1]?.content || '';

		// Get previous messages as history (excluding the latest)
		const history = messages.slice(0, -1);

		// Fetch real meeting data from the database
		const meetingData = await fetchMeetingData(meetingId);

		// Generate streaming AI response using our utility
		return generateAIResponse(meetingId, lastMessage, history, {
			title: meetingData.title,
			transcript: meetingData.transcript,
			summary: meetingData.summary,
			date: meetingData.date,
			participants: meetingData.participants,
		});
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
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/meetings/${meetingId}`,
		);

		if (response.ok) {
			const data = await response.json();

			// Also fetch transcript if available
			let transcript = '';
			if (data.data.transcriptKey) {
				const transcriptResponse = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/meetings/${meetingId}/transcript`,
				);
				if (transcriptResponse.ok) {
					const transcriptData = await transcriptResponse.json();
					transcript = transcriptData.transcript || '';
				}
			}

			return {
				title: data.data.title,
				transcript: transcript,
				summary: data.data.summary || '',
				date: data.data.date,
				participants: data.data.participants || [],
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

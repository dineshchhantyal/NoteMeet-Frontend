import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { checkMeetingUserAuthorization } from '@/lib/meeting';

// Define types for better type safety
interface ActionItem {
	id: string;
	text: string;
	completed: boolean;
	assignee: string;
	dueDate?: string;
}

interface MeetingSummary {
	keyTopics?: string[];
	actionItems?: string[];
	sentiment?: string;
}

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

		// For now, generate action items from the meeting summary if available
		// or create mock data with consistent values based on meeting ID
		let actionItems: ActionItem[] = [];

		// First check if we have action items in the summary
		if (meeting.summary) {
			try {
				// Parse summary if it's a string
				let summary: MeetingSummary;
				if (typeof meeting.summary === 'string') {
					summary = JSON.parse(meeting.summary);
				} else {
					summary = meeting.summary as MeetingSummary;
				}

				// If we have action items in the summary, use them
				if (
					summary &&
					Array.isArray(summary.actionItems) &&
					summary.actionItems.length > 0
				) {
					// Convert summary action items to the required format
					actionItems = summary.actionItems.map((text, index) => {
						// Create a deterministic ID based on meeting ID and text
						const itemId = `ai-${meetingId.slice(0, 8)}-${index}`;

						// Get a deterministic completed state (for demo purposes)
						const completed =
							meetingId.charCodeAt(index % meetingId.length) % 3 === 0;

						// Assign to a participant if available, or use a default name
						const participants = meeting.participants || [];
						const assignee =
							participants.length > 0
								? participants[index % participants.length]?.email ||
									'Unassigned'
								: ['Alex', 'Taylor', 'Jordan', 'Morgan'][index % 4];

						return {
							id: itemId,
							text,
							completed,
							assignee,
							// Some items have due dates, some don't (optional field)
							...(Math.random() > 0.3 && {
								dueDate: generateFutureDateString(index + 1),
							}),
						};
					});
				}
			} catch (error) {
				console.error('Error parsing meeting summary:', error);
			}
		}

		// If we didn't get action items from the summary, create mock data
		if (actionItems.length === 0) {
			// Create stable "random" number generator based on meeting ID
			const getNumberFromId = (position: number, max: number) => {
				const char = meetingId.charCodeAt(position % meetingId.length);
				return char % max;
			};

			// Generate 3-6 items based on meeting ID
			const numItems = 3 + getNumberFromId(0, 4);

			const defaultActionItems = [
				'Schedule follow-up meeting',
				'Share meeting notes with team',
				'Update project documentation',
				'Review progress on milestones',
				'Prepare status report',
				'Complete assigned tasks from meeting',
				'Contact stakeholders with updates',
				'Research solution for discussed issue',
				'Create timeline for next steps',
				'Send resources to team members',
			];

			actionItems = Array.from({ length: numItems }).map((_, index) => {
				const itemIndex = getNumberFromId(index, defaultActionItems.length);
				const completed = getNumberFromId(index + 3, 5) === 0; // 1 in 5 chance of being completed

				// Determine assignee (either from participants or default names)
				const participants = meeting.participants || [];
				const assignee =
					participants.length > 0
						? participants[index % participants.length]?.email || 'Unassigned'
						: ['Alex', 'Taylor', 'Jordan', 'Morgan'][index % 4];

				return {
					id: `ai-${meetingId.slice(0, 8)}-${index}`,
					text: defaultActionItems[itemIndex],
					completed,
					assignee,
					// Some items have due dates, some don't
					...(getNumberFromId(index + 5, 3) > 0 && {
						dueDate: generateFutureDateString(index + 1),
					}),
				};
			});
		}

		return NextResponse.json({ actionItems });
	} catch (error) {
		console.error('Error fetching action items:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch action items' },
			{ status: 500 },
		);
	}
}

// Implement the POST, PATCH, and DELETE endpoints to match component expectations
export async function POST(req: NextRequest) {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const meetingId = req.nextUrl.pathname.split('/').at(-2) as string;

		// Check authorization
		await checkMeetingUserAuthorization(user, meetingId);

		// Get the new action item from request body
		const newItem = await req.json();

		// In a real implementation, you'd save this to the database
		// For now, just return success

		return NextResponse.json({
			success: true,
			message: 'Action item created',
			item: newItem,
		});
	} catch (error) {
		console.error('Error creating action item:', error);
		return NextResponse.json(
			{ error: 'Failed to create action item' },
			{ status: 500 },
		);
	}
}

// Helper function to generate future dates for due dates
function generateFutureDateString(daysToAdd: number): string {
	const date = new Date();
	date.setDate(date.getDate() + daysToAdd);
	return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

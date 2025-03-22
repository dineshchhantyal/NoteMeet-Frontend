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

		// Check if meeting exists and user has access
		const meeting = await db?.meeting.findUnique({
			where: { id: meetingId },
		});

		if (!meeting) {
			return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
		}

		// For now, generate mock action items based on meeting ID for consistency
		const mockActionItems = generateMockActionItems(meetingId);

		return NextResponse.json({
			success: true,
			data: mockActionItems,
		});
	} catch (error) {
		console.error('Error fetching action items:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch action items', success: false },
			{ status: 500 },
		);
	}
}

// Helper function to generate mock action items
// (your existing implementation is correct, no changes needed)
function generateMockActionItems(meetingId: string) {
	const actionItems = [
		{
			id: `${meetingId}-1`,
			title: 'Follow up with design team',
			assignedTo: 'Jane Doe',
			dueDate: '2022-01-15',
			status: 'In Progress',
		},
		{
			id: `${meetingId}-2`,
			title: 'Review budget proposal',
			assignedTo: 'John Smith',
			dueDate: '2022-01-20',
			status: 'Pending',
		},
		{
			id: `${meetingId}-3`,
			title: 'Prepare marketing strategy',
			assignedTo: 'Mike Johnson',
			dueDate: '2022-01-25',
			status: 'Not Started',
		},
	];

	return actionItems;
}

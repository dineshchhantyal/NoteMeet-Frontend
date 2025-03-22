'use client';

import {
	Search,
	Users,
	X,
	Calendar,
	Clock,
	CalendarCheck2,
	Share2,
	Users2,
	Plus,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { MeetingInterface } from '@/types';
import { MeetingStatus } from '@/types/meeting';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, isValid } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm } from '@/lib/redux/features/meetings/meetingsSlice';
import { RootState } from '@/lib/redux/store';
import { SharedMeetingCard } from '../meetings/shared-meeting-card';

// Add this interface near the top of your file
interface SharedMeetingInterface extends MeetingInterface {
	isShared?: boolean;
	sharedBy?: string;
	sharePermission?: string;
	shareId?: string;
}

// Brand theme colors for consistent reference
const BRAND = {
	primary: '#63d392',
	primaryDark: '#4eb97b',
	primaryLight: 'rgba(99, 211, 146, 0.2)',
	dark: '#0a4a4e',
	darkMid: '#0d5559',
	midTone: '#156469',
};

// Add these utility functions at the beginning of your component or outside
const formatDate = (dateString: string) => {
	try {
		// Try to parse as ISO date first
		const date = parseISO(dateString);
		if (isValid(date)) {
			return format(date, 'MMM d, yyyy'); // Format as "Jan 1, 2023"
		}
		// If it's already a formatted date string, return as is
		return dateString;
	} catch (error) {
		console.error('Error formatting date:', error);
		return dateString;
	}
};

const formatTime = (timeString: string) => {
	try {
		// Check if timeString includes time with seconds (ISO format like 2023-10-15T14:30:00)
		if (timeString.includes('T')) {
			const date = parseISO(timeString);
			if (isValid(date)) {
				return format(date, 'h:mm a'); // Format as "2:30 PM"
			}
		}

		// Handle time strings like "14:30"
		if (timeString.includes(':')) {
			const [hours, minutes] = timeString.split(':').map(Number);
			const date = new Date();
			date.setHours(hours, minutes);
			return format(date, 'h:mm a'); // Format as "2:30 PM"
		}

		// Return as is if we can't format it
		return timeString;
	} catch (error) {
		console.error('Error formatting time:', error);
		return timeString;
	}
};

interface AppSidebarProps {
	onSelectMeeting: (meeting: MeetingInterface) => void;
	meetings: MeetingInterface[];
	isOpen: boolean;
	onClose: () => void;
	selectedMeeting?: MeetingInterface | null;
	loading?: boolean; // Add loading prop
}

export function AppSidebar({
	onSelectMeeting,
	meetings = [],
	isOpen,
	onClose,
	selectedMeeting,
	loading = false, // Default to false
}: AppSidebarProps) {
	const dispatch = useDispatch();
	const searchTerm = useSelector(
		(state: RootState) => state.meetings.searchTerm,
	);

	// Get shared meetings from Redux store
	const sharedMeetings = useSelector(
		(state: RootState) => state.meetings.sharedMeetings || [],
	) as SharedMeetingInterface[];

	// Filter both lists separately
	const filteredOwnedMeetings = meetings.filter(
		(meeting) =>
			meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			meeting.date.includes(searchTerm) ||
			(meeting.status &&
				MeetingStatus[meeting.status]
					?.toLowerCase()
					.includes(searchTerm.toLowerCase())),
	);

	const filteredSharedMeetings = sharedMeetings.filter(
		(meeting) =>
			meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			meeting.date.includes(searchTerm) ||
			(meeting.status &&
				MeetingStatus[meeting.status]
					?.toLowerCase()
					.includes(searchTerm.toLowerCase())),
	);

	const nextMeeting = meetings.find(
		(meeting) => meeting.status === MeetingStatus.Scheduled,
	);

	return (
		<div
			className={`fixed inset-y-0 left-0 z-50 w-72 bg-[${BRAND.darkMid}]/95 backdrop-blur-md border-r border-[${BRAND.primaryLight}] transform ${
				isOpen ? 'translate-x-0' : '-translate-x-full'
			} transition-transform duration-200 ease-in-out md:relative md:translate-x-0 shadow-lg`}
		>
			<div className="flex flex-col h-full text-white">
				{/* Header Section */}
				<div className="flex items-center justify-between p-4 border-b border-[#63d392]/20">
					<div className="flex items-center gap-2">
						<div className="bg-[#63d392]/20 p-2 rounded-md">
							<CalendarCheck2 className="h-5 w-5 text-[#63d392]" />
						</div>
						<h2 className="text-lg font-semibold">Meetings</h2>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="md:hidden text-white hover:bg-[#156469]/50"
						aria-label="Close sidebar"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Search Bar */}
				<div className="p-4 border-b border-[#63d392]/20">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search meetings..."
							className="pl-10 bg-[#0d5559]/50 border-[#63d392]/30 text-white"
							value={searchTerm}
							onChange={(e) => dispatch(setSearchTerm(e.target.value))}
						/>
					</div>
				</div>

				{/* Meetings Lists */}
				<div className="flex-1 overflow-auto">
					{/* Your Meetings Section */}
					<div className="p-4 border-b border-[#63d392]/20">
						<h3 className="text-xs uppercase text-gray-400 font-medium mb-3">
							Your Meetings
						</h3>
						{loading ? (
							<div className="space-y-3">
								<Skeleton className="h-16 w-full bg-[#156469]/30" />
								<Skeleton className="h-16 w-full bg-[#156469]/30" />
							</div>
						) : filteredOwnedMeetings.length === 0 ? (
							<div className="text-center py-6 text-gray-500">
								<Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
								<p className="text-sm">No meetings found</p>
							</div>
						) : (
							<div className="space-y-2">
								{filteredOwnedMeetings.map((meeting) => (
									<SharedMeetingCard
										key={meeting.id}
										meeting={meeting}
										isSelected={selectedMeeting?.id === meeting.id}
										onSelect={() => onSelectMeeting(meeting)}
									/>
								))}
							</div>
						)}
					</div>

					{/* Shared With You Section */}
					<div className="p-4">
						<h3 className="text-xs uppercase text-gray-400 font-medium mb-3 flex items-center">
							<Users2 className="h-3 w-3 mr-1" /> Shared With You
						</h3>

						{loading ? (
							<div className="space-y-3">
								<Skeleton className="h-16 w-full bg-[#156469]/30" />
							</div>
						) : filteredSharedMeetings.length === 0 ? (
							<div className="text-center py-6 text-gray-500">
								<Share2 className="h-10 w-10 mx-auto mb-2 opacity-20" />
								<p className="text-sm">No shared meetings</p>
							</div>
						) : (
							<div className="space-y-2">
								{filteredSharedMeetings.map((meeting) => (
									<SharedMeetingCard
										key={meeting.id}
										meeting={meeting}
										isSelected={selectedMeeting?.id === meeting.id}
										onSelect={() => onSelectMeeting(meeting)}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function getStatusBadgeStyle(status: MeetingStatus) {
	switch (status) {
		case MeetingStatus.Completed:
			return 'bg-[#63d392]/80 text-white border-[#63d392]'; // Completed - primary green
		case MeetingStatus.InProgress:
			return 'bg-[#156469]/80 text-white border-[#156469]'; // In Progress - brand teal
		case MeetingStatus.Scheduled:
			return 'bg-[#fbbf24]/80 text-[#0a4a4e] border-[#fbbf24]'; // Scheduled - yellow
		case MeetingStatus.Transcoding:
			return 'bg-[#818cf8]/80 text-white border-[#818cf8]'; // Transcoding - indigo
		case MeetingStatus.Transcring:
			return 'bg-[#06b6d4]/80 text-white border-[#06b6d4]'; // Transcribing - cyan
		case MeetingStatus.Cancelled:
			return 'bg-[#ef4444]/80 text-white border-[#ef4444]'; // Cancelled - red
		default:
			return 'bg-gray-400/80 text-[#0a4a4e] border-gray-400'; // Default case
	}
}

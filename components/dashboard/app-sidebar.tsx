'use client';

import {
	Search,
	Users,
	X,
	Calendar,
	Clock,
	CalendarCheck2,
	Share2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
				<div className="p-4">
					<div className="relative">
						<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#63d392]" />
						<Input
							type="search"
							placeholder="Search meetings..."
							className="pl-8 bg-[#156469]/40 border-[#63d392]/20 text-white placeholder:text-gray-300 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
							value={searchTerm}
							onChange={(e) => dispatch(setSearchTerm(e.target.value))}
						/>
					</div>
				</div>

				<div className="flex-1 overflow-auto py-2 px-3">
					<h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-[#63d392]">
						Your Meetings
					</h3>

					{loading ? (
						// Loading skeletons
						<div className="space-y-2 px-1 py-2">
							{[...Array(5)].map((_, i) => (
								<div
									key={`skeleton-${i}`}
									className="flex items-center gap-3 rounded-md p-3 bg-[#156469]/30 animate-pulse"
								>
									<div className="rounded-full bg-[#156469]/70 h-8 w-8"></div>
									<div className="space-y-2 flex-1">
										<Skeleton className="h-4 w-3/4 bg-[#156469]/70" />
										<Skeleton className="h-3 w-1/2 bg-[#156469]/50" />
									</div>
								</div>
							))}
						</div>
					) : filteredOwnedMeetings.length === 0 &&
					  filteredSharedMeetings.length === 0 ? (
						<div className="flex flex-col items-center justify-center p-8 text-center">
							<div className="bg-[#156469]/40 p-4 rounded-full mb-4">
								<Calendar className="h-6 w-6 text-[#63d392]/80" />
							</div>
							<p className="text-gray-300 mb-1">No meetings found</p>
							<p className="text-xs text-gray-400">
								{searchTerm
									? 'Try a different search term'
									: 'Create your first meeting'}
							</p>
						</div>
					) : (
						<div className="space-y-6">
							{/* Display owned meetings */}
							{filteredOwnedMeetings.length > 0 && (
								<div className="space-y-2">
									<h4 className="text-xs uppercase text-gray-400 font-medium px-4 flex items-center">
										<Users className="h-3 w-3 mr-1" /> Your Meetings
									</h4>
									{filteredOwnedMeetings.map((meeting) => (
										<Button
											key={meeting.id || Math.random()}
											variant="ghost"
											className={cn(
												'w-full justify-start text-left p-3 h-auto mb-1 rounded-lg transition-all',
												selectedMeeting?.id === meeting.id
													? 'bg-[#63d392]/20 text-white hover:bg-[#63d392]/30 border-l-2 border-[#63d392]'
													: 'hover:bg-[#156469]/50 text-white hover:text-green-200',
											)}
											onClick={() => {
												onSelectMeeting(meeting);
												onClose();
											}}
										>
											<div className="flex flex-col items-start w-full space-y-2">
												<span className="font-medium text-sm truncate w-full">
													{meeting.title}
												</span>
												<div className="flex flex-wrap items-center gap-2 w-full">
													<span className="text-xs text-gray-300 flex items-center gap-1">
														<Calendar className="h-3 w-3" />
														{formatDate(meeting.date)}
													</span>
													<span className="text-xs text-gray-300 flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{formatTime(meeting.time)}
													</span>
												</div>
												<div className="flex flex-wrap items-center gap-2 w-full">
													<Badge
														variant="outline"
														className={`text-xs ${getStatusBadgeStyle(meeting.status as MeetingStatus)}`}
													>
														{MeetingStatus[meeting.status as MeetingStatus]}
													</Badge>
													{meeting.participants && (
														<TooltipProvider>
															<Tooltip delayDuration={300}>
																<TooltipTrigger asChild>
																	<Badge
																		variant="secondary"
																		className="text-xs flex items-center gap-1 bg-[#156469]/70 hover:bg-[#156469] text-white border-none"
																	>
																		<Users className="h-3 w-3" />
																		{meeting.participants.length}
																	</Badge>
																</TooltipTrigger>
																<TooltipContent className="bg-[#0d5559] text-white border-[#63d392]/20">
																	<p>
																		{meeting.participants.length} Participants
																	</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													)}
												</div>
											</div>
										</Button>
									))}
								</div>
							)}

							{/* Display shared meetings */}
							{filteredSharedMeetings.length > 0 && (
								<div className="space-y-2 mt-4">
									<h4 className="text-xs uppercase text-gray-400 font-medium px-4 flex items-center">
										<Share2 className="h-3 w-3 mr-1" /> Shared With You
									</h4>
									{filteredSharedMeetings.map((meeting) => (
										<Button
											key={meeting.shareId || meeting.id}
											variant="ghost"
											className={cn(
												'w-full justify-start text-left p-3 h-auto mb-1 rounded-lg',
												selectedMeeting?.id === meeting.id
													? 'bg-[#63d392]/20 text-white hover:bg-[#63d392]/30 border-l-2 border-[#63d392]'
													: 'hover:bg-[#156469]/50 text-white',
											)}
											onClick={() => {
												onSelectMeeting(meeting);
												onClose();
											}}
										>
											<div className="flex flex-col w-full">
												<div className="flex items-center w-full">
													<span className="font-medium text-sm truncate flex-1">
														{meeting.title}
													</span>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<Share2 className="h-3 w-3 text-blue-300 ml-2" />
															</TooltipTrigger>
															<TooltipContent className="bg-[#0d5559] text-white border-[#63d392]/20">
																<p>
																	Shared by:{' '}
																	{(meeting as SharedMeetingInterface)
																		.sharedBy || 'Unknown'}
																</p>
																<p>
																	Permission:{' '}
																	{(meeting as SharedMeetingInterface)
																		.sharePermission || 'View'}
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>

												{/* Rest of your meeting display code */}

												{/* Add permission badge */}
												<div className="flex mt-2 items-center gap-2">
													{/* Your existing status badge */}
													<Badge
														variant="outline"
														className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs"
													>
														{(meeting as SharedMeetingInterface)
															.sharePermission || 'Shared'}
													</Badge>
												</div>
											</div>
										</Button>
									))}
								</div>
							)}
						</div>
					)}
				</div>

				<div className="p-4 border-t border-[#63d392]/20">
					<p className="text-xs text-center text-gray-400">
						{meetings.length} total meeting{meetings.length !== 1 ? 's' : ''}
					</p>
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

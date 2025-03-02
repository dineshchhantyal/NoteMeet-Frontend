'use client';

import { useState } from 'react';
import {
	Search,
	Users,
	X,
	Calendar,
	Clock,
	CalendarCheck2,
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

// Brand theme colors for consistent reference
const BRAND = {
	primary: '#63d392',
	primaryDark: '#4eb97b',
	primaryLight: 'rgba(99, 211, 146, 0.2)',
	dark: '#0a4a4e',
	darkMid: '#0d5559',
	midTone: '#156469',
};

interface AppSidebarProps {
	onSelectMeeting: (meeting: MeetingInterface) => void;
	meetings: MeetingInterface[];
	isOpen: boolean;
	onClose: () => void;
	selectedMeeting?: MeetingInterface | null;
}

export function AppSidebar({
	onSelectMeeting,
	meetings = [],
	isOpen,
	onClose,
	selectedMeeting,
}: AppSidebarProps) {
	const [searchTerm, setSearchTerm] = useState('');
	console.log('meetings', meetings);

	const filteredMeetings = meetings.filter(
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
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{filteredMeetings.length === 0 ? (
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
					<ScrollArea className="flex-1 pr-3">
						{nextMeeting && (
							<div className="px-4 py-3 mb-4 bg-[#63d392]/10 border border-[#63d392]/20 rounded-lg mx-4 shadow-inner">
								<div className="flex items-center gap-2 mb-2">
									<Clock className="h-3 w-3 text-[#63d392]" />
									<h3 className="font-semibold text-sm text-[#63d392]">
										Next Meeting
									</h3>
								</div>
								<p className="text-sm font-medium">{nextMeeting.title}</p>
								<p className="text-xs text-gray-300 mt-1 flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									{nextMeeting.date} - {nextMeeting.time}
								</p>
							</div>
						)}

						<div className="space-y-2 px-4">
							<h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-3 ml-1">
								All Meetings
							</h3>
							{filteredMeetings.map((meeting) => (
								<Button
									key={meeting.id || Math.random()}
									variant="ghost"
									className={cn(
										'w-full justify-start text-left p-3 h-auto mb-1 rounded-lg transition-all',
										selectedMeeting?.id === meeting.id
											? 'bg-[#63d392]/20 text-white hover:bg-[#63d392]/30 border-l-2 border-[#63d392]'
											: 'hover:bg-[#156469]/50 text-white',
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
												{meeting.date}
											</span>
											<span className="text-xs text-gray-300 flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{meeting.time}
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
															<p>{meeting.participants.length} Participants</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											)}
										</div>
									</div>
								</Button>
							))}
						</div>
					</ScrollArea>
				)}

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

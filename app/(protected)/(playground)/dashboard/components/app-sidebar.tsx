'use client';

import { useState } from 'react';
import { Search, Users, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { MeetingInterface } from '@/types';
import { MeetingStatus } from '@/types/meeting';

const PROVIDER_NAMES = {
	'google-meet': 'Google Meet',
	'ms-teams': 'Microsoft Teams',
	zoom: 'Zoom',
};

interface AppSidebarProps {
	onSelectMeeting: (meeting: MeetingInterface) => void;
	meetings: MeetingInterface[];
	isOpen: boolean;
	onClose: () => void;
}

export function AppSidebar({
	onSelectMeeting,
	meetings = [],
	isOpen,
	onClose,
}: AppSidebarProps) {
	const [searchTerm, setSearchTerm] = useState('');

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
			className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
		>
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-lg font-semibold">Meetings</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="md:hidden"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
				<div className="p-4">
					<div className="relative">
						<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search meetings..."
							className="pl-8"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
				<ScrollArea className="flex-1">
					{nextMeeting && (
						<div className="px-4 py-2 mb-4 bg-primary/10 rounded-md mx-4">
							<h3 className="font-semibold text-sm">Next Meeting</h3>
							<p className="text-sm">{nextMeeting.title}</p>
							<p className="text-xs text-muted-foreground">
								{nextMeeting.date} - {nextMeeting.time}
							</p>
						</div>
					)}
					<div className="space-y-2 p-4">
						{filteredMeetings.map((meeting) => (
							<Button
								key={meeting.id || Math.random()}
								variant="ghost"
								className="w-full justify-start text-left p-3 h-auto"
								onClick={() => {
									onSelectMeeting(meeting);
									onClose();
								}}
							>
								<div className="flex flex-col items-start w-full space-y-1">
									<span className="font-medium text-sm truncate w-full">
										{meeting.title}
									</span>
									<div className="flex flex-wrap items-center gap-2 w-full">
										<span className="text-xs text-muted-foreground">
											{meeting.date} - {meeting.time}
										</span>
									</div>
									<div className="flex flex-wrap items-center gap-2 w-full">
										<Badge
											variant="outline"
											className={`text-xs ${getStatusColor(meeting.status as MeetingStatus)}`}
										>
											{MeetingStatus[meeting.status as MeetingStatus]}
										</Badge>
										{meeting.participants && (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Badge
															variant="secondary"
															className="text-xs flex items-center gap-1"
														>
															<Users className="h-3 w-3" />
															{meeting.participants.length}
														</Badge>
													</TooltipTrigger>
													<TooltipContent>
														<p>Participants</p>
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
			</div>
		</div>
	);
}

function getStatusColor(status: MeetingStatus) {
	switch (status) {
		case MeetingStatus.Completed:
			return 'bg-green-100 text-green-800 border-green-300';
		case MeetingStatus.InProgress:
			return 'bg-blue-100 text-blue-800 border-blue-300';
		case MeetingStatus.Scheduled:
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		default:
			return 'bg-gray-100 text-gray-800 border-gray-300';
	}
}

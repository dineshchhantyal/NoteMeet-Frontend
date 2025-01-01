'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar';
import { MeetingInterface } from '@/types';
import { MeetingStatus } from '@/types/meeting';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
	onSelectMeeting: (value: SetStateAction<MeetingInterface | null>) => void;
	meetings: MeetingInterface[];
	loading?: boolean;
}

export function AppSidebar({
	onSelectMeeting,
	meetings,
	loading,
}: AppSidebarProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
		checkIsMobile();
		window.addEventListener('resize', checkIsMobile);
		return () => window.removeEventListener('resize', checkIsMobile);
	}, []);

	const filteredMeetings = meetings.filter(
		(meeting) =>
			meeting.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
			meeting.date?.includes(searchTerm) ||
			MeetingStatus[meeting.status ?? 0]
				?.toLowerCase()
				.includes(searchTerm?.toLowerCase()),
	);

	const nextMeeting = meetings.find(
		(meeting) => meeting.status === MeetingStatus.Scheduled,
	);
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="animate-spin" size={32} />
			</div>
		);
	}
	const SidebarContents = () => (
		<>
			<SidebarHeader>
				<div className="relative px-2 py-2">
					<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search meetings..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</SidebarHeader>
			<SidebarContent>
				{nextMeeting && (
					<div className="px-4 py-2 mb-4 bg-primary/10 rounded-md">
						<h3 className="font-semibold text-sm">Next Meeting</h3>
						<p className="text-sm">{nextMeeting.title}</p>
						<p className="text-xs text-muted-foreground">
							{nextMeeting.date} - {nextMeeting.time}
						</p>
					</div>
				)}
				<SidebarMenu>
					{filteredMeetings.map((meeting) => (
						<SidebarMenuItem key={meeting.id || Math.random()}>
							<SidebarMenuButton
								onClick={() => onSelectMeeting(meeting)}
								className="w-full"
							>
								<div className="flex flex-col items-start w-full overflow-hidden">
									<span className="font-medium truncate w-full">
										{meeting.title}
									</span>
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<span>
											{meeting.date} - {meeting.time}
										</span>
									</div>
									<div className="flex items-center gap-2 mt-1">
										{meeting.participants && (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Badge
															variant="secondary"
															className="flex items-center gap-1"
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
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
		</>
	);

	if (isMobile) {
		return (
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="md:hidden">
						<Menu className="h-4 w-4" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-[300px] sm:w-[400px]">
					<SidebarContents />
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<Sidebar className="hidden md:block">
			<SidebarContents />
		</Sidebar>
	);
}

// function getStatusColor(status: "Completed" | "Scheduled" | "In Progress" | undefined) {
//   switch (status) {
//     case 'Completed':
//       return 'bg-green-100 text-green-800 border-green-300'
//     case 'In Progress':
//       return 'bg-blue-100 text-blue-800 border-blue-300'
//     case 'Scheduled':
//       return 'bg-yellow-100 text-yellow-800 border-yellow-300'
//     default:
//       return 'bg-gray-100 text-gray-800 border-gray-300'
//   }
// }

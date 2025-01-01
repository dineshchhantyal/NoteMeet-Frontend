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
						<h3 className="font-semibold text-sm text-primary">Next Meeting</h3>
						<p className="text-sm">{nextMeeting.title}</p>
						<p className="text-xs text-muted-foreground">
							{new Date(nextMeeting.date).toLocaleDateString()} -{' '}
							{new Date(nextMeeting.date).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</p>
					</div>
				)}
				<SidebarMenu>
					{filteredMeetings.map((meeting) => (
						<SidebarMenuItem key={meeting.id || Math.random()} className="py-2">
							<SidebarMenuButton
								onClick={() => onSelectMeeting(meeting)}
								className="w-full bg-white py-2 hover:bg-gray-100 transition-colors rounded-md hover:text-primary"
							>
								<div className="flex flex-col justify-between w-full overflow-hidden">
									<span className="font-semibold text-gray-900 truncate">
										{meeting.title}
									</span>
									<p className="text-xs text-gray-700">
										{new Date(meeting.date).toLocaleDateString()} -{' '}
										{new Date(meeting.date).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
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

'use client';

import {
	Search,
	X,
	Calendar,
	CalendarCheck2,
	Share2,
	Users2,
	CreditCard,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { MeetingInterface } from '@/types';
import { MeetingStatus } from '@/types/meeting';
import { Skeleton } from '@/components/ui/skeleton';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm } from '@/lib/redux/features/meetings/meetingsSlice';
import { RootState } from '@/lib/redux/store';
import {
	MeetingCard,
	SharedMeetingCard,
} from '../meetings/shared-meeting-card';

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

interface AppSidebarProps {
	onSelectMeeting: (meeting: MeetingInterface) => void;
	meetings: MeetingInterface[];
	isOpen: boolean;
	onClose: () => void;
	selectedMeeting?: MeetingInterface | null;
	loading?: boolean; // Add loading prop
	onShowSubscription: () => void;
}

export function AppSidebar({
	onSelectMeeting,
	meetings = [],
	isOpen,
	onClose,
	selectedMeeting,
	loading = false, // Default to false
	onShowSubscription,
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
									<MeetingCard
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

				{/* Add subscription link at the bottom of the sidebar */}
				<div className="mt-auto px-3 py-4 border-t border-[#63d392]/20">
					<Button
						variant="ghost"
						className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#156469]/50"
						onClick={onShowSubscription}
					>
						<CreditCard className="h-4 w-4 mr-2 text-[#63d392]" />
						Manage Subscription
					</Button>
				</div>
			</div>
		</div>
	);
}

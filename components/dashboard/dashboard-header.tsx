import LogoLink from '@/components/LogoLink';
import { MeetingInterface } from '@/types';
import { NewMeetingDialog } from './new-meeting-dialog';
import { NotificationDropdown } from './notification-dropdown';
import { UserButtonClient } from './user-button-client';
import { Button } from '@/components/ui/button';
import { Search, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '@/lib/redux/features/meetings/meetingsSlice';
import { RootState } from '@/lib/redux/store';

interface DashboardHeaderProps {
	handleMeetingCreated: (newMeeting: MeetingInterface) => void;
	onShowSubscription: () => void;
}

const DashboardHeader = ({
	handleMeetingCreated,
	onShowSubscription,
}: DashboardHeaderProps) => {
	const dispatch = useDispatch();
	const searchTerm = useSelector(
		(state: RootState) => state.meetings.searchTerm,
	);
	const [showSearch, setShowSearch] = useState(false);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setSearchTerm(e.target.value));
	};

	const handleSearchBlur = () => {
		// Only hide the search if it's empty
		if (!searchTerm) {
			setShowSearch(false);
		}
	};

	return (
		<div className="flex flex-1 items-center gap-4 justify-between">
			<div className="flex items-center">
				<LogoLink showText={true} />
			</div>

			{showSearch ? (
				<div className="flex-1 max-w-md mx-4 relative">
					<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#63d392]" />
					<Input
						placeholder="Search meetings..."
						className="pl-9 bg-[#0d5559]/60 border-[#63d392]/30 text-white placeholder:text-gray-300 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
						autoFocus
						value={searchTerm}
						onChange={handleSearchChange}
						onBlur={handleSearchBlur}
					/>
				</div>
			) : (
				<div className="flex-1" />
			)}

			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setShowSearch(true)}
					className="text-white hover:bg-[#156469]/50 focus:ring-1 focus:ring-[#63d392]/30 hidden md:block"
					aria-label="Search"
				>
					<Search className="h-4.5 w-4.5" />
				</Button>

				<Button
					variant="ghost"
					onClick={onShowSubscription}
					className="text-white hover:bg-[#156469]/50"
				>
					<CreditCard className="h-4 w-4 mr-2 text-[#63d392]" />
					<span className="hidden sm:inline">Subscription</span>
				</Button>

				<NewMeetingDialog
					onMeetingCreated={handleMeetingCreated}
				></NewMeetingDialog>

				<NotificationDropdown />
				<UserButtonClient />
			</div>
		</div>
	);
};

export default DashboardHeader;

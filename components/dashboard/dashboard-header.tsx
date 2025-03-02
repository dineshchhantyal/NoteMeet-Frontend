import LogoLink from '@/components/LogoLink';
import { MeetingInterface } from '@/types';
import { NewMeetingDialog } from './new-meeting-dialog';
import { NotificationDropdown } from './notification-dropdown';
import { UserButtonClient } from './user-button-client';
import { Button } from '@/components/ui/button';
import { Search, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface DashboardHeaderProps {
	handleMeetingCreated: (newMeeting: MeetingInterface) => void;
}

const DashboardHeader = ({ handleMeetingCreated }: DashboardHeaderProps) => {
	const [showSearch, setShowSearch] = useState(false);

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
						onBlur={() => setShowSearch(false)}
					/>
				</div>
			) : (
				<div className="flex-1" />
			)}

			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setShowSearch(!showSearch)}
					className="text-white hover:bg-[#156469]/50 focus:ring-1 focus:ring-[#63d392]/30"
					aria-label="Search"
				>
					<Search className="h-4.5 w-4.5" />
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

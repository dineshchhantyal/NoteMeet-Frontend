import LogoLink from '@/components/LogoLink';
import { Button } from '@/components/ui/button';
import { MeetingInterface } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NewMeetingDialog } from './new-meeting-dialog';
import { NotificationDropdown } from './notification-dropdown';
import { UserButtonClient } from './user-button-client';

interface DashboardHeaderProps {
	setMeetings: (meetings: MeetingInterface[]) => void;
	meetings: MeetingInterface[];
}

const DashboardHeader = ({ setMeetings, meetings }: DashboardHeaderProps) => {
	const handleMeetingCreated = (newMeeting: MeetingInterface) => {
		setMeetings([...meetings, newMeeting]);
	};

	return (
		<div className="flex flex-1 h-16 items-center gap-4 border-b bg-background px-6">
			<LogoLink showText={true} />

			<div className="ml-auto flex items-center gap-4">
				<NewMeetingDialog onMeetingCreated={handleMeetingCreated} />
			</div>
			<NotificationDropdown />
			<UserButtonClient />
		</div>
	);
};

export default DashboardHeader;

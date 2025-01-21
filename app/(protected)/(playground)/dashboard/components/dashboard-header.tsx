import LogoLink from '@/components/LogoLink';
import { MeetingInterface } from '@/types';
import { NewMeetingDialog } from './new-meeting-dialog';
import { NotificationDropdown } from './notification-dropdown';
import { UserButtonClient } from './user-button-client';

interface DashboardHeaderProps {
	handleMeetingCreated: (newMeeting: MeetingInterface) => void;
}

const DashboardHeader = ({ handleMeetingCreated }: DashboardHeaderProps) => {
	return (
		<div className="flex flex-1 h-16 items-center gap-4 border-b bg-background px-6">
			<LogoLink showText={true} />

			<div className="ml-auto flex items-center gap-4 text-primary-400">
				<NewMeetingDialog onMeetingCreated={handleMeetingCreated} />
			</div>
			<NotificationDropdown />
			<UserButtonClient />
		</div>
	);
};

export default DashboardHeader;

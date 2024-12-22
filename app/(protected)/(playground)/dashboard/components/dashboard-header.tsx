import LogoLink from '@/components/LogoLink';
import { Button } from '@/components/ui/button';
import { MeetingInterface } from '@/interfaces';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NewMeetingDialog } from './new-meeting-dialog';
import { NotificationDropdown } from './notification-dropdown';
import { UserButtonClient } from './user-button-client';

interface DashboardHeaderProps {
	setIsSidebarCollapsed: (isCollapsed: boolean) => void;
	isSidebarCollapsed: boolean;
	setMeetings: (meetings: MeetingInterface[]) => void;
	meetings: MeetingInterface[];
}

const DashboardHeader = ({
	setIsSidebarCollapsed,
	isSidebarCollapsed,
	setMeetings,
	meetings,
}: DashboardHeaderProps) => {
	const handleMeetingCreated = (newMeeting: MeetingInterface) => {
		setMeetings([...meetings, newMeeting]);
	};

	return (
		<div className="flex h-16 items-center gap-4 border-b bg-background px-6">
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
				aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			>
				{isSidebarCollapsed ? (
					<ChevronRight className="h-4 w-4" />
				) : (
					<ChevronLeft className="h-4 w-4" />
				)}
			</Button>
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

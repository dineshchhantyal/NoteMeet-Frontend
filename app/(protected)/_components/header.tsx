import { UserButton } from '../../../components/auth/user-button';
import { NotificationDropdown } from '@/app/(protected)/(playground)/dashboard/components/notification-dropdown';
import LogoLink from '@/components/LogoLink';

interface HeaderProps {
	label: string;
}

const AuthenticatedHeader = ({ label }: HeaderProps) => {
	return (
		<header className="bg-white shadow-sm sticky top-0 z-50" aria-label={label}>
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<LogoLink showText={true} />
				<div className="flex space-x-4">
					<NotificationDropdown />
					<UserButton />
				</div>
			</div>
		</header>
	);
};

export default AuthenticatedHeader;

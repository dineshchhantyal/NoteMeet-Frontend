import { Button } from './ui/button';
import { LoginButton } from './auth/login-button';
import { NotificationDropdown } from '@/app/(protected)/(playground)/dashboard/components/notification-dropdown';
import { UserButton } from './auth/user-button';
import Link from 'next/link';
import LogoLink from './LogoLink';
import { currentUser } from '@/lib/auth';

interface HeaderProps {
	label: string;
}

export const Header = async ({ label }: HeaderProps) => {
	const user = await currentUser();

	return (
		<header className="bg-white shadow-sm sticky top-0 z-50" aria-label={label}>
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<LogoLink showText={true} />

				<div className="flex space-x-4">
					{!user && (
						<>
							<LoginButton mode="modal" asChild>
								<Button variant={'outline'}>Sign In</Button>
							</LoginButton>
							<LoginButton mode="modal" asChild>
								<Button variant={'secondary'}>Sign Up</Button>
							</LoginButton>
						</>
					)}
					{user && (
						<>
							<Link href="/dashboard">
								<Button variant={'outline'}>Dashboard</Button>
							</Link>
							<NotificationDropdown />
							<UserButton />
						</>
					)}
				</div>
			</div>
		</header>
	);
};

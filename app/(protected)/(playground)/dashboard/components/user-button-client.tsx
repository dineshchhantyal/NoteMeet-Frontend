import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogoutButton } from '@/components/auth/logout-button';
import { FaUser } from 'react-icons/fa';
import { ExitIcon } from '@radix-ui/react-icons';
import { SettingsIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

export const UserButtonClient = () => {
	const { data: user, status } = useSession();

	if (status === 'loading') {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user?.user.image || ''} />
					<AvatarFallback>
						<FaUser />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40" align="end">
				<DropdownMenuItem>
					<SettingsIcon className="h-4 w-4" />
					<a href="/settings">Settings</a>
				</DropdownMenuItem>
				<LogoutButton>
					<DropdownMenuItem>
						<ExitIcon className="h-4 w-4" />
						Logout
					</DropdownMenuItem>
				</LogoutButton>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

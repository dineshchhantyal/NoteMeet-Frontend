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
import { RiAdminLine } from 'react-icons/ri';
import { currentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export const UserButton = async () => {
	const user = await currentUser();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user?.image || ''} />
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

				{user?.role === UserRole.ADMIN && (
					<DropdownMenuItem className="animate-pulse">
						<RiAdminLine className="h-4 w-4" />
						<a href="/admin">Admin</a>
					</DropdownMenuItem>
				)}
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

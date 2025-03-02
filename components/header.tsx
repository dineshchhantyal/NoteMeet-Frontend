import { Button } from './ui/button';
import { LoginButton } from './auth/login-button';

import { UserButton } from './auth/user-button';
import Link from 'next/link';
import LogoLink from './LogoLink';
import { currentUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NotificationDropdown } from './dashboard/notification-dropdown';

interface HeaderProps {
	label: string;
	transparent?: boolean;
}

export const Header = async ({ label, transparent = false }: HeaderProps) => {
	const user = await currentUser();

	return (
		<header
			className={cn(
				'sticky top-0 z-50 transition-all duration-300',
				transparent
					? 'bg-transparent backdrop-blur-sm border-b border-[#63d392]/10'
					: 'bg-[#0a4a4e] shadow-md shadow-[#0a4a4e]/20',
			)}
			aria-label={label}
		>
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<LogoLink showText={true} />

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center space-x-6">
					{!user ? (
						<>
							<LoginButton mode="modal" asChild>
								<Button
									variant="outline"
									className="border-[#63d392] text-[#63d392] hover:bg-[#63d392]/10 hover:text-white"
								>
									Sign In
								</Button>
							</LoginButton>
							<LoginButton mode="modal" asChild>
								<Button className="bg-[#63d392] hover:bg-[#4fb87a] text-[#0a4a4e]">
									Sign Up
								</Button>
							</LoginButton>
						</>
					) : (
						<>
							<Link href="/dashboard">
								<Button
									variant="outline"
									className="border-[#63d392] text-[#63d392] hover:bg-[#63d392]/10 hover:text-white"
								>
									Dashboard
								</Button>
							</Link>
							<NotificationDropdown />
							<UserButton />
						</>
					)}
				</div>

				{/* Mobile Navigation */}
				<div className="md:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="text-white hover:text-[#63d392] hover:bg-transparent"
							>
								<Menu className="h-6 w-6" />
								<span className="sr-only">Menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="bg-[#0a4a4e] text-white border-l border-[#63d392]/20"
						>
							<nav className="flex flex-col space-y-6 mt-12">
								<div className="pt-6 mt-6 border-t border-[#63d392]/20 flex flex-col space-y-4">
									{!user ? (
										<>
											<LoginButton mode="modal" asChild>
												<Button
													variant="outline"
													className="w-full border-[#63d392] text-[#63d392] hover:bg-[#63d392]/10 hover:text-white"
												>
													Sign In
												</Button>
											</LoginButton>
											<LoginButton mode="modal" asChild>
												<Button className="w-full bg-[#63d392] hover:bg-[#4fb87a] text-[#0a4a4e]">
													Sign Up
												</Button>
											</LoginButton>
										</>
									) : (
										<>
											<Link href="/dashboard" className="w-full">
												<Button
													variant="outline"
													className="w-full border-[#63d392] text-[#63d392] hover:bg-[#63d392]/10 hover:text-white"
												>
													Dashboard
												</Button>
											</Link>
											<div className="flex justify-between items-center">
												<UserButton />
												<NotificationDropdown />
											</div>
										</>
									)}
								</div>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
};

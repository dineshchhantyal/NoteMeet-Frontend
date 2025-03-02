import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Settings, Share2 } from 'lucide-react';
import LogoLink from '../LogoLink';
import { MeetingInterface } from '@/types';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ShareManagement } from '../share/share-management';

interface MeetingHeaderProps {
	meeting?: MeetingInterface | null;
	showShareButton?: boolean;
}

export function MeetingHeader({
	meeting,
	showShareButton = false,
}: MeetingHeaderProps) {
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

	return (
		<header className="bg-[#0d5559]/90 backdrop-blur-sm border-b border-[#63d392]/20 text-white">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<LogoLink />

						<div className="relative">
							<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<Input
								type="search"
								placeholder="Search meetings..."
								className="pl-8 w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
							/>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						{showShareButton && meeting && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsShareDialogOpen(true)}
								className="border-[#63d392]/40 hover:bg-[#63d392]/20 text-white"
							>
								<Share2 className="h-4 w-4 mr-2" />
								Share
							</Button>
						)}
						<Button
							variant="ghost"
							size="icon"
							className="text-white/70 hover:text-white hover:bg-white/10"
						>
							<Bell className="h-5 w-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="text-white/70 hover:text-white hover:bg-white/10"
						>
							<Settings className="h-5 w-5" />
						</Button>
						<Avatar>
							<AvatarImage src="/avatar.png" alt="User" />
							<AvatarFallback className="bg-[#63d392]/30 text-white">
								UN
							</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</div>

			{/* Share Dialog */}
			{meeting && (
				<Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
					<DialogContent className="bg-[#0d5559] border-[#63d392]/30 text-white sm:max-w-md">
						<DialogHeader>
							<DialogTitle className="text-white">Share Meeting</DialogTitle>
						</DialogHeader>
						<ShareManagement meeting={meeting} />
					</DialogContent>
				</Dialog>
			)}
		</header>
	);
}

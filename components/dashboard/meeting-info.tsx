import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Share2, Trash2, Calendar, Clock, Timer } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { MeetingInterface } from '@/types';
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { MeetingStatus } from '@/types/meeting';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ShareManagement } from '../share/share-management';
import { useState } from 'react';

interface MeetingInfoProps {
	meeting: MeetingInterface;
	onMeetingDelete: (meetingId: string) => void;
}

export function MeetingInfo({ meeting, onMeetingDelete }: MeetingInfoProps) {
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

	const getStatusColor = (status: MeetingStatus) => {
		switch (status) {
			case MeetingStatus.Completed:
				return 'bg-[#63d392]/20 text-[#63d392] border-[#63d392]/30';
			case MeetingStatus.InProgress:
				return 'bg-[#156469]/30 text-[#63d392] border-[#156469]/50';
			case MeetingStatus.Scheduled:
				return 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30';
			case MeetingStatus.Cancelled:
				return 'bg-red-500/10 text-red-400 border-red-500/30';
			default:
				return 'bg-[#0d5559]/50 text-gray-300 border-[#63d392]/20';
		}
	};

	const getInitialsColor = (name: string) => {
		const colors = [
			'bg-[#63d392]/30 text-[#63d392]',
			'bg-[#156469]/30 text-white',
			'bg-[#0d5559]/40 text-white',
			'bg-[#fbbf24]/30 text-[#fbbf24]',
			'bg-[#818cf8]/30 text-[#818cf8]',
		];

		const hash = name
			.split('')
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colors[hash % colors.length];
	};

	const formatDate = (dateStr: string) => {
		if (!dateStr) return 'Date not set';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		});
	};

	const formatTime = (timeStr: string) => {
		return timeStr || 'Not set';
	};

	const participants = meeting.participants || ['John D', 'Jane S', 'Mike R'];

	return (
		<Card className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 text-white shadow-md overflow-hidden">
			{/* More compact header */}
			<CardHeader className="border-b border-[#63d392]/20 py-3 px-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-3">
						<div className="bg-[#0d5559]/70 p-2.5 rounded-md">
							<Calendar className="h-5 w-5 text-[#63d392]" />
						</div>
						<div>
							<CardTitle className="text-lg font-semibold text-white flex items-center gap-2 flex-wrap">
								{meeting.title}
								<Badge
									variant="outline"
									className={`${getStatusColor(meeting.status as MeetingStatus)}`}
								>
									{MeetingStatus[meeting.status as MeetingStatus] || 'Unknown'}
								</Badge>
							</CardTitle>
							<p className="text-xs text-gray-300 mt-0.5">
								ID: {meeting.id.substring(0, 8)}...
							</p>
						</div>
					</div>

					<div className="flex items-center">
						<Button
							variant="outline"
							onClick={() => setIsShareDialogOpen(true)}
							size="sm"
							className="bg-[#63d392]/10 hover:bg-[#63d392]/20 text-[#63d392] border-[#63d392]/30 hover:border-[#63d392]/50 mr-2"
						>
							<Share2 className="h-3.5 w-3.5" />
							<span className="ml-1.5 text-xs">Share</span>
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="hover:bg-red-500/10 text-gray-400 hover:text-red-400 h-8 w-8 p-0"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
								<AlertDialogHeader>
									<AlertDialogTitle className="text-white">
										Delete Meeting
									</AlertDialogTitle>
									<AlertDialogDescription className="text-gray-300">
										Are you sure you want to delete this meeting?
										<span className="block mt-2 font-medium text-white">
											&quot;{meeting.title}&quot;
										</span>
										<span className="block mt-1 text-sm text-red-400">
											This action cannot be undone. All notes, transcripts, and
											shared access will be permanently removed.
										</span>
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel className="bg-[#156469]/50 border-[#63d392]/30 text-white hover:bg-[#156469]/70 hover:text-white">
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => onMeetingDelete(meeting.id)}
										className="bg-red-500/80 text-white hover:bg-red-500"
									>
										Delete Meeting
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</CardHeader>

			{/* More compact content */}
			<CardContent className="py-3 px-4">
				<div className="flex items-center justify-between gap-2 mb-3">
					<div className="flex items-center gap-3 flex-wrap">
						{/* Date chip */}
						<div className="bg-[#0d5559]/40 px-3 py-1.5 rounded-full flex items-center">
							<Calendar className="h-3.5 w-3.5 text-[#63d392] mr-1.5" />
							<span className="text-xs">{formatDate(meeting.date)}</span>
						</div>

						{/* Time chip */}
						<div className="bg-[#0d5559]/40 px-3 py-1.5 rounded-full flex items-center">
							<Clock className="h-3.5 w-3.5 text-[#63d392] mr-1.5" />
							<span className="text-xs">{formatTime(meeting.time)}</span>
						</div>

						{/* Duration chip */}
						<div className="bg-[#0d5559]/40 px-3 py-1.5 rounded-full flex items-center">
							<Timer className="h-3.5 w-3.5 text-[#63d392] mr-1.5" />
							<span className="text-xs">{meeting.duration || '1 hour'}</span>
						</div>
					</div>

					{/* Redesigned participants display */}
					<div className="flex items-center bg-[#0d5559]/40 px-2 py-1.5 rounded-full">
						<div className="flex -space-x-2 mr-2">
							<TooltipProvider>
								{participants.slice(0, 3).map((name, index) => (
									<Tooltip key={index}>
										<TooltipTrigger asChild>
											<Avatar
												className={`h-5 w-5 border border-[#0d5559] ${getInitialsColor(name)}`}
											>
												<AvatarFallback
													className={`text-[10px] ${getInitialsColor(name)}`}
												>
													{name
														.split(' ')
														.map((n) => n[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
										</TooltipTrigger>
										<TooltipContent className="bg-[#0d5559] text-white border-[#63d392]/20">
											<p>{name}</p>
										</TooltipContent>
									</Tooltip>
								))}
							</TooltipProvider>

							{participants.length > 3 && (
								<Avatar className="h-5 w-5 bg-[#156469]/70 text-white border border-[#0d5559]">
									<AvatarFallback className="text-[10px]">
										+{participants.length - 3}
									</AvatarFallback>
								</Avatar>
							)}
						</div>
						<span className="text-xs">{participants.length}</span>
					</div>
				</div>

				{/* Meeting description area with subtle separator */}
				<div className="mt-3 pt-3 border-t border-[#63d392]/10">
					<div className="text-xs text-gray-300 mb-1">Description</div>
					<p className="text-sm text-gray-100">
						{meeting.description ||
							'No description available for this meeting.'}
					</p>
				</div>
			</CardContent>

			{/* Share dialog (unchanged) */}
			{meeting && (
				<Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
					<DialogContent className="bg-[#0d5559] border-[#63d392]/30 text-white sm:max-w-xl w-[90vw]">
						<DialogHeader>
							<DialogTitle className="text-white">Share Meeting</DialogTitle>
						</DialogHeader>
						<ShareManagement meeting={meeting} />
					</DialogContent>
				</Dialog>
			)}
		</Card>
	);
}

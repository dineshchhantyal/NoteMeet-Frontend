import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	Download,
	Share2,
	Trash2,
	Calendar,
	Clock,
	Timer,
	Users,
} from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { MeetingInterface } from '@/types';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { MeetingStatus } from '@/types/meeting';

interface MeetingInfoProps {
	meeting: MeetingInterface;
	onMeetingDelete: (meetingId: string) => void;
}

export function MeetingInfo({ meeting, onMeetingDelete }: MeetingInfoProps) {
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

	// Generate participant initials with consistent colors
	const getInitialsColor = (name: string) => {
		const colors = [
			'bg-[#63d392]/30 text-[#63d392]',
			'bg-[#156469]/30 text-white',
			'bg-[#0d5559]/40 text-white',
			'bg-[#fbbf24]/30 text-[#fbbf24]',
			'bg-[#818cf8]/30 text-[#818cf8]',
		];

		// Simple hash function to get consistent color for a name
		const hash = name
			.split('')
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colors[hash % colors.length];
	};

	const formattedDate = meeting.date
		? new Date(meeting.date).toLocaleDateString('en-US', {
				weekday: 'short',
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})
		: 'Date not set';

	// Mock participants for display - replace with actual data when available
	const participants = meeting.participants || ['John D', 'Jane S', 'Mike R'];

	return (
		<Card className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 text-white shadow-md overflow-hidden">
			<CardHeader className="border-b border-[#63d392]/20 pb-4">
				<div className="flex justify-between items-center">
					<div className="space-y-1">
						<CardTitle className="text-xl font-semibold text-white flex items-center">
							{meeting.title}
							<Badge
								variant="outline"
								className={`ml-3 ${getStatusColor(meeting.status as MeetingStatus)}`}
							>
								{MeetingStatus[meeting.status as MeetingStatus] || 'Unknown'}
							</Badge>
						</CardTitle>
						<p className="text-sm text-gray-300">
							Meeting ID: {meeting.id.substring(0, 8)}...
						</p>
					</div>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="hover:bg-red-500/20 text-gray-400 hover:text-red-400"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
							<AlertDialogHeader>
								<AlertDialogTitle className="text-white">
									Delete Meeting
								</AlertDialogTitle>
								<AlertDialogDescription className="text-gray-300">
									Are you sure you want to delete this meeting? This action
									cannot be undone. All meeting data including transcripts and
									recordings will be permanently removed.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="bg-[#156469]/50 text-white hover:bg-[#156469] border-[#63d392]/20">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => onMeetingDelete(meeting.id)}
									className="bg-red-600/80 hover:bg-red-700 text-white border-red-600/50"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardHeader>

			<CardContent className="pt-4">
				<div className="flex flex-col md:flex-row justify-between gap-6">
					<div className="space-y-3 flex-1">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="flex items-center space-x-2 bg-[#0d5559]/40 p-2 rounded-md">
								<Calendar className="h-4 w-4 text-[#63d392]" />
								<div>
									<p className="text-xs text-gray-300">Date</p>
									<p className="text-sm">{formattedDate}</p>
								</div>
							</div>

							<div className="flex items-center space-x-2 bg-[#0d5559]/40 p-2 rounded-md">
								<Clock className="h-4 w-4 text-[#63d392]" />
								<div>
									<p className="text-xs text-gray-300">Time</p>
									<p className="text-sm">{meeting.time || 'Not specified'}</p>
								</div>
							</div>

							<div className="flex items-center space-x-2 bg-[#0d5559]/40 p-2 rounded-md">
								<Timer className="h-4 w-4 text-[#63d392]" />
								<div>
									<p className="text-xs text-gray-300">Duration</p>
									<p className="text-sm">{meeting.duration || '1 hour'}</p>
								</div>
							</div>
						</div>

						<div className="bg-[#0d5559]/40 p-2 rounded-md">
							<div className="flex items-center space-x-2 mb-2">
								<Users className="h-4 w-4 text-[#63d392]" />
								<p className="text-sm">Participants ({participants.length})</p>
							</div>

							<div className="flex -space-x-3 flex-wrap">
								<TooltipProvider>
									{participants.map((name, index) => (
										<Tooltip key={index}>
											<TooltipTrigger asChild>
												<Avatar
													className={`border-2 border-[#0d5559] ${getInitialsColor(name)}`}
												>
													{/* <AvatarImage src={`https://avatar.vercel.sh/${name.replace(' ', '')}.png`} /> */}
													<AvatarFallback
														className={`text-sm ${getInitialsColor(name)}`}
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
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row md:flex-col gap-2 sm:items-center md:items-stretch min-w-[180px]">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										className="bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30 hover:border-[#63d392]/50 w-full"
									>
										<Download className="mr-2 h-4 w-4 text-[#63d392]" />
										Download Transcript
									</Button>
								</TooltipTrigger>
								<TooltipContent className="bg-[#0d5559] text-white border-[#63d392]/20">
									<p>Download the full meeting transcript</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										className="bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30 hover:border-[#63d392]/50 w-full"
									>
										<Share2 className="mr-2 h-4 w-4 text-[#63d392]" />
										Share Meeting
									</Button>
								</TooltipTrigger>
								<TooltipContent className="bg-[#0d5559] text-white border-[#63d392]/20">
									<p>Share this meeting with others</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

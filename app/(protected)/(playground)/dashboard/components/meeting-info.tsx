import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Download, Share2, PlayCircle, DeleteIcon } from 'lucide-react';
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

interface MeetingInfoProps {
	meeting: MeetingInterface;
	onMeetingDelete: (meetingId: string) => void;
}

export function MeetingInfo({ meeting, onMeetingDelete }: MeetingInfoProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl">{meeting.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex justify-between items-center mb-4">
					<div>
						<p className="text-sm text-muted-foreground">
							Date: {meeting.date}
						</p>
						<p className="text-sm text-muted-foreground">
							Time: {meeting.duration}
						</p>
						<p className="text-sm text-muted-foreground">Duration: 1 hour</p>
					</div>
					<div className="flex -space-x-2">
						{['John D', 'Jane S', 'Mike R'].map((attendee, index) => (
							<Avatar key={index}>
								<AvatarFallback>
									{attendee
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</AvatarFallback>
							</Avatar>
						))}
					</div>
				</div>
				<div className="flex space-x-2">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="sm">
									<PlayCircle className="mr-2 h-4 w-4" />
									View Summary
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>View the AI-generated summary of this meeting</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="sm">
									<Download className="mr-2 h-4 w-4" />
									Download Transcript
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Download the full meeting transcript</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="sm">
									<Share2 className="mr-2 h-4 w-4" />
									Share Recording
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Share the meeting recording with others</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="text-red-500 outline-red-600"
							>
								<DeleteIcon className="mr-2 h-4 w-4" />
								Delete Meeting
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Meeting</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete this meeting? This action
									cannot be undone. All meeting data including transcripts and
									recordings will be permanently removed.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => onMeetingDelete(meeting.id)}
									className="bg-red-600 hover:bg-red-700"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardContent>
		</Card>
	);
}

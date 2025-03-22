import { MeetingInterface } from '@/types';
import { Clock, Calendar, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatTime } from '@/lib/utils/date-time';

interface SharedMeetingCardProps {
	meeting: MeetingInterface;
	isSelected: boolean;
	onSelect: () => void;
}

export function SharedMeetingCard({
	meeting,
	isSelected,
	onSelect,
}: SharedMeetingCardProps) {
	return (
		<div
			onClick={onSelect}
			className={`p-3 rounded-md cursor-pointer transition ${
				isSelected
					? 'bg-[#63d392]/20 border-[#63d392]/70 border'
					: 'hover:bg-[#156469]/50 border border-transparent'
			}`}
		>
			<div className="flex justify-between items-start mb-1">
				<h4 className="font-medium text-white">{meeting.title}</h4>
			</div>

			<div className="flex items-center gap-2 text-gray-300 text-xs mb-2">
				<Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-1.5">
					Shared
				</Badge>
				<span className="flex items-center">
					<UserCircle className="h-3 w-3 mr-1 text-gray-400" />
				</span>
			</div>

			<div className="flex items-center gap-2 text-gray-300 text-xs">
				<Calendar className="h-3 w-3" />
				{formatDate(meeting.date)}
				<Clock className="h-3 w-3 ml-2" />
				{formatTime(meeting.time)}
			</div>
		</div>
	);
}

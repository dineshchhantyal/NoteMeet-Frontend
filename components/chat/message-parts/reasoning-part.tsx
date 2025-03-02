import { ReasoningPart as ReasoningPartType } from '../types';
import { Brain } from 'lucide-react';

interface ReasoningPartProps {
	part: ReasoningPartType;
}

export function ReasoningPart({ part }: ReasoningPartProps) {
	return (
		<div className="message-part reasoning-part my-3">
			<div className="bg-[#156469]/40 border-l-2 border-[#63d392]/60 rounded-r-md p-2 pl-3">
				<div className="flex items-center mb-1 text-[#63d392]/90">
					<Brain className="h-4 w-4 mr-1" />
					<p className="text-xs">Reasoning</p>
				</div>
				<div className="text-gray-200 text-sm italic">{part.content}</div>
			</div>
		</div>
	);
}

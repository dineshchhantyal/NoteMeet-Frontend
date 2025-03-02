import { SourcePart as SourcePartType } from '../types';
import { FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SourcePartProps {
	part: SourcePartType;
}

export function SourcePart({ part }: SourcePartProps) {
	return (
		<div className="message-part source-part my-3">
			<div className="flex items-center bg-[#0a4a4e]/70 rounded-md p-2 text-xs">
				<FileText className="h-3.5 w-3.5 mr-2 text-[#63d392]/80" />
				<p className="flex-1 text-gray-200">{part.citation}</p>
				{part.url && (
					<Button
						size="sm"
						variant="ghost"
						className="h-7 px-2 text-[#63d392] hover:bg-[#156469]/40"
						asChild
					>
						<a href={part.url} target="_blank" rel="noopener noreferrer">
							<ExternalLink className="h-3.5 w-3.5" />
						</a>
					</Button>
				)}
			</div>
		</div>
	);
}

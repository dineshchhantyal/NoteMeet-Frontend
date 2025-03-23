// components/chat/message-parts/ToolResultPart.tsx
import React from 'react';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ToolResultPart as ToolResultPartType } from '../types';

interface ToolResultPartProps {
	part: ToolResultPartType;
}

export function ToolResultPart({ part }: ToolResultPartProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const { toolName, result, success } = part;

	// Format the result for display
	const formattedResult =
		typeof result === 'object'
			? JSON.stringify(result, null, 2)
			: String(result);
	return (
		<div className="border border-[#63d392]/20 rounded-md overflow-hidden">
			<Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
				<div className="flex items-center justify-between bg-[#0a4a4e] px-3 py-2">
					<div className="flex items-center gap-2">
						<CheckCircle
							className={cn(
								'h-4 w-4',
								success ? 'text-[#63d392]' : 'text-amber-400',
							)}
						/>
						<span className="font-mono text-sm">
							{toolName} {success ? 'result' : 'error'}
						</span>
					</div>

					<CollapsibleTrigger asChild>
						<button className="p-1 hover:bg-[#156469]/40 rounded">
							{isOpen ? (
								<ChevronUp className="h-4 w-4 text-gray-400" />
							) : (
								<ChevronDown className="h-4 w-4 text-gray-400" />
							)}
						</button>
					</CollapsibleTrigger>
				</div>

				<CollapsibleContent>
					<pre className="p-3 bg-[#0a4a4e]/50 text-sm overflow-x-auto whitespace-pre-wrap text-gray-300 max-h-60">
						{formattedResult}
					</pre>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}

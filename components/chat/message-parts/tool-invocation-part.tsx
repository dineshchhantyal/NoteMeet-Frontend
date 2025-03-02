import React, { useState } from 'react';
import { Code, ChevronDown, ChevronUp } from 'lucide-react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ToolInvocationPart as ToolInvocationPartType } from '../types';

interface ToolInvocationPartProps {
	part: ToolInvocationPartType;
}

export function ToolInvocationPart({ part }: ToolInvocationPartProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { tool, params } = part;

	// Format the params for display
	const formattedParams = JSON.stringify(params, null, 2);

	return (
		<div className="border border-[#63d392]/20 rounded-md overflow-hidden">
			<Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
				<div className="flex items-center justify-between bg-[#0a4a4e] px-3 py-2">
					<div className="flex items-center gap-2">
						<Code className="h-4 w-4 text-[#63d392]" />
						<span className="font-mono text-sm">{tool} invoked</span>
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
					<div className="bg-[#0a4a4e]/50 p-3">
						<div className="text-xs text-gray-400 mb-1">Parameters:</div>
						<pre className="text-sm overflow-x-auto whitespace-pre-wrap text-gray-300">
							{formattedParams}
						</pre>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}

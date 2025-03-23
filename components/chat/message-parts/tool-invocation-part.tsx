import React from 'react';
import { ToolInvocationPart as ToolInvocationPartType } from '../types';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Search, Hourglass, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToolInvocationPart({ part }: { part: ToolInvocationPartType }) {
	const [isOpen, setIsOpen] = React.useState(false);
	const { toolInvocation } = part;

	// Status indicators based on state
	const getStatusIcon = () => {
		switch (toolInvocation.state) {
			case 'pending':
				return <Hourglass className="h-4 w-4 text-amber-400 animate-pulse" />;
			case 'result':
				return <Check className="h-4 w-4 text-green-400" />;
			case 'error':
				return <X className="h-4 w-4 text-red-400" />;
			default:
				return <Search className="h-4 w-4 text-blue-400" />;
		}
	};

	// Format tool arguments for display
	const formatArgs = (args: any) => {
		if (!args) return null;

		return (
			<div className="grid grid-cols-2 gap-2 text-sm mt-1 text-[#63d392]/80">
				{Object.entries(args).map(([key, value]) => (
					<React.Fragment key={key}>
						<div className="font-medium">{key}:</div>
						<div className="text-white">{JSON.stringify(value)}</div>
					</React.Fragment>
				))}
			</div>
		);
	};

	// Format result for different types of responses
	const formatResult = (result: any) => {
		if (!result) return null;

		if (typeof result === 'string') {
			return <div className="text-white mt-2">{result}</div>;
		}

		// Handle specific tool results
		if (toolInvocation.toolName === 'searchTranscriptTool' && result.text) {
			// For transcript searches, show a summary instead of full response
			return (
				<div className="mt-2">
					<div className="text-xs p-2 bg-[#0a4a4e] rounded overflow-x-auto text-white">
						<div className="font-medium mb-2">Search Results:</div>
						<div className="truncate-text">
							{result.text.length > 300
								? result.text.substring(0, 300) + '...'
								: result.text}
						</div>
						{result.words && (
							<div className="mt-2 text-gray-400 text-xs">
								Found {result.words.length} matching segments
							</div>
						)}
					</div>
				</div>
			);
		}

		// For other object results, limit the size
		const stringified = JSON.stringify(result, null, 2);
		const isLarge = stringified.length > 500;

		return (
			<div className="mt-2">
				<pre className="text-xs p-2 bg-[#0a4a4e] rounded overflow-x-auto text-white">
					{isLarge
						? JSON.stringify(
								result,
								(key, value) => {
									// Truncate arrays and long strings
									if (Array.isArray(value) && value.length > 5) {
										return [
											`${value.slice(0, 5).map((v) => (typeof v === 'object' ? '{...}' : v))}`,
											`... ${value.length - 5} more items`,
										];
									}
									if (typeof value === 'string' && value.length > 100) {
										return value.substring(0, 100) + '...';
									}
									return value;
								},
								2,
							)
						: stringified}
				</pre>
				{isLarge && (
					<button
						className="text-xs text-blue-400 mt-1 hover:underline"
						onClick={(e) => {
							e.preventDefault();
							navigator.clipboard.writeText(stringified);
							alert('Full result copied to clipboard');
						}}
					>
						Copy full result to clipboard
					</button>
				)}
			</div>
		);
	};

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className={cn(
				'rounded-lg p-3 transition-colors',
				'bg-[#0d5559]/40 border border-[#63d392]/30',
				isOpen && 'bg-[#0d5559]/60',
			)}
		>
			<div className="flex items-center gap-2">
				{getStatusIcon()}
				<CollapsibleTrigger asChild>
					<button className="flex items-center justify-between w-full text-left">
						<div>
							<span className="font-semibold text-[#63d392]">
								{toolInvocation.toolName}
							</span>
							<span className="text-xs text-gray-400 ml-2">
								Tool{' '}
								{toolInvocation.state === 'result'
									? 'executed'
									: toolInvocation.state}
							</span>
						</div>
						<div className="text-xs text-gray-400">
							{isOpen ? 'Hide details' : 'Show details'}
						</div>
					</button>
				</CollapsibleTrigger>
			</div>

			<CollapsibleContent className="mt-2 text-sm space-y-2">
				<div>
					<div className="text-gray-400 mb-1">Arguments:</div>
					{formatArgs(toolInvocation.args)}
				</div>

				{toolInvocation.state === 'result' && (
					<div>
						<div className="text-gray-400 mb-1">Result:</div>
						{formatResult(toolInvocation.result)}
					</div>
				)}

				{toolInvocation.state === 'error' && (
					<div>
						<div className="text-red-400 mb-1">Error:</div>
						<div className="text-white">{toolInvocation.error}</div>
					</div>
				)}
			</CollapsibleContent>
		</Collapsible>
	);
}

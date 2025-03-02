import { Button } from '@/components/ui/button';
import { Download, RefreshCcw, Search, MessageSquare } from 'lucide-react';

interface ChatHeaderProps {
	expanded: boolean;
	setExpanded: (expanded: boolean) => void;
	hasMessages: boolean;
	onReset: () => void;
	onExport: () => void;
	onSearch: () => void;
}

export function ChatHeader({
	expanded,
	setExpanded,
	hasMessages,
	onReset,
	onExport,
	onSearch,
}: ChatHeaderProps) {
	return (
		<div
			className="flex items-center justify-between bg-[#0d5559]/80 px-4 py-3 border-b border-[#63d392]/20 cursor-pointer"
			onClick={() => setExpanded(!expanded)}
		>
			<div className="flex items-center">
				<div className="bg-[#63d392]/20 p-1.5 rounded-md mr-3">
					<MessageSquare className="h-5 w-5 text-[#63d392]" />
				</div>
				<h3 className="font-medium text-white">AI Meeting Assistant</h3>
			</div>

			<div
				className="flex items-center gap-2"
				onClick={(e) => e.stopPropagation()}
			>
				{expanded && hasMessages && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onSearch}
						className="text-white hover:bg-[#156469]/50 p-0 h-8 w-8"
						title="Search conversation"
					>
						<Search className="h-4 w-4" />
					</Button>
				)}

				{expanded && hasMessages && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onReset}
						className="text-white hover:bg-[#156469]/50 p-0 h-8 w-8"
						title="Reset conversation"
					>
						<RefreshCcw className="h-4 w-4" />
					</Button>
				)}

				{expanded && hasMessages && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onExport}
						className="text-white hover:bg-[#156469]/50 p-0 h-8 w-8"
						title="Export conversation"
					>
						<Download className="h-4 w-4" />
					</Button>
				)}
			</div>
		</div>
	);
}

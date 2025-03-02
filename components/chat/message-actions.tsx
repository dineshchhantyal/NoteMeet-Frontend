import { Button } from '@/components/ui/button';
import { Copy, CheckCheck } from 'lucide-react';
import { ExtendedChatMessage } from './types';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface MessageActionsProps {
	message: ExtendedChatMessage;
	onCopy: (messageId: string, content: string) => void;
	isCopied: boolean;
}

export function MessageActions({
	message,
	onCopy,
	isCopied,
}: MessageActionsProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onCopy(message.id, message.content)}
						className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-[#156469]/40"
					>
						{isCopied ? (
							<CheckCheck className="h-3.5 w-3.5" />
						) : (
							<Copy className="h-3.5 w-3.5" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>{isCopied ? 'Copied!' : 'Copy message'}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

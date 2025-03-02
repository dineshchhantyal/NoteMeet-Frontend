import { memo } from 'react';
import { MessageContent } from './message-content';
import { MessageActions } from './message-actions';
import { ExtendedChatMessage } from './types';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserCircle, Bot } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessageProps {
	message: ExtendedChatMessage;
	onCopy: (messageId: string, content: string) => void;
	isCopied: boolean;
}

export const ChatMessage = memo(function ChatMessage({
	message,
	onCopy,
	isCopied,
}: ChatMessageProps) {
	const isUser = message.role === 'user';
	const timestamp = message.createdAt
		? new Date(message.createdAt)
		: new Date();

	return (
		<div
			className={cn(
				'group flex items-start gap-3 px-4 py-3 hover:bg-[#156469]/10 transition-colors',
				isUser ? 'flex-row-reverse text-right' : 'flex-row',
			)}
			id={`message-${message.id}`}
		>
			<Avatar
				className={cn(
					'h-8 w-8 mt-1',
					isUser ? 'bg-[#63d392]/20' : 'bg-[#0d5559]/70',
				)}
			>
				{isUser ? (
					<UserCircle className="h-5 w-5 text-[#63d392]" />
				) : (
					<Bot className="h-5 w-5 text-[#63d392]" />
				)}
			</Avatar>

			<div className="flex flex-col flex-1 space-y-1 overflow-hidden">
				<div className="flex items-center text-xs text-gray-400">
					<div>{isUser ? 'You' : 'NoteMeet AI'}</div>
					<div className="mx-1.5">•</div>
					<div>{format(timestamp, 'h:mm a')}</div>

					{!isUser && (
						<div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
							<MessageActions
								message={message}
								onCopy={onCopy}
								isCopied={isCopied}
							/>
						</div>
					)}
				</div>

				<div
					className={cn(
						'rounded-lg p-3 max-w-[85%]',
						isUser
							? 'bg-[#63d392]/20 text-white ml-auto'
							: 'bg-[#0d5559]/70 text-gray-100',
					)}
				>
					<MessageContent message={message} />
				</div>
			</div>
		</div>
	);
});

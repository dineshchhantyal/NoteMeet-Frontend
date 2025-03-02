import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot } from 'lucide-react';
import { ReactNode } from 'react';
import { ExtendedChatMessage } from './types';
import { ChatMessage } from './chat-message';

interface ChatMessagesProps {
	messages: ExtendedChatMessage[];
	messagesEndRef: React.RefObject<HTMLDivElement>;
	onCopy: (messageId: string, content: string) => void;
	copiedMessageId: string | null;
	isEmpty: boolean;
	renderSuggestions: () => ReactNode;
}

export function ChatMessages({
	messages,
	messagesEndRef,
	onCopy,
	copiedMessageId,
	isEmpty,
	renderSuggestions,
}: ChatMessagesProps) {
	return (
		<ScrollArea className="flex-1 p-4 h-[350px]">
			<div className="space-y-6">
				{isEmpty ? (
					<div className="flex flex-col items-center justify-center h-full py-8 text-center">
						<div className="bg-[#0d5559]/70 p-4 rounded-full mb-4">
							<Bot className="h-8 w-8 text-[#63d392]/80" />
						</div>
						<h3 className="font-medium text-white mb-1">
							AI Meeting Assistant
						</h3>
						<p className="text-sm text-gray-300 mb-6 max-w-xs">
							Ask questions about the meeting, get summaries, or extract action
							items
						</p>

						<div className="grid grid-cols-1 gap-2 w-full max-w-md">
							{renderSuggestions()}
						</div>
					</div>
				) : (
					messages.map((message) => (
						<ChatMessage
							key={message.id}
							message={message}
							onCopy={onCopy}
							isCopied={message.id === copiedMessageId}
						/>
					))
				)}
				<div ref={messagesEndRef} />
			</div>
		</ScrollArea>
	);
}

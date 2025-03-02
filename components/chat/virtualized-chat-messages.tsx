'use client';

import React, { useRef, useEffect } from 'react';
import { ExtendedChatMessage } from './types';
import { ChatMessage } from './chat-message';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { format } from 'date-fns';
import { Bot } from 'lucide-react';

interface VirtualizedChatMessagesProps {
	messages: ExtendedChatMessage[];
	messagesEndRef: React.RefObject<HTMLDivElement>;
	onCopy: (messageId: string, content: string) => void;
	copiedMessageId: string | null;
	isEmpty: boolean;
	searchQuery?: string;
	renderSuggestions: () => React.ReactNode;
}

export function VirtualizedChatMessages({
	messages,
	messagesEndRef,
	onCopy,
	copiedMessageId,
	isEmpty,
	renderSuggestions,
}: VirtualizedChatMessagesProps) {
	const virtuosoRef = useRef<VirtuosoHandle>(null);

	// Auto-scroll if new messages are added
	useEffect(() => {
		if (messages.length > 0 && virtuosoRef.current) {
			virtuosoRef.current.scrollToIndex({
				index: messages.length - 1,
				behavior: 'smooth',
			});
		}
	}, [messages.length]);

	// Empty state
	if (isEmpty) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-6">
				<div className="bg-[#0d5559]/70 p-4 rounded-full mb-4">
					<Bot className="h-8 w-8 text-[#63d392]/80" />
				</div>
				<h3 className="text-xl font-medium text-white mb-2">
					AI Meeting Assistant
				</h3>
				<p className="text-gray-300 mb-8 max-w-md text-center">
					Ask questions about the meeting, get summaries, or extract specific
					details from the transcript.
				</p>
				<div className="grid grid-cols-1 gap-3 w-full max-w-md">
					{renderSuggestions()}
				</div>
			</div>
		);
	}

	// Group messages by date for better readability
	const groupedByDate: Record<string, ExtendedChatMessage[]> = {};
	messages.forEach((message) => {
		const date = format(message.createdAt || new Date(), 'yyyy-MM-dd');
		if (!groupedByDate[date]) {
			groupedByDate[date] = [];
		}
		groupedByDate[date].push(message);
	});

	// Flatten the grouped messages with date headers
	const itemsWithDateHeaders: (
		| ExtendedChatMessage
		| { type: 'date-header'; date: string }
	)[] = [];
	Object.entries(groupedByDate).forEach(([date, msgs]) => {
		itemsWithDateHeaders.push({ type: 'date-header', date });
		itemsWithDateHeaders.push(...msgs);
	});

	return (
		<Virtuoso
			ref={virtuosoRef}
			style={{ height: '100%', width: '100%' }}
			totalCount={itemsWithDateHeaders.length}
			itemContent={(index) => {
				const item = itemsWithDateHeaders[index];

				if ('type' in item && item.type === 'date-header') {
					return (
						<div className="sticky top-0 z-10 flex justify-center py-2 px-4">
							<div className="bg-[#0d5559]/80 text-gray-300 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
								{format(new Date(item.date), 'MMMM d, yyyy')}
							</div>
						</div>
					);
				}

				// It's a message
				const message = item as ExtendedChatMessage;
				const isLast = index === itemsWithDateHeaders.length - 1;

				return (
					<>
						<ChatMessage
							message={message}
							onCopy={onCopy}
							isCopied={message.id === copiedMessageId}
						/>
						{isLast && <div ref={messagesEndRef} />}
					</>
				);
			}}
			components={{
				Footer: () => <div className="h-4" />,
			}}
		/>
	);
}

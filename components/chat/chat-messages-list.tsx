'use client';

import React, { useRef, useEffect } from 'react';
import { ExtendedChatMessage } from './types';
import { ChatMessage } from './chat-message';
import { format } from 'date-fns';
import { Bot, Loader2 } from 'lucide-react';

interface ChatMessagesListProps {
	messages: ExtendedChatMessage[];
	messagesEndRef: React.RefObject<HTMLDivElement>;
	onCopy: (messageId: string, content: string) => void;
	copiedMessageId: string | null;
	isEmpty: boolean;
	searchQuery?: string;
	renderSuggestions: () => React.ReactNode;
	isLoading?: boolean;
}

export function ChatMessagesList({
	messages,
	messagesEndRef,
	onCopy,
	copiedMessageId,
	isEmpty,
	searchQuery = '',
	renderSuggestions,
	isLoading = false,
}: ChatMessagesListProps) {
	const listRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
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
		try {
			const msgDate = message.createdAt || new Date();
			const date = format(
				typeof msgDate === 'string' ? new Date(msgDate) : msgDate,
				'yyyy-MM-dd',
			);
			if (!groupedByDate[date]) {
				groupedByDate[date] = [];
			}
			groupedByDate[date].push(message);
		} catch (err) {
			console.error('Date parsing error:', err, message);
			// Add to a default group for messages with invalid dates
			const defaultDate = format(new Date(), 'yyyy-MM-dd');
			if (!groupedByDate[defaultDate]) {
				groupedByDate[defaultDate] = [];
			}
			groupedByDate[defaultDate].push(message);
		}
	});

	// Highlight search terms in message content
	const highlightSearchTerm = searchQuery
		? (content: string) => {
				if (!searchQuery) return content;

				const parts = content.split(new RegExp(`(${searchQuery})`, 'gi'));

				return (
					<>
						{parts.map((part, i) =>
							part.toLowerCase() === searchQuery.toLowerCase() ? (
								<mark key={i} className="bg-[#63d392]/30">
									{part}
								</mark>
							) : (
								part
							),
						)}
					</>
				);
			}
		: undefined;

	return (
		<div
			ref={listRef}
			className="h-[50vh] overflow-y-auto p-2 pb-12 relative"
			style={{ scrollBehavior: 'smooth' }}
		>
			{/* Render messages grouped by date */}
			{Object.entries(groupedByDate).map(([date, dateMessages]) => (
				<div key={date} className="mb-4">
					{/* Date header */}
					<div className="sticky top-0 z-10 flex justify-center py-2 px-4 mb-2">
						<div className="bg-[#0d5559]/80 text-gray-300 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
							{format(new Date(date), 'MMMM d, yyyy')}
						</div>
					</div>

					{/* Messages for this date */}
					{dateMessages.map((message) => (
						<ChatMessage
							key={message.id}
							message={message}
							onCopy={onCopy}
							isCopied={message.id === copiedMessageId}
							highlightContent={highlightSearchTerm}
						/>
					))}
				</div>
			))}

			{/* Invisible element for scrolling to the end */}
			<div ref={messagesEndRef} />

			{/* Loading indicator - show when waiting for AI response */}
			{isLoading && (
				<div className="sticky bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0d5559] px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-[#63d392]/20 w-fit mx-auto">
					<Loader2 className="h-4 w-4 text-[#63d392] animate-spin" />
					<span className="text-sm text-white">AI is thinking...</span>
				</div>
			)}
		</div>
	);
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { Meeting } from '@/types/meeting';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { ExtendedChatMessage } from './types';
import { ChatHeader } from './chat-header';
import { ChatSuggestions } from './chat-suggestions';
import { ChatInput } from './chat-input';
import { Button } from '@/components/ui/button';
import { ArrowDown, Search } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { ChatMessagesList } from './chat-messages-list';

interface AIMeetingAssistantProps {
	meeting: Meeting;
}

export function AIMeetingAssistant({ meeting }: AIMeetingAssistantProps) {
	// State
	const [expanded, setExpanded] = useState(true);
	const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
	const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
	const [exportFormat] = useState<'markdown' | 'text'>('markdown');
	const [scrolledToBottom, setScrolledToBottom] = useState(true);
	const [searchVisible, setSearchVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [hasNewMessages, setHasNewMessages] = useState(false);

	// Refs
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const lastMessageCountRef = useRef(0);

	// Debounced search query for performance
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		setMessages,
		setInput,
	} = useChat({
		api: '/api/ai/meeting-assistant',
		body: {
			meetingId: meeting.id,
		},
		initialMessages: [],
	});

	// Reset the chat
	const resetChat = () => {
		setMessages([]);
		setResetConfirmOpen(false);
	};

	// Copy message to clipboard
	const copyMessageToClipboard = useCallback(
		(messageId: string, content: string) => {
			navigator.clipboard.writeText(content);
			setCopiedMessageId(messageId);
			setTimeout(() => setCopiedMessageId(null), 2000);
		},
		[],
	);

	// Export chat conversation
	const exportChat = useCallback(() => {
		if (messages.length === 0) return;

		let content;
		const filename = `NoteMeet-Chat-${meeting.title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${exportFormat === 'markdown' ? 'md' : 'txt'}`;

		if (exportFormat === 'markdown') {
			content = messages
				.map((m) => {
					const role = m.role === 'user' ? '**You**' : '**NoteMeet AI**';
					return `### ${role}\n\n${m.content}\n\n`;
				})
				.join('---\n\n');

			content = `# Meeting Chat: ${meeting.title}\n\nDate: ${meeting.date}\n\n---\n\n${content}`;
		} else {
			content = messages
				.map((m) => {
					const role = m.role === 'user' ? 'You' : 'NoteMeet AI';
					return `${role}:\n${m.content}\n`;
				})
				.join('\n---------\n\n');

			content = `Meeting Chat: ${meeting.title}\nDate: ${meeting.date}\n\n---------\n\n${content}`;
		}

		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}, [messages, meeting, exportFormat]);

	// Handle scroll detection
	const handleScroll = useCallback(() => {
		if (!messagesContainerRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } =
			messagesContainerRef.current;
		const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;

		setScrolledToBottom(atBottom);

		if (atBottom) {
			setHasNewMessages(false);
		}
	}, []);

	// Scroll to bottom
	const scrollToBottom = useCallback(() => {
		if (messagesEndRef?.current) {
			messagesEndRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			});
			setHasNewMessages(false);
		}
	}, []);

	// Toggle search
	const toggleSearch = useCallback(() => {
		setSearchVisible((prev) => !prev);
		if (!searchVisible) {
			setTimeout(() => searchInputRef.current?.focus(), 100);
		} else {
			setSearchQuery('');
		}
	}, [searchVisible]);

	// First create extendedMessages (keep your existing processing code)

	// @ts-expect-error - TS doesn't know about the 'system' role
	const extendedMessages: ExtendedChatMessage[] = messages
		.filter((msg) => ['system', 'user', 'assistant'].includes(msg.role))
		.map((msg) => {
			const timestamp = msg.createdAt || new Date();
			const parts =
				msg.parts?.map((part) => ({
					...part,
					content:
						part.type === 'text'
							? part.text
							: part.type === 'reasoning'
								? part.reasoning
								: part.type === 'tool-invocation'
									? JSON.stringify(part.toolInvocation)
									: '',
				})) || [];

			return {
				id:
					msg.id ||
					`msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				role: msg.role as 'system' | 'user' | 'assistant',
				content: msg.content,
				createdAt: timestamp instanceof Date ? timestamp : new Date(timestamp),
				parts: parts,
			};
		});

	// THEN filter the properly-typed messages
	const filteredMessages = extendedMessages.filter(
		(msg) =>
			!debouncedSearchQuery ||
			msg.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
	);

	// Detect new messages and scroll if at bottom
	useEffect(() => {
		const hasNew = messages.length > lastMessageCountRef.current;
		lastMessageCountRef.current = messages.length;

		if (hasNew) {
			if (scrolledToBottom) {
				// Auto-scroll if already at bottom
				setTimeout(scrollToBottom, 100);
			} else {
				setHasNewMessages(true);
			}
		}
	}, [messages, scrolledToBottom, scrollToBottom]);

	// Focus input field when chat is expanded
	useEffect(() => {
		if (expanded && inputRef.current) {
			inputRef.current.focus();
		}
	}, [expanded]);

	return (
		<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden shadow-md h-full flex flex-col">
			<ChatHeader
				expanded={expanded}
				setExpanded={setExpanded}
				hasMessages={messages.length > 0}
				onReset={() => setResetConfirmOpen(true)}
				onExport={exportChat}
				onSearch={toggleSearch}
			/>

			{expanded && (
				<>
					{searchVisible && (
						<div className="px-4 py-2 flex items-center gap-2 bg-[#0d5559]/80 border-b border-[#63d392]/20">
							<Search className="h-4 w-4 text-[#63d392]/80" />
							<input
								ref={searchInputRef}
								type="text"
								placeholder="Search messages..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm focus:ring-0"
							/>
							<Button
								variant="ghost"
								size="sm"
								className="text-gray-400 hover:text-white hover:bg-[#156469]/50 h-6 w-6 p-0"
								onClick={() => setSearchQuery('')}
								disabled={!searchQuery}
							>
								&times;
							</Button>
						</div>
					)}

					<div
						ref={messagesContainerRef}
						className="flex-1 overflow-hidden relative h-full" // Added h-full and changed overflow-auto to overflow-hidden
						onScroll={handleScroll}
					>
						{
							<ChatMessagesList
								messages={
									debouncedSearchQuery ? filteredMessages : extendedMessages
								}
								messagesEndRef={
									messagesEndRef as React.RefObject<HTMLDivElement>
								}
								onCopy={copyMessageToClipboard}
								copiedMessageId={copiedMessageId}
								isEmpty={messages.length === 0}
								searchQuery={debouncedSearchQuery}
								isLoading={isLoading}
								renderSuggestions={() => (
									<ChatSuggestions
										onSelect={(text) => {
											setInput(text);
											inputRef.current?.focus();
										}}
									/>
								)}
							/>
						}

						{hasNewMessages && !scrolledToBottom && (
							<div className="absolute bottom-4 right-4">
								<Button
									onClick={scrollToBottom}
									size="sm"
									className="rounded-full bg-[#63d392] text-[#0a4a4e] hover:bg-[#63d392]/80 shadow-md flex items-center gap-1"
								>
									<ArrowDown className="h-4 w-4" />
									<span>New messages</span>
								</Button>
							</div>
						)}
					</div>

					<ChatInput
						input={input}
						isLoading={isLoading}
						onChange={handleInputChange}
						onSubmit={handleSubmit}
						inputRef={inputRef as React.RefObject<HTMLInputElement>}
					/>
				</>
			)}

			<AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
				<AlertDialogContent className="bg-[#0a4a4e] border-[#63d392]/20 text-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Reset conversation?</AlertDialogTitle>
						<AlertDialogDescription className="text-gray-300">
							This will clear all messages in the current conversation. This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="bg-[#156469]/50 border-[#63d392]/30 text-white hover:bg-[#156469]/70 hover:text-white">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={resetChat}
							className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#63d392]/80"
						>
							Reset
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

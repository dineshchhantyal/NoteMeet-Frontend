'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { MeetingInterface } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import {
	FileText,
	CheckCircle,
	User,
	Calendar,
	BarChart2,
	RefreshCcw,
	Loader2,
	Send,
	ClipboardCopy,
	CheckCheck,
	ChevronUp,
	ChevronDown,
	Bot,
	UserCircle,
	Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatSuggestion {
	text: string;
	icon?: JSX.Element;
}

interface AIMeetingAssistantProps {
	meeting: MeetingInterface;
}

export function AIMeetingAssistant({ meeting }: AIMeetingAssistantProps) {
	const [expanded, setExpanded] = useState(true);
	const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
	const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
	const [exportFormat] = useState<'markdown' | 'text'>('markdown');

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

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

	// Chat suggestions based on meeting content
	const chatSuggestions: ChatSuggestion[] = [
		{
			text: 'Summarize this meeting',
			icon: <FileText className="h-3.5 w-3.5 mr-2" />,
		},
		{
			text: 'What action items were assigned?',
			icon: <CheckCircle className="h-3.5 w-3.5 mr-2" />,
		},
		{
			text: 'Who participated the most?',
			icon: <User className="h-3.5 w-3.5 mr-2" />,
		},
		{
			text: 'What were the key decisions?',
			icon: <BarChart2 className="h-3.5 w-3.5 mr-2" />,
		},
		{
			text: 'When is the next follow-up?',
			icon: <Calendar className="h-3.5 w-3.5 mr-2" />,
		},
	];

	// Reset the chat
	const resetChat = () => {
		setMessages([]);
		setResetConfirmOpen(false);
	};

	// Copy message to clipboard
	const copyMessageToClipboard = (messageId: string, content: string) => {
		navigator.clipboard.writeText(content);
		setCopiedMessageId(messageId);
		setTimeout(() => setCopiedMessageId(null), 2000);
	};

	// Export chat conversation
	const exportChat = () => {
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
	};

	// Auto-scroll to bottom on new messages
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	// Focus input field when chat is expanded
	useEffect(() => {
		if (expanded && inputRef.current) {
			inputRef.current.focus();
		}
	}, [expanded]);

	return (
		<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden shadow-md h-full flex flex-col">
			<div
				className="flex items-center justify-between bg-[#0d5559]/80 px-4 py-3 border-b border-[#63d392]/20 cursor-pointer"
				onClick={() => setExpanded(!expanded)}
			>
				<div className="flex items-center">
					<div className="bg-[#63d392]/20 p-1.5 rounded-md mr-3">
						<Bot className="h-5 w-5 text-[#63d392]" />
					</div>
					<h3 className="font-medium text-white">AI Meeting Assistant</h3>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							if (messages.length > 0) {
								setResetConfirmOpen(true);
							}
						}}
						disabled={messages.length === 0}
						className="text-white hover:bg-[#156469]/50 p-0 h-8 w-8"
					>
						<RefreshCcw className="h-4 w-4" />
					</Button>

					<Button
						variant="ghost"
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							if (messages.length > 0) exportChat();
						}}
						disabled={messages.length === 0}
						className="text-white hover:bg-[#156469]/50 p-0 h-8 w-8"
					>
						<Download className="h-4 w-4" />
					</Button>

					<Button
						variant="ghost"
						size="sm"
						className="text-white hover:bg-[#156469]/50 p-0 h-8 w-8"
					>
						{expanded ? (
							<ChevronUp className="h-5 w-5" />
						) : (
							<ChevronDown className="h-5 w-5" />
						)}
					</Button>
				</div>
			</div>

			{expanded && (
				<>
					<ScrollArea className="flex-1 p-4 h-[350px]">
						<div className="space-y-6">
							{messages.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-full py-8 text-center">
									<div className="bg-[#0d5559]/70 p-4 rounded-full mb-4">
										<Bot className="h-8 w-8 text-[#63d392]/80" />
									</div>
									<h3 className="font-medium text-white mb-1">
										AI Meeting Assistant
									</h3>
									<p className="text-sm text-gray-300 mb-6 max-w-xs">
										Ask questions about the meeting, get summaries, or extract
										action items
									</p>

									<div className="grid grid-cols-1 gap-2 w-full max-w-md">
										{chatSuggestions.map((suggestion, index) => (
											<Button
												key={index}
												variant="outline"
												size="sm"
												onClick={() => {
													setInput(suggestion.text);
													if (inputRef.current) inputRef.current.focus();
												}}
												className="flex items-center justify-start text-left h-auto py-2 bg-[#0d5559]/60 border-[#63d392]/30 hover:bg-[#156469]/60 text-gray-100"
											>
												{suggestion.icon}
												<span className="truncate">{suggestion.text}</span>
											</Button>
										))}
									</div>
								</div>
							) : (
								messages.map((message) => (
									<motion.div
										key={message.id}
										className={cn(
											'flex',
											message.role === 'user' ? 'justify-end' : 'justify-start',
										)}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3 }}
									>
										<div
											className={cn(
												'flex max-w-[80%] group relative',
												message.role === 'user'
													? 'flex-row-reverse'
													: 'flex-row',
											)}
										>
											<div
												className={cn(
													'flex-shrink-0 mt-1',
													message.role === 'user' ? 'ml-3' : 'mr-3',
												)}
											>
												<Avatar
													className={cn(
														'h-8 w-8',
														message.role === 'user'
															? 'bg-[#63d392]/20'
															: 'bg-[#0d5559]/70',
													)}
												>
													{message.role === 'user' ? (
														<UserCircle className="h-5 w-5 text-[#63d392]" />
													) : (
														<Bot className="h-5 w-5 text-[#63d392]" />
													)}
												</Avatar>
											</div>

											<div
												className={cn(
													'p-3 rounded-lg',
													message.role === 'user'
														? 'bg-[#63d392]/20 text-white'
														: 'bg-[#0d5559]/70 text-gray-100',
												)}
											>
												<div className="text-sm prose prose-invert">
													<ReactMarkdown
														remarkPlugins={[remarkGfm]}
														components={{
															a: ({ ...props }) => (
																<a
																	{...props}
																	className="text-[#63d392] hover:underline"
																	target="_blank"
																	rel="noopener noreferrer"
																/>
															),
															code: ({ ...props }) => (
																<code
																	{...props}
																	className="px-1 py-0.5 bg-[#0a4a4e]/70 rounded text-gray-200"
																/>
															),
															pre: ({ ...props }) => (
																<pre
																	{...props}
																	className="p-2 bg-[#0a4a4e]/70 rounded overflow-auto text-gray-200 my-2"
																/>
															),
															ul: ({ ...props }) => (
																<ul
																	{...props}
																	className="list-disc pl-4 my-2"
																/>
															),
															ol: ({ ...props }) => (
																<ol
																	{...props}
																	className="list-decimal pl-4 my-2"
																/>
															),
														}}
													>
														{message.content}
													</ReactMarkdown>
												</div>

												<div
													className={cn(
														'mt-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity',
														'text-xs text-gray-400',
													)}
												>
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															copyMessageToClipboard(
																message.id,
																message.content,
															)
														}
														className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-[#156469]/40"
													>
														{copiedMessageId === message.id ? (
															<CheckCheck className="h-3.5 w-3.5" />
														) : (
															<ClipboardCopy className="h-3.5 w-3.5" />
														)}
													</Button>
												</div>
											</div>
										</div>
									</motion.div>
								))
							)}
							<div ref={messagesEndRef} />
						</div>
					</ScrollArea>

					<div className="border-t border-[#63d392]/20 p-4">
						<form
							onSubmit={handleSubmit}
							className="flex items-center space-x-2"
						>
							<Input
								ref={inputRef}
								value={input}
								onChange={handleInputChange}
								placeholder="Ask something about the meeting..."
								className="flex-1 bg-[#0d5559]/60 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
								disabled={isLoading}
							/>
							<Button
								type="submit"
								size="icon"
								disabled={isLoading || !input.trim()}
								className={cn(
									'bg-[#63d392] text-[#0a4a4e] hover:bg-[#63d392]/80',
									'transition-all duration-200',
									isLoading && 'opacity-70',
								)}
							>
								{isLoading ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<Send className="h-5 w-5" />
								)}
							</Button>
						</form>
					</div>
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

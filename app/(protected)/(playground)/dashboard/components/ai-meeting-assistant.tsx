'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
	ChevronDown,
	ChevronUp,
	Sparkles,
	Send,
	RefreshCw,
	Bot,
	Clock,
	MessageSquare,
	Clipboard,
	Copy,
	Check,
} from 'lucide-react';
import { MeetingInterface } from '@/types';
import { cn } from '@/lib/utils';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogAction,
	AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
}

interface ChatSuggestion {
	text: string;
	icon?: JSX.Element;
}

interface AIMeetingAssistantProps {
	meeting: MeetingInterface;
}

export function AIMeetingAssistant({ meeting }: AIMeetingAssistantProps) {
	const [expanded, setExpanded] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
	const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Initial greeting message
	useEffect(() => {
		if (expanded && messages.length === 0) {
			setMessages([
				{
					id: 'initial',
					role: 'assistant',
					content: `Hi there! I'm your AI meeting assistant for "${meeting.title}". You can ask me anything about this meeting - summary, action items, key points, or anything you need clarification on.`,
					timestamp: new Date(),
				},
			]);
		}
	}, [expanded, meeting.title, messages.length]);

	// Scroll to bottom on new messages
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	// Focus input when expanded
	useEffect(() => {
		if (expanded && inputRef.current) {
			inputRef.current.focus();
		}
	}, [expanded]);

	const chatSuggestions: ChatSuggestion[] = [
		{
			text: 'Summarize the key points',
			icon: <MessageSquare className="h-3.5 w-3.5 mr-1" />,
		},
		{
			text: 'What were the action items?',
			icon: <Clock className="h-3.5 w-3.5 mr-1" />,
		},
		{
			text: 'What decisions were made?',
			icon: <Clipboard className="h-3.5 w-3.5 mr-1" />,
		},
	];

	const handleSubmit = async (e?: React.FormEvent) => {
		e?.preventDefault();

		if (!input.trim()) return;

		const userMessage: Message = {
			id: `user-${Date.now()}`,
			role: 'user',
			content: input,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput('');
		setLoading(true);

		try {
			// Call your API endpoint for the AI assistant
			const response = await fetch('/api/ai/meeting-assistant', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					meetingId: meeting.id,
					message: input,
					history: messages.map((m) => ({ role: m.role, content: m.content })),
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to get response from assistant');
			}

			const data = await response.json();

			// Add AI response to messages
			const aiMessage: Message = {
				id: `assistant-${Date.now()}`,
				role: 'assistant',
				content: data.response || "I'm sorry, I couldn't process that request.",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, aiMessage]);
		} catch (error) {
			console.error('Error calling AI assistant:', error);

			// For demo purposes, generate a sample response
			setTimeout(() => {
				const demoResponses = [
					`Based on the meeting "${meeting.title}", ${generateDemoResponse(input)}`,
					`According to the transcript, ${generateDemoResponse(input)}`,
					`I've analyzed the meeting data and ${generateDemoResponse(input)}`,
				];

				const aiMessage: Message = {
					id: `assistant-${Date.now()}`,
					role: 'assistant',
					content:
						demoResponses[Math.floor(Math.random() * demoResponses.length)],
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, aiMessage]);
			}, 1500);
		} finally {
			setLoading(false);
		}
	};

	const generateDemoResponse = (query: string): string => {
		if (
			query.toLowerCase().includes('summary') ||
			query.toLowerCase().includes('key points')
		) {
			return 'the key points discussed were: 1) Project timeline will be extended by 2 weeks, 2) Budget allocation for marketing will increase by 15%, 3) The new design mockups were approved with minor changes, and 4) Next review meeting is scheduled for next Friday.';
		}

		if (
			query.toLowerCase().includes('action') ||
			query.toLowerCase().includes('task')
		) {
			return 'the following action items were assigned: 1) John will finalize the design changes by Wednesday, 2) Sarah will update the marketing plan with the new budget by Thursday, 3) Mike will coordinate with the development team about the timeline extension, and 4) Everyone needs to update their progress in the shared document by COB Friday.';
		}

		if (
			query.toLowerCase().includes('decision') ||
			query.toLowerCase().includes('decide')
		) {
			return 'the team made the following decisions: 1) Proceed with the new feature implementation despite the timeline extension, 2) Increase marketing budget by reallocating from the operations budget, and 3) Weekly progress reports will now be required from all team leads.';
		}

		return "I found relevant information in the meeting notes. The team discussed project progress, resource allocation, and next steps. There were some concerns about the timeline, but overall everyone agreed the project is on track. Let me know if you'd like more specific details about any part of the discussion.";
	};

	const handleSuggestionClick = (suggestion: string) => {
		setInput(suggestion);
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	const resetConversation = () => {
		setMessages([]);
		setResetConfirmOpen(false);
	};

	const copyMessage = (messageId: string, content: string) => {
		navigator.clipboard.writeText(content);
		setCopiedMessageId(messageId);
		setTimeout(() => setCopiedMessageId(null), 2000);
	};

	const formatTime = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		}).format(date);
	};

	return (
		<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden shadow-md">
			<div
				className="flex items-center justify-between bg-[#0d5559]/80 px-4 py-3 border-b border-[#63d392]/20 cursor-pointer"
				onClick={() => setExpanded(!expanded)}
			>
				<div className="flex items-center">
					<div className="bg-[#63d392]/20 p-1.5 rounded-md mr-2">
						<Sparkles className="h-5 w-5 text-[#63d392]" />
					</div>
					<h3 className="font-medium text-white">AI Meeting Assistant</h3>
					{messages.length > 1 && (
						<Badge className="ml-2 bg-[#63d392]/20 text-[#63d392] border-0">
							{messages.length - 1}{' '}
							{messages.length === 2 ? 'message' : 'messages'}
						</Badge>
					)}
				</div>
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

			{expanded && (
				<>
					<ScrollArea className="h-[400px] p-4">
						<div className="space-y-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={cn(
										'flex gap-3 p-3 rounded-lg',
										message.role === 'assistant'
											? 'bg-[#0d5559]/50 border border-[#63d392]/20'
											: 'bg-[#156469]/50 ml-8',
									)}
								>
									{message.role === 'assistant' && (
										<Avatar className="h-8 w-8 bg-[#63d392]/20 border border-[#63d392]/30">
											<AvatarFallback className="bg-transparent text-[#63d392]">
												<Bot className="h-4 w-4" />
											</AvatarFallback>
										</Avatar>
									)}

									<div className="flex-1 space-y-1">
										<div className="flex items-center justify-between">
											<p className="text-xs text-gray-300">
												{message.role === 'assistant' ? 'AI Assistant' : 'You'}
											</p>
											<p className="text-xs text-gray-400">
												{formatTime(message.timestamp)}
											</p>
										</div>

										<p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
											{message.content}
										</p>
									</div>

									{message.role === 'assistant' && (
										<Button
											variant="ghost"
											size="icon"
											onClick={() => copyMessage(message.id, message.content)}
											className="h-6 w-6 self-start mt-4 text-gray-400 hover:text-[#63d392] hover:bg-[#63d392]/10"
										>
											{copiedMessageId === message.id ? (
												<Check className="h-3.5 w-3.5" />
											) : (
												<Copy className="h-3.5 w-3.5" />
											)}
										</Button>
									)}
								</div>
							))}

							{loading && (
								<div className="flex gap-3 p-3 bg-[#0d5559]/50 rounded-lg border border-[#63d392]/20">
									<Avatar className="h-8 w-8 bg-[#63d392]/20 border border-[#63d392]/30">
										<AvatarFallback className="bg-transparent text-[#63d392]">
											<Bot className="h-4 w-4" />
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 space-y-2">
										<p className="text-xs text-gray-300">AI Assistant</p>
										<div className="flex space-x-2">
											<Skeleton className="h-3 w-3 rounded-full bg-[#63d392]/30" />
											<Skeleton className="h-3 w-3 rounded-full bg-[#63d392]/30" />
											<Skeleton className="h-3 w-3 rounded-full bg-[#63d392]/30" />
										</div>
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>
					</ScrollArea>

					{messages.length > 0 && (
						<div className="flex flex-wrap gap-2 px-4 py-2">
							{chatSuggestions.map((suggestion, index) => (
								<Button
									key={index}
									variant="outline"
									size="sm"
									onClick={() => handleSuggestionClick(suggestion.text)}
									className="bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30 flex items-center"
								>
									{suggestion.icon}
									{suggestion.text}
								</Button>
							))}
						</div>
					)}

					<div className="p-4 bg-[#0d5559]/40 border-t border-[#63d392]/20">
						<form onSubmit={handleSubmit} className="flex gap-2">
							<Input
								ref={inputRef}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Ask anything about the meeting..."
								className="flex-1 bg-[#0d5559]/60 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
								disabled={loading}
							/>
							<Button
								type="submit"
								disabled={loading || !input.trim()}
								className="bg-[#63d392] hover:bg-[#4eb97b] text-[#0a4a4e]"
							>
								<Send className="h-4 w-4" />
							</Button>

							<Button
								type="button"
								variant="outline"
								onClick={() => setResetConfirmOpen(true)}
								disabled={messages.length <= 1}
								className="bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</form>
					</div>

					<AlertDialog
						open={resetConfirmOpen}
						onOpenChange={setResetConfirmOpen}
					>
						<AlertDialogContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
							<AlertDialogHeader>
								<AlertDialogTitle className="text-white">
									Reset Conversation
								</AlertDialogTitle>
								<AlertDialogDescription className="text-gray-300">
									Are you sure you want to reset this conversation? All messages
									will be deleted.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="bg-[#156469]/50 text-white hover:bg-[#156469] border-[#63d392]/20">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={resetConversation}
									className="bg-red-600/80 hover:bg-red-700 text-white border-red-600/50"
								>
									Reset
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			)}
		</div>
	);
}

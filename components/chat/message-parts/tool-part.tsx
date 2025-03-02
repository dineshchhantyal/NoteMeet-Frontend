// components/chat/Message.tsx
import React from 'react';

import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Bot, UserCircle } from 'lucide-react';
import { MessageContent } from '../message-content';
import { ExtendedChatMessage } from '../types';
import { MessageHeader } from '../message-header';

interface MessageProps {
	message: ExtendedChatMessage;
	isLatest?: boolean;
}

export function Message({ message, isLatest = false }: MessageProps) {
	const isUser = message.role === 'user';

	return (
		<div
			className={cn(
				'group flex w-full items-start gap-4 py-4',
				isLatest && 'animate-in fade-in',
				isUser ? 'justify-end' : 'justify-start',
			)}
			id={`message-${message.id}`}
		>
			{!isUser && (
				<div className="flex-shrink-0">
					<Avatar className="h-8 w-8 bg-[#0d5559]/70">
						<Bot className="h-5 w-5 text-[#63d392]" />
					</Avatar>
				</div>
			)}

			<div
				className={cn(
					'flex max-w-[80%] flex-col space-y-2',
					isUser ? 'items-end' : 'items-start',
				)}
			>
				<MessageHeader message={message} />

				<div
					className={cn(
						'rounded-lg px-4 py-3',
						isUser
							? 'bg-[#63d392]/20 text-white'
							: 'bg-[#0d5559]/70 text-gray-100',
					)}
				>
					<MessageContent message={message} />
				</div>
			</div>

			{isUser && (
				<div className="flex-shrink-0">
					<Avatar className="h-8 w-8 bg-[#63d392]/20">
						<UserCircle className="h-5 w-5 text-[#63d392]" />
					</Avatar>
				</div>
			)}
		</div>
	);
}

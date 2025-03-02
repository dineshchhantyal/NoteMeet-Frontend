// components/chat/MessageHeader.tsx
import React from 'react';
import { ExtendedChatMessage } from './types';
import { formatDistance } from 'date-fns';
import { MessageActions } from './message-actions';

interface MessageHeaderProps {
	message: ExtendedChatMessage;
	onCopy?: (messageId: string, content: string) => void;
	isCopied?: boolean;
}

export function MessageHeader({
	message,
	onCopy = () => {}, // Default no-op function
	isCopied = false,
}: MessageHeaderProps) {
	const isUser = message.role === 'user';
	const timestamp = message.createdAt || new Date();
	const formattedTime = formatDistance(timestamp, new Date(), {
		addSuffix: true,
	});

	return (
		<div className="flex items-center justify-between w-full">
			<div className="text-xs text-gray-400">
				{isUser ? 'You' : 'NoteMeet Assistant'} • {formattedTime}
			</div>
			<MessageActions message={message} onCopy={onCopy} isCopied={isCopied} />
		</div>
	);
}

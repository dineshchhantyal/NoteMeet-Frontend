// components/chat/MessageContent.tsx
import React, { memo } from 'react';
import { ExtendedChatMessage } from './types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { TextPart } from './message-parts/text-part';
import { ToolInvocationPart } from './message-parts/tool-invocation-part';
import { ToolResultPart } from './message-parts/tool-result-part';
import { ReasoningPart } from './message-parts/reasoning-part';
import { SourcePart } from './message-parts/source-part';

interface MessageContentProps {
	message: ExtendedChatMessage;
	highlightContent?: (content: string) => React.ReactNode;
}

export const MessageContent = memo(function MessageContent({
	message,
	highlightContent,
}: MessageContentProps) {
	// Standard message with no parts
	if (
		!message.parts ||
		!Array.isArray(message.parts) ||
		message.parts.length === 0
	) {
		return (
			<div className="prose dark:prose-invert prose-sm max-w-none">
				{highlightContent ? (
					<div className="whitespace-pre-wrap">
						{highlightContent(message.content)}
					</div>
				) : (
					<Markdown
						remarkPlugins={[remarkGfm, remarkMath]}
						rehypePlugins={[rehypeKatex]}
						components={{
							a: (props) => (
								<a
									{...props}
									className="text-[#63d392] hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								/>
							),
							// Type the code component props correctly
							img: ({
								className,
								...props
							}: React.ImgHTMLAttributes<HTMLImageElement>) => (
								<img
									{...props}
									className={`max-w-full h-auto rounded-lg ${className || ''}`}
								/>
							),
							code: ({ className, children, ...props }) => {
								return (
									<code
										className={`block px-1 py-0.5 bg-[#0a4a4e]/70 rounded text-gray-200 ${className || ''}`}
										{...props}
									>
										{children}
									</code>
								);
							},
							pre: ({ children, ...props }) => (
								<pre
									className="p-2 bg-[#0a4a4e]/70 rounded overflow-auto text-gray-200 my-2"
									{...props}
								>
									{children}
								</pre>
							),
						}}
					>
						{message.content}
					</Markdown>
				)}
			</div>
		);
	}

	// Structured message with parts
	return (
		<div className="prose dark:prose-invert prose-sm max-w-none space-y-4">
			{message.parts.map((part, idx) => {
				// Use type guards instead of casting
				if (part.type === 'text') {
					return <TextPart key={`text-${idx}`} part={part} />;
				}

				if (part.type === 'tool-invocation') {
					return <ToolInvocationPart key={`tool-${idx}`} part={part} />;
				}

				if (part.type === 'tool-result') {
					return <ToolResultPart key={`tool-result-${idx}`} part={part} />;
				}

				if (part.type === 'reasoning') {
					return <ReasoningPart key={`reasoning-${idx}`} part={part} />;
				}

				if (part.type === 'source') {
					return <SourcePart key={`source-${idx}`} part={part} />;
				}

				// Handle unknown types
				console.warn(
					`Unknown message part type: ${(part as { type: string }).type}`,
				);
				return null;
			})}
		</div>
	);
});

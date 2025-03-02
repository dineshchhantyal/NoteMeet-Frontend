import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { TextPart as TextPartType } from '../types';

interface TextPartProps {
	part: TextPartType;
}

export function TextPart({ part }: TextPartProps) {
	return (
		<div className="message-part text-part">
			<Markdown
				remarkPlugins={[remarkGfm, remarkMath]}
				rehypePlugins={[rehypeKatex]}
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
						<ul {...props} className="list-disc pl-4 my-2" />
					),
					ol: ({ ...props }) => (
						<ol {...props} className="list-decimal pl-4 my-2" />
					),
				}}
			>
				{part.content}
			</Markdown>
		</div>
	);
}

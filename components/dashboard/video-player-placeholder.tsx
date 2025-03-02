import { ReactNode } from 'react';

interface VideoPlayerPlaceholderProps {
	children: ReactNode;
}

export function VideoPlayerPlaceholder({
	children,
}: VideoPlayerPlaceholderProps) {
	return (
		<div className="aspect-video w-full rounded-lg bg-[#0d5559]/50 flex items-center justify-center border border-[#63d392]/20 overflow-hidden">
			{children}
		</div>
	);
}

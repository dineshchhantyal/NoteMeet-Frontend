'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
	href: string;
	label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
	return (
		<Button
			variant="link"
			size="sm"
			asChild
			className="w-full text-[#63d392] hover:text-[#4fb87a] transition-colors no-underline flex items-center justify-center gap-2"
		>
			<Link href={href}>{label}</Link>
		</Button>
	);
};

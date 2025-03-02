'use client';

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Social } from '@/components/auth/social';
import { BackButton } from '@/components/auth/back-button';
import { cn } from '@/lib/utils';

interface CardWrapperProps {
	children: React.ReactNode;
	headerLabel: React.ReactNode;
	backButtonLabel: string;
	backButtonRef: string;
	showSocial?: boolean;
	className?: string;
}

export function CardWrapper({
	children,
	headerLabel,
	backButtonLabel,
	backButtonRef,
	showSocial,
	className,
}: CardWrapperProps) {
	return (
		<Card
			className={cn(
				'w-full sm:w-[400px] md:w-[450px] shadow-lg',
				'bg-[#0d5559]/95 backdrop-blur-sm border-[#63d392]/30 text-white',
				className,
			)}
		>
			<CardHeader className="space-y-2">{headerLabel}</CardHeader>
			<CardContent>{children}</CardContent>
			{showSocial && (
				<CardFooter className="flex flex-col gap-y-4">
					<div className="relative w-full">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-[#63d392]/20" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-[#0d5559] px-2 text-gray-400">
								Or continue with
							</span>
						</div>
					</div>
					<Social />
				</CardFooter>
			)}
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonRef} />
			</CardFooter>
		</Card>
	);
}

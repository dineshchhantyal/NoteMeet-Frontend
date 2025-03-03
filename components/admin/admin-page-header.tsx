import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface AdminPageHeaderProps {
	title: string;
	icon?: React.ReactNode;
	onRefresh?: () => void;
	actions?: React.ReactNode;
}

export function AdminPageHeader({
	title,
	icon,
	onRefresh,
	actions,
}: AdminPageHeaderProps) {
	return (
		<div className="flex items-center justify-between mb-8">
			<div className="flex items-center">
				{icon && <div className="mr-2">{icon}</div>}
				<h1 className="text-3xl font-bold text-white">{title}</h1>
			</div>

			<div className="flex items-center gap-3">
				{actions}

				{onRefresh && (
					<Button
						onClick={onRefresh}
						variant="outline"
						className="border-[#63d392] text-[#63d392] hover:bg-[#63d392]/20"
					>
						<RefreshCcw className="h-4 w-4 mr-2" />
						Refresh
					</Button>
				)}
			</div>
		</div>
	);
}

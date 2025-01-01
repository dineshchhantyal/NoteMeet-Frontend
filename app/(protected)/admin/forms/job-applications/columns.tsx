'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
	JobApplicationInterface,
	JobApplicationStatus,
} from '@/schemas/job-application';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export const columns: ColumnDef<JobApplicationInterface>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'position',
		header: 'Position',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status') as JobApplicationStatus;
			return (
				<Badge
					variant={
						status === JobApplicationStatus.APPROVED
							? 'default'
							: status === JobApplicationStatus.REJECTED
								? 'destructive'
								: 'outline'
					}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Applied On',
		cell: ({ row }) => {
			return format(new Date(row.getValue('createdAt')), 'PPP');
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const application = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link
								href={`/admin/forms/job-applications/${application.id}`}
								className="flex items-center"
							>
								<Eye className="mr-2 h-4 w-4" />
								View Details
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

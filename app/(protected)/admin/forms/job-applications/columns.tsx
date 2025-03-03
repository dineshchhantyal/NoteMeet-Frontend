'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
	JobApplicationInterface,
	JobApplicationStatus,
} from '@/schemas/job-application';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	ArrowUpDown,
	CheckCircle,
	MoreHorizontal,
	XCircle,
	Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const columns: ColumnDef<JobApplicationInterface>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="hover:bg-[#156469]/50 text-[#63d392]"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="font-medium text-white">{row.getValue('name')}</div>
		),
	},
	{
		accessorKey: 'position',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="hover:bg-[#156469]/50 text-[#63d392]"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Position
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status') as JobApplicationStatus;

			if (status === JobApplicationStatus.APPROVED) {
				return (
					<Badge className="bg-green-500/20 text-green-400 border-none flex items-center gap-1 px-2 py-1">
						<CheckCircle className="h-3 w-3" />
						Approved
					</Badge>
				);
			} else if (status === JobApplicationStatus.REJECTED) {
				return (
					<Badge className="bg-red-500/20 text-red-400 border-none flex items-center gap-1 px-2 py-1">
						<XCircle className="h-3 w-3" />
						Rejected
					</Badge>
				);
			} else {
				return (
					<Badge className="bg-yellow-500/20 text-yellow-400 border-none flex items-center gap-1 px-2 py-1">
						<Clock className="h-3 w-3" />
						Pending
					</Badge>
				);
			}
		},
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="hover:bg-[#156469]/50 text-[#63d392]"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Applied On
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			// Format the date
			const date = row.original.createdAt;
			return <div>{format(new Date(date), 'MMM dd, yyyy')}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const application = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0 text-white hover:bg-[#156469]/70"
						>
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="bg-[#0d5559] border-[#63d392]/30 text-white"
					>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator className="bg-[#63d392]/20" />
						<DropdownMenuItem
							className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
							onClick={() => navigator.clipboard.writeText(application.email)}
						>
							Copy email
						</DropdownMenuItem>
						<DropdownMenuItem
							className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
							onClick={() =>
								window.open(
									`/admin/forms/job-applications/${application.id}`,
									'_blank',
								)
							}
						>
							View details
						</DropdownMenuItem>
						{application.status === JobApplicationStatus.PENDING && (
							<>
								<DropdownMenuSeparator className="bg-[#63d392]/20" />
								<DropdownMenuItem className="hover:bg-green-500/20 focus:bg-green-500/20 cursor-pointer text-green-400">
									<CheckCircle className="h-4 w-4 mr-2" />
									Approve
								</DropdownMenuItem>
								<DropdownMenuItem className="hover:bg-red-500/20 focus:bg-red-500/20 cursor-pointer text-red-400">
									<XCircle className="h-4 w-4 mr-2" />
									Reject
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

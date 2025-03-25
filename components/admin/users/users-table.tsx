'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Check,
	Copy,
	Edit,
	MoreHorizontal,
	Shield,
	User,
	UserX,
} from 'lucide-react';
import { useState } from 'react';
import {
	UserRole,
	UserStatus,
	SortField,
	User as UserType,
} from '@/types/admin';
import { formatDate } from '@/lib/utils/date-time';

interface UsersTableProps {
	users: UserType[];
	sortBy: { field: SortField; direction: 'asc' | 'desc' };
	onSortChange: (sort: { field: SortField; direction: 'asc' | 'desc' }) => void;
	onViewUser: (user: UserType) => void;
}

export function UsersTable({
	users,
	sortBy,
	onSortChange,
	onViewUser,
}: UsersTableProps) {
	const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

	const toggleSort = (field: SortField) => {
		if (sortBy.field === field) {
			onSortChange({
				field,
				direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
			});
		} else {
			onSortChange({ field, direction: 'asc' });
		}
	};

	const copyEmail = async (email: string) => {
		await navigator.clipboard.writeText(email);
		setCopiedEmail(email);
		setTimeout(() => setCopiedEmail(null), 2000);
	};

	const getRoleIcon = (role: UserRole) => {
		switch (role) {
			case UserRole.ADMIN:
				return <Shield className="h-4 w-4 text-red-400" />;
			case UserRole.MODERATOR:
				return <Shield className="h-4 w-4 text-yellow-400" />;
			default:
				return <User className="h-4 w-4 text-gray-400" />;
		}
	};

	const getStatusBadge = (status: UserStatus) => {
		switch (status) {
			case UserStatus.ACTIVE:
				return <Badge className="bg-green-600">Active</Badge>;
			case UserStatus.PENDING:
				return <Badge className="bg-yellow-600">Pending</Badge>;
			case UserStatus.SUSPENDED:
				return <Badge className="bg-red-600">Suspended</Badge>;
			default:
				return <Badge className="bg-gray-600">Unknown</Badge>;
		}
	};

	return (
		<div className="rounded-md border border-[#63d392]/20 bg-[#0a4a4e]/50 overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="border-b border-[#63d392]/20 hover:bg-[#156469]/50">
						<TableHead className="w-[300px]">
							<button
								onClick={() => toggleSort('name')}
								className="flex items-center text-[#63d392] hover:text-[#63d392]/80"
							>
								User
								{sortBy.field === 'name' && (
									<span className="ml-1">
										{sortBy.direction === 'asc' ? '↑' : '↓'}
									</span>
								)}
							</button>
						</TableHead>
						<TableHead>
							<button
								onClick={() => toggleSort('role')}
								className="flex items-center text-[#63d392] hover:text-[#63d392]/80"
							>
								Role
								{sortBy.field === 'role' && (
									<span className="ml-1">
										{sortBy.direction === 'asc' ? '↑' : '↓'}
									</span>
								)}
							</button>
						</TableHead>
						<TableHead>
							<button
								onClick={() => toggleSort('status')}
								className="flex items-center text-[#63d392] hover:text-[#63d392]/80"
							>
								Status
								{sortBy.field === 'status' && (
									<span className="ml-1">
										{sortBy.direction === 'asc' ? '↑' : '↓'}
									</span>
								)}
							</button>
						</TableHead>
						<TableHead>
							<button
								onClick={() => toggleSort('lastActive')}
								className="flex items-center text-[#63d392] hover:text-[#63d392]/80"
							>
								Last Active
								{sortBy.field === 'lastActive' && (
									<span className="ml-1">
										{sortBy.direction === 'asc' ? '↑' : '↓'}
									</span>
								)}
							</button>
						</TableHead>
						<TableHead>
							<button
								onClick={() => toggleSort('createdAt')}
								className="flex items-center text-[#63d392] hover:text-[#63d392]/80"
							>
								Joined
								{sortBy.field === 'createdAt' && (
									<span className="ml-1">
										{sortBy.direction === 'asc' ? '↑' : '↓'}
									</span>
								)}
							</button>
						</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6} className="h-24 text-center text-gray-300">
								No users found
							</TableCell>
						</TableRow>
					) : (
						users.map((user) => (
							<TableRow
								key={user.id}
								className="border-b border-[#63d392]/20 hover:bg-[#156469]/30"
							>
								<TableCell className="font-medium">
									<div className="flex items-center gap-3">
										<Avatar className="h-8 w-8 border border-[#63d392]/20">
											<AvatarImage src={user.avatarUrl} alt={user.name} />
											<AvatarFallback className="bg-[#156469] text-white">
												{user.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-medium text-white">{user.name}</div>
											<div className="flex items-center text-sm text-gray-300">
												{user.email}
												<button
													onClick={() => copyEmail(user.email)}
													className="ml-1 p-1 rounded-sm hover:bg-[#156469]/50"
												>
													{copiedEmail === user.email ? (
														<Check className="h-3 w-3 text-green-500" />
													) : (
														<Copy className="h-3 w-3 text-gray-400" />
													)}
												</button>
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										{getRoleIcon(user.role)}
										<span className="text-white">{user.role}</span>
									</div>
								</TableCell>
								<TableCell>{getStatusBadge(user.status)}</TableCell>
								<TableCell className="text-gray-300">
									{user.lastActiveAt ? formatDate(user.lastActiveAt) : 'Never'}
								</TableCell>
								<TableCell className="text-gray-300">
									{formatDate(user.createdAt)}
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 text-gray-300 hover:bg-[#156469]/50 hover:text-white"
											>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="bg-[#0d5559] border-[#63d392]/20 text-white"
										>
											<DropdownMenuItem
												className="cursor-pointer hover:bg-[#156469]"
												onClick={() => onViewUser(user)}
											>
												<Edit className="mr-2 h-4 w-4" />
												Edit User
											</DropdownMenuItem>
											<DropdownMenuItem className="cursor-pointer hover:bg-[#156469] text-yellow-400">
												<Shield className="mr-2 h-4 w-4" />
												Change Role
											</DropdownMenuItem>
											{user.status === UserStatus.ACTIVE ? (
												<DropdownMenuItem className="cursor-pointer hover:bg-[#156469] text-red-400">
													<UserX className="mr-2 h-4 w-4" />
													Suspend User
												</DropdownMenuItem>
											) : (
												<DropdownMenuItem className="cursor-pointer hover:bg-[#156469] text-green-400">
													<Check className="mr-2 h-4 w-4" />
													Activate User
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

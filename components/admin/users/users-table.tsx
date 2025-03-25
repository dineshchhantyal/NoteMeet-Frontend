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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

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
	const [isRoleDialogOpen, setRoleDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const [newRole, setNewRole] = useState<UserRole | null>(null);
	const [isChangingRole, setIsChangingRole] = useState(false);

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

	const handleRoleChange = async () => {
		if (!selectedUser || !newRole) return;

		setIsChangingRole(true);

		try {
			const response = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ role: newRole }),
			});

			const data = await response.json();

			if (data.success) {
				toast.success(`Changed ${selectedUser.name}'s role to ${newRole}`);
				// Update user in the list
				// const updatedUsers = users.map((user) =>
				// 	user.id === selectedUser.id ? { ...user, role: newRole } : user,
				// );
				// This assumes you have a way to update the users array
				// If you're using state, you might have a setUsers function
				// Otherwise, you might need to trigger a refetch

				closeRoleDialog();
			} else {
				toast.error(data.error || 'Failed to change role');
			}
		} catch (error) {
			toast.error('An error occurred');
			console.error(error);
		} finally {
			setIsChangingRole(false);
		}
	};

	const openRoleDialog = (user: UserType) => {
		setSelectedUser(user);
		setNewRole(user.role);
		setRoleDialogOpen(true);
	};

	const closeRoleDialog = () => {
		setRoleDialogOpen(false);
		setSelectedUser(null);
		setNewRole(null);
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
											<DropdownMenuItem
												className="cursor-pointer hover:bg-[#156469] text-yellow-400"
												onClick={() => openRoleDialog(user)}
											>
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
			{isRoleDialogOpen && selectedUser && (
				<Dialog open={isRoleDialogOpen} onOpenChange={closeRoleDialog}>
					<DialogContent className="bg-[#0d5559] border-[#63d392]/20 text-white sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Change User Role</DialogTitle>
							<DialogDescription className="text-gray-300">
								Update role for {selectedUser.name}
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<div className="space-y-4">
								<div className="flex flex-col space-y-2">
									<label className="text-sm font-medium text-gray-300">
										Select New Role
									</label>
									<Select
										value={newRole || undefined}
										onValueChange={(value) => setNewRole(value as UserRole)}
										disabled={isChangingRole}
									>
										<SelectTrigger className="bg-[#156469]/50 border-[#63d392]/30 text-white">
											<SelectValue placeholder="Select a role" />
										</SelectTrigger>
										<SelectContent className="bg-[#156469] border-[#63d392]/30 text-white">
											<SelectItem
												value={UserRole.ADMIN}
												className="focus:bg-[#63d392]/20 focus:text-white"
											>
												Admin
											</SelectItem>
											<SelectItem
												value={UserRole.USER}
												className="focus:bg-[#63d392]/20 focus:text-white"
											>
												User
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={closeRoleDialog}
								className="border-[#63d392]/30 text-white hover:bg-[#156469]/50"
								disabled={isChangingRole}
							>
								Cancel
							</Button>
							<Button
								onClick={handleRoleChange}
								disabled={isChangingRole || newRole === selectedUser.role}
								className="bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e] font-medium"
							>
								{isChangingRole ? 'Updating...' : 'Update Role'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

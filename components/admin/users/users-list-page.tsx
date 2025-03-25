'use client';

import { useState, useEffect } from 'react';
import { UsersTable } from './users-table';
import { UsersFilter } from './users-filter';
import { UsersPagination } from './users-pagination';
import { Button } from '@/components/ui/button';
import { Loader2, Users } from 'lucide-react';
import { AdminPageHeader } from '../admin-page-header';
import { UserDetailsDrawer } from './user-details-drawer';
import { useUsersList } from '@/hooks/use-users-list';
import { toast } from 'sonner';
import { User } from '@/types/admin';

export default function AdminUsersListPage() {
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const {
		users,
		isLoading,
		error,
		total,
		page,
		pageSize,
		setPage,
		setPageSize,
		filter,
		setFilter,
		sortBy,
		setSortBy,
		refresh,
	} = useUsersList();

	useEffect(() => {
		if (error) {
			toast(error);
		}
	}, [error, toast]);

	const handleViewUser = (user: User) => {
		setSelectedUser(user);
		setIsDrawerOpen(true);
	};

	const handleExportUsers = async () => {
		try {
			const response = await fetch('/api/admin/users/export', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ filter }),
			});

			if (!response.ok) throw new Error('Failed to export users');

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
			a.click();
		} catch (error) {
			toast((error as Error).message);
		}
	};

	return (
		<div className="space-y-6 p-6">
			{/* Header section without using children */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-700">
				<AdminPageHeader
					title="User Management"
					icon={<Users className="h-6 w-6 text-[#63d392]" />}
					onRefresh={refresh}
					actions={
						<>
							<Button size="sm">Add User</Button>
							<Button size="sm" onClick={handleExportUsers}>
								Export
							</Button>
						</>
					}
				/>
			</div>

			<UsersFilter filter={filter} onFilterChange={setFilter} />

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<Loader2 className="h-8 w-8 animate-spin text-[#63d392]" />
				</div>
			) : (
				<>
					<UsersTable
						users={users}
						sortBy={sortBy}
						onSortChange={setSortBy}
						onViewUser={handleViewUser}
					/>

					<UsersPagination
						currentPage={page}
						pageSize={pageSize}
						total={total}
						onPageChange={setPage}
						onPageSizeChange={setPageSize}
					/>
				</>
			)}

			<UserDetailsDrawer
				user={selectedUser}
				open={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onUserUpdated={refresh}
			/>
		</div>
	);
}

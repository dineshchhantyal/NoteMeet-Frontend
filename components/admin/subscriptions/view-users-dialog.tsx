'use client';

import { useCallback, useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCcw } from 'lucide-react';
import { AddUserDialog } from './add-user-dialog';
import { SubscriptionPlan } from '@prisma/client';
import { format } from 'date-fns';

interface ViewUsersDialogProps {
	subscriptionPlan: Partial<SubscriptionPlan> | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface User {
	id: string;
	activeUser: {
		name: string;
		email: string;
	};
	status: string;
	createdAt: Date;
	planId: string;
}

export function ViewUsersDialog({
	subscriptionPlan,
	open,
	onOpenChange,
}: ViewUsersDialogProps) {
	const [isAddUserOpen, setIsAddUserOpen] = useState(false);
	const [users, setUsers] = useState<User[]>([]);

	const refreshUsers = useCallback(async () => {
		// Add API call here to refresh users list
		const updatedUsers = await fetch(
			`/api/admin/plans/users/${subscriptionPlan?.id}`,
		);
		const { users: usersData } = await updatedUsers.json();
		setUsers(usersData);
	}, [subscriptionPlan]); // Close the refreshUsers function

	useEffect(() => {
		refreshUsers();
	}, [subscriptionPlan, refreshUsers]); // Dependency array for useEffect

	if (!subscriptionPlan) return null;

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<div className="flex items-center justify-between">
							<DialogTitle>Users on {subscriptionPlan.name}</DialogTitle>
							<Button onClick={refreshUsers}>
								<RefreshCcw className="mr-2 h-4 w-4" />
								Refresh
							</Button>
							<Button onClick={() => setIsAddUserOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Add User
							</Button>
						</div>
					</DialogHeader>
					<div className="mt-4">
						{users && users.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Joined</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{users.map((user) => (
										<TableRow key={user.id}>
											<TableCell>{user.activeUser.name}</TableCell>
											<TableCell>{user.activeUser.email}</TableCell>
											<TableCell>{user.status}</TableCell>
											<TableCell>
												{format(user.createdAt, 'MM/dd/yyyy HH:mm')}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<p>No users found</p>
						)}
					</div>
				</DialogContent>
			</Dialog>

			<AddUserDialog
				subscriptionPlan={subscriptionPlan}
				open={isAddUserOpen}
				onOpenChange={setIsAddUserOpen}
				onSuccess={refreshUsers}
			/>
		</>
	);
}

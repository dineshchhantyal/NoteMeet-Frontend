'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
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
import { Plus } from 'lucide-react';
import { AddUserDialog } from './add-user-dialog';
import { SubscriptionPlan } from '@prisma/client';

interface ViewUsersDialogProps {
	subscriptionPlan: Partial<SubscriptionPlan> | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const mockUsers = [
	{
		id: 1,
		name: 'John Doe',
		email: 'john@example.com',
		status: 'active',
		joinedAt: '2024-01-15',
	},
	// Add more mock data as needed
];

export function ViewUsersDialog({
	subscriptionPlan,
	open,
	onOpenChange,
}: ViewUsersDialogProps) {
	const [isAddUserOpen, setIsAddUserOpen] = useState(false);
	const [users, setUsers] = useState(mockUsers);

	const refreshUsers = async () => {
		// Add API call here to refresh users list
		// const updatedUsers = await getSubscriptionUsers(subscription?.id);
		// setUsers(updatedUsers);
	};

	if (!subscriptionPlan) return null;

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<div className="flex items-center justify-between">
							<DialogTitle>Users on {subscriptionPlan.name}</DialogTitle>
							<Button onClick={() => setIsAddUserOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Add User
							</Button>
						</div>
					</DialogHeader>
					<div className="mt-4">
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
										<TableCell>{user.name}</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>{user.status}</TableCell>
										<TableCell>{user.joinedAt}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
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

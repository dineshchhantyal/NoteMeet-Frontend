'use client';

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
import { SubscriptionPlan } from '@prisma/client';

interface ViewUsersDialogProps {
	subscriptionPlan: Partial<SubscriptionPlan>;
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
	if (!subscriptionPlan) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Users on {subscriptionPlan.name}</DialogTitle>
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
							{mockUsers.map((user) => (
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
	);
}

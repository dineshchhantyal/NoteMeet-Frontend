'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { Check, Plus, RefreshCcw, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AddUserDialog } from './add-user-dialog';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { format } from 'date-fns';
import { toast } from 'sonner';

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
	const [subscriptionUsers, setSubscriptionUsers] = useState<User[]>([]);

	const refreshUsers = useCallback(async () => {
		// Add API call here to refresh users list
		const updatedUsers = await fetch(
			`/api/admin/plans/users/${subscriptionPlan?.id}`,
		);
		const { users: subscriptionUsers } = await updatedUsers.json();
		setSubscriptionUsers(subscriptionUsers);
	}, [subscriptionPlan]); // Close the refreshUsers function

	const handleSubscriptionCancel = async (
		planId: string,
		subscriptionId: string,
	) => {
		const res = await fetch(`/api/admin/plans/users/${planId}`, {
			method: 'DELETE',
			body: JSON.stringify({ subscriptionId: subscriptionId }),
		});
		const { error, message } = await res.json();
		if (error) {
			console.error('Error deleting user:', error);
			toast.error(error);
		}
		if (message) {
			toast.success(message);
		}

		refreshUsers();
	};

	const handleSubscriptionRenew = async (subscriptionId: string) => {
		const res = await fetch(`/api/admin/subsciption`, {
			method: 'PATCH',
			body: JSON.stringify({ subscriptionId: subscriptionId }),
		});
		const { error, message } = await res.json();
		if (error) {
			console.error('Error renewing subscription:', error);
			toast.error(error);
		}
		if (message) {
			toast.success(message);
		}

		refreshUsers();
	};

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
						{subscriptionUsers && subscriptionUsers.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Joined</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{subscriptionUsers.map((subscription) => (
										<TableRow key={subscription.id}>
											<TableCell>{subscription.activeUser.name}</TableCell>
											<TableCell>{subscription.activeUser.email}</TableCell>
											<TableCell>
												<SubscriptionStatusBadge status={subscription.status} />
											</TableCell>
											<TableCell>
												{format(subscription.createdAt, 'MM/dd/yyyy HH:mm')}
											</TableCell>
											<TableCell>
												{subscription.status === SubscriptionStatus.ACTIVE ? (
													<Button
														onClick={() =>
															handleSubscriptionCancel(
																subscription.planId,
																subscription.id,
															)
														}
														variant={'destructive'}
													>
														<X className="mr-2 h-4 w-4" />
														Cancel
													</Button>
												) : (
													<Button
														onClick={() =>
															handleSubscriptionRenew(subscription.id)
														}
													>
														<Check className="mr-2 h-4 w-4" />
														Renew
													</Button>
												)}
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

function SubscriptionStatusBadge({ status }: { status: string }) {
	return (
		<Badge
			variant="outline"
			className={`text-xs ${getStatusColor(status as SubscriptionStatus)}`}
		>
			{status}
		</Badge>
	);
}

function getStatusColor(status: SubscriptionStatus) {
	switch (status) {
		case SubscriptionStatus.ACTIVE:
			return 'bg-green-500 text-white border-green-600';
		case SubscriptionStatus.CANCELED:
			return 'bg-red-500 text-white border-red-600';
	}
}

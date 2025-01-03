'use client';

import { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	MoreHorizontal,
	Pencil,
	Users,
	Trash2,
	PlusCircle,
	Loader2,
} from 'lucide-react';
import { ViewUsersDialog } from '@/components/admin/subscriptions/view-users-dialog';
import { DeleteSubscriptionDialog } from '@/components/admin/subscriptions/delete-subscription-dialog';
import { format } from 'date-fns';
import { SubscriptionPlan } from '@prisma/client';
import { SubscriptionFormDialog } from './subscription-dialog';
import { AddUserDialog } from './add-user-dialog';

// const mockSubscriptions: Partial<Subscription>[] = [
//   {
//     id: "1",
//     name: "Pro Plan",
//     cost: 29.99,
//     currency: "USD",
//     billingCycle: "monthly",
//     billingFrequency: "1",
//     plan: SubscriptionPlan.PRO,
//     meetingsAllowed: 100,
//     meetingDuration: 60,
//     cloudStorage: 100,
//     startDate: new Date(),
//   },
// ];

export function SubscriptionPlanTable() {
	const [isLoading, setIsLoading] = useState(true);
	const [subscriptions, setSubscriptions] = useState<
		Partial<SubscriptionPlan>[]
	>([]);
	const [editingSubscription, setEditingSubscription] =
		useState<Partial<SubscriptionPlan> | null>(null);
	const [viewingUsers, setViewingUsers] =
		useState<Partial<SubscriptionPlan> | null>(null);
	const [deletingSubscription, setDeletingSubscription] =
		useState<Partial<SubscriptionPlan> | null>(null);
	const [addingUser, setAddingUser] =
		useState<Partial<SubscriptionPlan> | null>(null);

	useEffect(() => {
		const fetchSubscriptions = async () => {
			try {
				const response = await fetch('/api/admin/plans');
				const data = await response.json();
				setSubscriptions(data);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching subscriptions:', error);
				setIsLoading(false);
			}
		};
		fetchSubscriptions();
	}, []);

	return (
		<>
			{isLoading ? (
				<div className="flex justify-center items-center">
					<Loader2 className="h-4 w-4 animate-spin" />
				</div>
			) : (
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Plan</TableHead>
								<TableHead>Cost</TableHead>
								<TableHead>Billing</TableHead>
								<TableHead>Meetings</TableHead>
								<TableHead>Storage</TableHead>
								<TableHead>Start Date</TableHead>
								<TableHead className="w-[70px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{subscriptions.map((subscriptionPlan) => (
								<TableRow key={subscriptionPlan.id}>
									<TableCell className="font-medium">
										{subscriptionPlan.name}
									</TableCell>
									<TableCell>
										<Badge variant="outline">{subscriptionPlan.tier}</Badge>
									</TableCell>
									<TableCell>
										{subscriptionPlan.basePrice?.toString()}{' '}
										{subscriptionPlan.currency}
									</TableCell>
									<TableCell>{`${subscriptionPlan.billingPeriods?.[0]} ${subscriptionPlan.billingPeriods?.[1]}`}</TableCell>
									<TableCell>{`${subscriptionPlan.meetingsAllowed} meetings / ${subscriptionPlan.meetingDuration}min`}</TableCell>
									<TableCell>{subscriptionPlan.storageLimit}GB</TableCell>
									<TableCell>
										{subscriptionPlan.createdAt &&
											format(subscriptionPlan.createdAt, 'PP')}
									</TableCell>
									<TableCell>
										<DropdownMenu modal={false}>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0 z-10 hover:bg-accent"
													onClick={(e) => e.stopPropagation()}
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => setAddingUser(subscriptionPlan)}
												>
													<PlusCircle className="mr-2 h-4 w-4" />
													Add User
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														setEditingSubscription(subscriptionPlan)
													}
												>
													<Pencil className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => setViewingUsers(subscriptionPlan)}
												>
													<Users className="mr-2 h-4 w-4" />
													View Users
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														setDeletingSubscription(subscriptionPlan)
													}
													className="text-destructive"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{editingSubscription && (
				<SubscriptionFormDialog
					subscriptionPlan={editingSubscription}
					open={!!editingSubscription}
					onOpenChange={() => setEditingSubscription(null)}
					mode="edit"
					setSubscriptionPlan={(subscriptionPlan) =>
						setSubscriptions((prev) => [...prev, subscriptionPlan])
					}
				/>
			)}
			{viewingUsers && (
				<ViewUsersDialog
					subscriptionPlan={viewingUsers}
					open={!!viewingUsers}
					onOpenChange={() => setViewingUsers(null)}
				/>
			)}

			{deletingSubscription && (
				<DeleteSubscriptionDialog
					subscriptionPlan={deletingSubscription}
					open={!!deletingSubscription}
					onOpenChange={() => setDeletingSubscription(null)}
					setSubscriptionPlan={(subscriptionPlan) =>
						setSubscriptions((prev) =>
							prev.filter((plan) => plan.id !== subscriptionPlan.id),
						)
					}
				/>
			)}

			{addingUser && (
				<AddUserDialog
					subscriptionPlan={addingUser}
					open={!!addingUser}
					onOpenChange={() => setAddingUser(null)}
				/>
			)}
		</>
	);
}

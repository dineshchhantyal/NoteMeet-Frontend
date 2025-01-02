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
import { MoreHorizontal, Pencil, Users, Trash2 } from 'lucide-react';
import { EditSubscriptionDialog } from '@/components/admin/subscriptions/edit-subscription-dialog';
import { ViewUsersDialog } from '@/components/admin/subscriptions/view-users-dialog';
import { DeleteSubscriptionDialog } from '@/components/admin/subscriptions/delete-subscription-dialog';
import { format } from 'date-fns';
import { Subscription } from '@prisma/client';
import { SubscriptionPlan } from '@prisma/client';

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

export function SubscriptionTable() {
	const [subscriptions, setSubscriptions] = useState<Partial<Subscription>[]>(
		[],
	);
	const [editingSubscription, setEditingSubscription] =
		useState<Partial<Subscription> | null>(null);
	const [viewingUsers, setViewingUsers] =
		useState<Partial<Subscription> | null>(null);
	const [deletingSubscription, setDeletingSubscription] =
		useState<Partial<Subscription> | null>(null);

	useEffect(() => {
		const fetchSubscriptions = async () => {
			const response = await fetch('/api/admin/subscriptions');
			const data = await response.json();
			setSubscriptions(data);
		};
		fetchSubscriptions();
	}, []);

	return (
		<>
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
						{subscriptions.map((subscription) => (
							<TableRow key={subscription.id}>
								<TableCell className="font-medium">
									{subscription.name}
								</TableCell>
								<TableCell>
									<Badge variant="outline">{subscription.plan}</Badge>
								</TableCell>
								<TableCell>
									{subscription.cost} {subscription.currency}
								</TableCell>
								<TableCell>{`${subscription.billingFrequency} ${subscription.billingCycle}`}</TableCell>
								<TableCell>{`${subscription.meetingsAllowed} meetings / ${subscription.meetingDuration}min`}</TableCell>
								<TableCell>{subscription.cloudStorage}GB</TableCell>
								<TableCell>
									{subscription.startDate &&
										format(subscription.startDate, 'PP')}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => setEditingSubscription(subscription)}
											>
												<Pencil className="mr-2 h-4 w-4" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => setViewingUsers(subscription)}
											>
												<Users className="mr-2 h-4 w-4" />
												View Users
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => setDeletingSubscription(subscription)}
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

			<EditSubscriptionDialog
				subscription={editingSubscription}
				open={!!editingSubscription}
				onOpenChange={() => setEditingSubscription(null)}
			/>

			<ViewUsersDialog
				subscription={viewingUsers}
				open={!!viewingUsers}
				onOpenChange={() => setViewingUsers(null)}
			/>

			<DeleteSubscriptionDialog
				subscription={deletingSubscription}
				open={!!deletingSubscription}
				onOpenChange={() => setDeletingSubscription(null)}
			/>
		</>
	);
}

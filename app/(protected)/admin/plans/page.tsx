'use client';

import { useState } from 'react';
import { SubscriptionPlanTable } from '@/components/admin/subscriptions/subscription-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SubscriptionStats } from '@/components/admin/subscriptions/subscription-stats';
import { SubscriptionFormDialog } from '@/components/admin/subscriptions/subscription-dialog';

export default function SubscriptionsPage() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	return (
		<div className="container mx-auto py-10">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
					<p className="text-gray-600">
						Manage and monitor all subscription plans
					</p>
				</div>
				<Button onClick={() => setIsCreateDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					New Subscription
				</Button>
			</div>

			<SubscriptionStats />
			<SubscriptionPlanTable />
			<SubscriptionFormDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				mode="create"
			/>
		</div>
	);
}

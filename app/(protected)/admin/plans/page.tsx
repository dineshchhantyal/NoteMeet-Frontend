'use client';

import { useState } from 'react';
import { SubscriptionPlanTable } from '@/components/admin/subscriptions/subscription-table';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';
import { SubscriptionStats } from '@/components/admin/subscriptions/subscription-stats';
import { SubscriptionFormDialog } from '@/components/admin/subscriptions/subscription-dialog';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

export default function SubscriptionsPage() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	return (
		<div className="p-8 min-h-screen bg-[#0a4a4e]">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<AdminPageHeader
						title="Subscription Plans"
						icon={<Package className="h-8 w-8 text-[#63d392]" />}
						actions={
							<Button
								onClick={() => setIsCreateDialogOpen(true)}
								className="bg-[#63d392] hover:bg-[#63d392]/90 text-[#0a4a4e]"
							>
								<Plus className="mr-2 h-4 w-4" />
								New Subscription
							</Button>
						}
					/>
				</div>

				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 mb-8 p-6">
					<h2 className="text-xl font-semibold mb-4 text-white">
						Subscription Overview
					</h2>
					<SubscriptionStats />
				</div>

				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden">
					<div className="p-6">
						<h2 className="text-xl font-semibold text-white">
							All Subscription Plans
						</h2>
						<p className="text-gray-300 mt-1">
							Manage and configure the available subscription options
						</p>
					</div>
					<SubscriptionPlanTable />
				</div>

				<SubscriptionFormDialog
					open={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
					mode="create"
				/>
			</div>
		</div>
	);
}

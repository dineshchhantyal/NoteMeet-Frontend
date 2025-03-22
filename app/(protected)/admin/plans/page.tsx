'use client';

import { useState, useEffect } from 'react';
import { SubscriptionPlanTable } from '@/components/admin/subscriptions/subscription-table';
import { Button } from '@/components/ui/button';
import { Package, Plus, Grid, List, RefreshCw } from 'lucide-react';
import { SubscriptionStats } from '@/components/admin/subscriptions/subscription-stats';
import { SubscriptionFormDialog } from '@/components/admin/subscriptions/subscription-dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PlanCard } from '@/components/admin/subscriptions/plan-card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useSubscriptionPlans } from '@/lib/hooks/use-subscription-plans';

export default function SubscriptionsPage() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
	const [filterStatus, setFilterStatus] = useState<
		'all' | 'active' | 'inactive'
	>('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<'price' | 'name' | 'tier'>('price');

	// Use a custom hook to fetch and manage subscription plans
	const {
		plans,
		isLoading,
		error,
		stats,
		refreshPlans,
		togglePlanStatus,
		isRefreshing,
	} = useSubscriptionPlans();

	// Filter plans based on search query and status filter
	const filteredPlans =
		plans?.filter((plan) => {
			const matchesSearch =
				plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				plan.description?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus =
				filterStatus === 'all' ||
				(filterStatus === 'active' && plan.isActive) ||
				(filterStatus === 'inactive' && !plan.isActive);
			return matchesSearch && matchesStatus;
		}) || [];

	// Sort plans based on selected sort criteria
	const sortedPlans = [...filteredPlans].sort((a, b) => {
		if (sortBy === 'price') return a.price - b.price;
		if (sortBy === 'name') return a.name.localeCompare(b.name);
		if (sortBy === 'tier') return a.tier.localeCompare(b.tier);
		return 0;
	});

	// Handle plan status toggle
	const handleStatusToggle = async (planId: string, newStatus: boolean) => {
		try {
			await togglePlanStatus(planId, newStatus);
			toast.success(
				`Plan ${newStatus ? 'activated' : 'deactivated'} successfully`,
			);
		} catch (error) {
			toast.error('Failed to update plan status');
		}
	};

	// Show error toast if fetching fails
	useEffect(() => {
		if (error) {
			toast.error('Failed to load subscription plans');
		}
	}, [error]);

	return (
		<div className="p-4 md:p-8 min-h-screen bg-[#0a4a4e]">
			<div className="max-w-7xl mx-auto">
				{/* Header with actions */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={refreshPlans}
							disabled={isRefreshing}
							className="bg-transparent border-[#63d392]/30 text-white hover:bg-[#156469]/50"
						>
							<RefreshCw
								className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
							/>
							Refresh
						</Button>

						<Button
							onClick={() => setIsCreateDialogOpen(true)}
							className="bg-[#63d392] hover:bg-[#63d392]/90 text-[#0a4a4e]"
						>
							<Plus className="mr-2 h-4 w-4" />
							New Subscription
						</Button>
					</div>
				</div>

				{/* Stats overview */}
				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 mb-8 p-6 transition-all hover:shadow-md hover:border-[#63d392]/30">
					<h2 className="text-xl font-semibold mb-4 text-white">
						Subscription Overview
					</h2>
					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Skeleton className="h-24 w-full bg-[#156469]/50" />
							<Skeleton className="h-24 w-full bg-[#156469]/50" />
							<Skeleton className="h-24 w-full bg-[#156469]/50" />
						</div>
					) : (
						<SubscriptionStats stats={stats} />
					)}
				</div>

				{/* Filter and view controls */}
				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 mb-8 p-4">
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
						<div className="flex flex-1 gap-2">
							<Input
								placeholder="Search plans..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="max-w-xs bg-[#0a4a4e]/50 border-[#63d392]/20 text-white"
							/>

							<Select
								value={filterStatus}
								onValueChange={(value: any) => setFilterStatus(value)}
							>
								<SelectTrigger className="w-[120px] bg-[#0a4a4e]/50 border-[#63d392]/20 text-white">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent className="bg-[#0d5559] border-[#63d392]/20 text-white">
									<SelectItem value="all">All Plans</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
								</SelectContent>
							</Select>

							<Select
								value={sortBy}
								onValueChange={(value: any) => setSortBy(value)}
							>
								<SelectTrigger className="w-[120px] bg-[#0a4a4e]/50 border-[#63d392]/20 text-white">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent className="bg-[#0d5559] border-[#63d392]/20 text-white">
									<SelectItem value="price">Price</SelectItem>
									<SelectItem value="name">Name</SelectItem>
									<SelectItem value="tier">Tier</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<ToggleGroup
							type="single"
							value={viewMode}
							onValueChange={(v) => v && setViewMode(v as any)}
						>
							<ToggleGroupItem
								value="table"
								className="bg-[#0a4a4e]/50 border-[#63d392]/20 data-[state=on]:bg-[#63d392] data-[state=on]:text-[#0a4a4e]"
							>
								<List className="h-4 w-4" />
							</ToggleGroupItem>
							<ToggleGroupItem
								value="grid"
								className="bg-[#0a4a4e]/50 border-[#63d392]/20 data-[state=on]:bg-[#63d392] data-[state=on]:text-[#0a4a4e]"
							>
								<Grid className="h-4 w-4" />
							</ToggleGroupItem>
						</ToggleGroup>
					</div>
				</div>

				{/* Plans display */}
				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden">
					<div className="p-6">
						<h2 className="text-xl font-semibold text-white flex items-center">
							All Subscription Plans
							{isLoading ? null : (
								<Badge className="ml-2 bg-[#63d392]/20 text-[#63d392]">
									{sortedPlans.length} of {plans?.length}
								</Badge>
							)}
						</h2>
						<p className="text-gray-300 mt-1">
							{viewMode === 'table'
								? 'Detailed view of all subscription plans'
								: 'Visual comparison of subscription tiers'}
						</p>
					</div>

					{isLoading ? (
						<div className="p-6">
							<div className="space-y-4">
								<Skeleton className="h-12 w-full bg-[#156469]/50" />
								<Skeleton className="h-12 w-full bg-[#156469]/50" />
								<Skeleton className="h-12 w-full bg-[#156469]/50" />
							</div>
						</div>
					) : (
						<>
							{sortedPlans.length === 0 ? (
								<div className="p-12 text-center text-gray-400">
									<Package className="mx-auto h-12 w-12 opacity-20 mb-4" />
									<h3 className="text-lg font-medium text-white mb-1">
										No subscription plans found
									</h3>
									<p>Try changing your search criteria or create a new plan</p>
									<Button
										onClick={() => setIsCreateDialogOpen(true)}
										className="mt-4 bg-[#63d392] hover:bg-[#63d392]/90 text-[#0a4a4e]"
									>
										<Plus className="mr-2 h-4 w-4" />
										New Plan
									</Button>
								</div>
							) : viewMode === 'table' ? (
								<SubscriptionPlanTable
									plans={sortedPlans}
									onStatusToggle={handleStatusToggle}
								/>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
									{sortedPlans.map((plan) => (
										<PlanCard
											key={plan.id}
											plan={plan}
											onStatusToggle={handleStatusToggle}
											onEdit={() => {
												/* Add edit handler */
											}}
										/>
									))}
								</div>
							)}
						</>
					)}
				</div>

				<SubscriptionFormDialog
					open={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
					mode="create"
					onSuccess={refreshPlans}
				/>
			</div>
		</div>
	);
}

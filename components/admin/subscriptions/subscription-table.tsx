'use client';

import { useState, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	MoreHorizontal,
	Pencil,
	Trash2,
	Eye,
	Check,
	X,
	Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubscriptionFormDialog } from './subscription-dialog';
import { toast } from 'sonner';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Define subscription plan type
type SubscriptionPlan = {
	id: string;
	name: string;
	description: string;
	price: number;
	interval: 'monthly' | 'yearly';
	features: string[];
	isActive: boolean;
};

export function SubscriptionPlanTable() {
	const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
	const [loading, setLoading] = useState(true);
	const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(
		null,
	);
	const [deleting, setDeleting] = useState(false);

	// Mock data loading
	useEffect(() => {
		// Replace with actual API call
		setTimeout(() => {
			setPlans([
				{
					id: '1',
					name: 'Basic',
					description: 'For individuals getting started',
					price: 9.99,
					interval: 'monthly',
					features: ['Up to 5 users', '10GB storage', 'Basic support'],
					isActive: true,
				},
				{
					id: '2',
					name: 'Pro',
					description: 'For professionals and small teams',
					price: 19.99,
					interval: 'monthly',
					features: [
						'Up to 20 users',
						'100GB storage',
						'Priority support',
						'Advanced analytics',
					],
					isActive: true,
				},
				{
					id: '3',
					name: 'Enterprise',
					description: 'For large organizations',
					price: 49.99,
					interval: 'monthly',
					features: [
						'Unlimited users',
						'1TB storage',
						'24/7 support',
						'Custom integration',
					],
					isActive: false,
				},
			]);
			setLoading(false);
		}, 1000);
	}, []);

	const handleDelete = async (plan: SubscriptionPlan) => {
		setPlanToDelete(plan);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!planToDelete) return;

		setDeleting(true);
		try {
			// Replace with actual delete API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setPlans(plans.filter((p) => p.id !== planToDelete.id));
			toast.success(`${planToDelete.name} plan deleted successfully`);
		} catch (error) {
			toast.error('Failed to delete plan');
		} finally {
			setDeleting(false);
			setIsDeleteDialogOpen(false);
			setPlanToDelete(null);
		}
	};

	const handleToggleActive = async (plan: SubscriptionPlan) => {
		try {
			// Replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			setPlans(
				plans.map((p) =>
					p.id === plan.id ? { ...p, isActive: !p.isActive } : p,
				),
			);

			toast.success(
				`${plan.name} plan ${plan.isActive ? 'deactivated' : 'activated'} successfully`,
			);
		} catch (error) {
			toast.error('Failed to update plan status');
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center py-20">
				<div className="flex flex-col items-center text-white">
					<Loader2 className="h-8 w-8 animate-spin text-[#63d392] mb-2" />
					<span>Loading subscription plans...</span>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader className="bg-[#0d5559]/60">
						<TableRow className="hover:bg-transparent border-[#63d392]/20">
							<TableHead className="text-[#63d392] font-medium">Name</TableHead>
							<TableHead className="text-[#63d392] font-medium">
								Description
							</TableHead>
							<TableHead className="text-[#63d392] font-medium">
								Price
							</TableHead>
							<TableHead className="text-[#63d392] font-medium">
								Interval
							</TableHead>
							<TableHead className="text-[#63d392] font-medium">
								Status
							</TableHead>
							<TableHead className="text-[#63d392] font-medium text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{plans.map((plan) => (
							<TableRow
								key={plan.id}
								className="border-[#63d392]/10 hover:bg-[#156469]/50"
							>
								<TableCell className="font-medium text-white">
									{plan.name}
								</TableCell>
								<TableCell className="text-gray-300">
									{plan.description}
								</TableCell>
								<TableCell className="text-gray-300">
									${plan.price.toFixed(2)}
								</TableCell>
								<TableCell className="text-gray-300 capitalize">
									{plan.interval}
								</TableCell>
								<TableCell>
									{plan.isActive ? (
										<Badge className="bg-green-500/20 text-green-400 border-none">
											Active
										</Badge>
									) : (
										<Badge className="bg-red-500/20 text-red-400 border-none">
											Inactive
										</Badge>
									)}
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="h-8 w-8 p-0 text-white hover:bg-[#156469]/70"
											>
												<span className="sr-only">Open menu</span>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="bg-[#0d5559] border-[#63d392]/30 text-white"
										>
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuSeparator className="bg-[#63d392]/20" />
											<DropdownMenuItem
												className="flex items-center hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
												onClick={() => {
													setEditPlan(plan);
													setIsEditDialogOpen(true);
												}}
											>
												<Pencil className="mr-2 h-4 w-4" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												className="flex items-center hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
												onClick={() => handleToggleActive(plan)}
											>
												{plan.isActive ? (
													<>
														<X className="mr-2 h-4 w-4" />
														Deactivate
													</>
												) : (
													<>
														<Check className="mr-2 h-4 w-4" />
														Activate
													</>
												)}
											</DropdownMenuItem>
											<DropdownMenuSeparator className="bg-[#63d392]/20" />
											<DropdownMenuItem
												className="flex items-center hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 cursor-pointer"
												onClick={() => handleDelete(plan)}
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

			<SubscriptionFormDialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				mode="edit"
				plan={editPlan}
			/>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-white">
							Are you sure?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-gray-300">
							This will permanently delete the{' '}
							<span className="font-semibold text-[#63d392]">
								{planToDelete?.name}
							</span>{' '}
							plan. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="bg-transparent border-[#63d392]/30 text-white hover:bg-[#156469]/50 hover:text-white">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-500/80 hover:bg-red-500 text-white"
							onClick={confirmDelete}
							disabled={deleting}
						>
							{deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

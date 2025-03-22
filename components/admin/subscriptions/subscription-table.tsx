import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash, Copy } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/utils';
import { SubscriptionPlan } from '@/types/subscription';

// Add field mapping at the top of the component
function mapPlanToViewModel(plan: any) {
	return {
		...plan,
		// Map DB fields to view-friendly fields
		price: plan.basePrice,
		billingPeriod: plan.billingPeriods,
		maxMeetings: plan.meetingsAllowed,
		maxParticipants: plan.meetingDuration,
		maxStorageGB: plan.storageLimit,
	};
}

interface SubscriptionPlanTableProps {
	plans: SubscriptionPlan[];
	onStatusToggle: (planId: string, newStatus: boolean) => Promise<void>;
	onEdit?: (plan: SubscriptionPlan) => void;
	onDelete?: (planId: string) => void;
	onDuplicate?: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlanTable({
	plans,
	onStatusToggle,
	onEdit,
	onDelete,
	onDuplicate,
}: SubscriptionPlanTableProps) {
	// Map plans to view model
	const viewPlans = plans.map(mapPlanToViewModel);

	return (
		<div className="overflow-x-auto">
			<Table className="min-w-full">
				<TableHeader className="bg-[#0a4a4e]">
					<TableRow>
						<TableHead className="text-white font-medium w-[150px]">
							Name
						</TableHead>
						<TableHead className="text-white font-medium">Tier</TableHead>
						<TableHead className="text-white font-medium">Price</TableHead>
						<TableHead className="text-white font-medium">Billing</TableHead>
						<TableHead className="text-white font-medium">Storage</TableHead>
						<TableHead className="text-white font-medium">Meetings</TableHead>
						<TableHead className="text-white font-medium">Status</TableHead>
						<TableHead className="text-white font-medium text-right">
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{viewPlans.map((plan) => (
						<TableRow
							key={plan.id}
							className={`border-b border-[#63d392]/10 hover:bg-[#156469]/30 ${
								!plan.isActive ? 'opacity-60' : ''
							}`}
						>
							<TableCell className="font-medium text-white">
								{plan.name}
							</TableCell>
							<TableCell>
								<Badge className="bg-[#63d392]/20 text-[#63d392] border-[#63d392]/30">
									{plan.tier}
								</Badge>
							</TableCell>
							<TableCell className="text-white">
								{formatCurrency(plan.price, plan.currency)}
							</TableCell>
							<TableCell className="text-gray-300">
								{plan.billingPeriod && typeof plan.billingPeriod === 'string'
									? plan.billingPeriod.charAt(0) +
										plan.billingPeriod.slice(1).toLowerCase()
									: 'N/A'}
							</TableCell>
							<TableCell className="text-gray-300">
								{plan.maxStorageGB} GB
							</TableCell>
							<TableCell className="text-gray-300">
								{plan.maxMeetings}/month
							</TableCell>
							<TableCell>
								<Switch
									checked={plan.isActive}
									onCheckedChange={(checked) =>
										onStatusToggle(plan.id, checked)
									}
									className="data-[state=checked]:bg-[#63d392]"
								/>
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											size="sm"
											variant="ghost"
											className="h-8 w-8 p-0 text-white hover:bg-[#156469]"
										>
											<span className="sr-only">Open menu</span>
											<svg
												width="15"
												height="15"
												viewBox="0 0 15 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
											>
												<path
													d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
													fill="currentColor"
													fillRule="evenodd"
													clipRule="evenodd"
												></path>
											</svg>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="bg-[#0d5559] border-[#63d392]/20 text-white"
									>
										<DropdownMenuItem
											onClick={() => onEdit && onEdit(plan)}
											className="cursor-pointer hover:bg-[#156469] focus:bg-[#156469]"
										>
											<Edit className="mr-2 h-4 w-4" />
											<span>Edit</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onDuplicate && onDuplicate(plan)}
											className="cursor-pointer hover:bg-[#156469] focus:bg-[#156469]"
										>
											<Copy className="mr-2 h-4 w-4" />
											<span>Duplicate</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onDelete && onDelete(plan.id)}
											className="cursor-pointer text-red-400 hover:bg-red-950/30 focus:bg-red-950/30"
										>
											<Trash className="mr-2 h-4 w-4" />
											<span>Delete</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

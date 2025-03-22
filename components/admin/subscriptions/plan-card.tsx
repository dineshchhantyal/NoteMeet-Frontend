import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Package, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PlanCardProps {
	plan: any;
	onStatusToggle: (id: string, status: boolean) => void;
	onEdit: (plan: any) => void;
}

export function PlanCard({ plan, onStatusToggle, onEdit }: PlanCardProps) {
	const {
		id,
		name,
		description,
		price,
		currency,
		billingPeriod,
		tier,
		isActive,
		features,
		maxMeetings,
		maxStorageGB,
	} = plan;

	const tierColors = {
		FREE: 'blue',
		BASIC: 'green',
		PRO: 'purple',
		ENTERPRISE: 'amber',
	};

	const tierColor = (tierColors as any)[tier] || 'gray';

	return (
		<Card
			className={`border ${isActive ? 'border-[#63d392]/30' : 'border-gray-500/20'} bg-[#0d5559]/60 backdrop-blur-sm overflow-hidden transition-all duration-200 ${isActive ? 'hover:shadow-md hover:shadow-[#63d392]/10' : 'opacity-70'}`}
		>
			<div className={`h-2 w-full bg-${tierColor}-500`}></div>

			<CardHeader>
				<div className="flex justify-between items-start">
					<div>
						<Badge
							className={`bg-${tierColor}-500/20 text-${tierColor}-300 mb-2`}
						>
							{tier}
						</Badge>
						<CardTitle className="text-white text-xl">{name}</CardTitle>
						<CardDescription className="text-gray-300 mt-1">
							{description || 'No description provided'}
						</CardDescription>
					</div>

					<Switch
						checked={isActive}
						onCheckedChange={(checked) => onStatusToggle(id, checked)}
						className="data-[state=checked]:bg-[#63d392]"
					/>
				</div>
			</CardHeader>

			<CardContent>
				<div className="mb-4">
					<span className="text-2xl font-bold text-white">
						{formatCurrency(price, currency)}
					</span>
					<span className="text-gray-400 ml-1">
						/{billingPeriod.toLowerCase()}
					</span>
				</div>

				<div className="space-y-2 text-sm text-gray-300 my-4">
					<div className="flex items-center">
						<Package className="h-4 w-4 mr-2 text-[#63d392]" />
						<span>Up to {maxMeetings} meetings</span>
					</div>
					<div className="flex items-center">
						<Package className="h-4 w-4 mr-2 text-[#63d392]" />
						<span>{maxStorageGB}GB storage</span>
					</div>

					{features && features.length > 0 && (
						<div className="mt-4 space-y-1">
							{features.map((feature: string, i: number) => (
								<div key={i} className="flex items-start">
									<Check className="h-4 w-4 mr-2 text-[#63d392] mt-0.5" />
									<span>{feature}</span>
								</div>
							))}
						</div>
					)}
				</div>
			</CardContent>

			<CardFooter className="flex justify-between border-t border-[#63d392]/10 pt-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onEdit(plan)}
					className="bg-transparent border-[#63d392]/30 text-white hover:bg-[#156469]/50"
				>
					<Edit className="h-4 w-4 mr-2" />
					Edit
				</Button>

				<Button
					variant="destructive"
					size="sm"
					className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-900/20 hover:text-red-300"
				>
					<Trash className="h-4 w-4 mr-2" />
					Delete
				</Button>
			</CardFooter>
		</Card>
	);
}

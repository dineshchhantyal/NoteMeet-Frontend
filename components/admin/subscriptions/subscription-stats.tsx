import { Card, CardContent } from '@/components/ui/card';
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from 'recharts';
import { DollarSign, Users, Tag } from 'lucide-react';

interface SubscriptionStatsProps {
	stats: {
		totalPlans: number;
		activePlans: number;
		averagePrice: number;
		mostPopularTier: string;
		revenueByTier: Record<string, number>;
	};
}

export function SubscriptionStats({ stats }: SubscriptionStatsProps) {
	// Format data for the chart
	const chartData = Object.entries(stats.revenueByTier).map(
		([tier, revenue]) => ({
			tier,
			revenue,
		}),
	);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<Card className="bg-[#0d5559]/60 border-[#63d392]/20">
				<CardContent className="flex items-center p-6">
					<div className="bg-[#63d392]/10 p-3 rounded-full mr-4">
						<Tag className="h-6 w-6 text-[#63d392]" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-300">Total Plans</p>
						<div className="flex items-baseline">
							<h3 className="text-2xl font-bold text-white mt-1">
								{stats.totalPlans}
							</h3>
							<p className="ml-2 text-sm text-[#63d392]">
								({stats.activePlans} active)
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-[#0d5559]/60 border-[#63d392]/20">
				<CardContent className="flex items-center p-6">
					<div className="bg-[#63d392]/10 p-3 rounded-full mr-4">
						<DollarSign className="h-6 w-6 text-[#63d392]" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-300">Average Price</p>
						<div className="flex items-baseline">
							<h3 className="text-2xl font-bold text-white mt-1">
								${stats.averagePrice.toFixed(2)}
							</h3>
							<p className="ml-2 text-sm text-gray-300">per plan</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-[#0d5559]/60 border-[#63d392]/20">
				<CardContent className="flex items-center p-6">
					<div className="bg-[#63d392]/10 p-3 rounded-full mr-4">
						<Users className="h-6 w-6 text-[#63d392]" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-300">
							Most Popular Tier
						</p>
						<h3 className="text-2xl font-bold text-white mt-1">
							{stats.mostPopularTier || 'N/A'}
						</h3>
					</div>
				</CardContent>
			</Card>

			<Card className="col-span-1 md:col-span-3 bg-[#0d5559]/60 border-[#63d392]/20">
				<CardContent className="p-6">
					<h3 className="text-lg font-medium text-white mb-4">
						Revenue by Tier
					</h3>
					<div className="h-[200px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData}>
								<XAxis
									dataKey="tier"
									tick={{ fill: '#ffffff', fontSize: 12 }}
								/>
								<YAxis
									tick={{ fill: '#ffffff', fontSize: 12 }}
									tickFormatter={(value) => `$${value}`}
								/>
								<Tooltip
									formatter={(value) => [`$${value}`, 'Revenue']}
									contentStyle={{
										backgroundColor: '#0d5559',
										borderColor: '#63d392',
										color: 'white',
									}}
								/>
								<Bar dataKey="revenue" fill="#63d392" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

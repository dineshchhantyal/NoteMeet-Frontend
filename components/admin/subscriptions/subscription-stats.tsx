'use client';

import { Users, CreditCard, TrendingUp, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SubscriptionStats() {
	// Replace with actual data fetching logic
	const stats = [
		{
			title: 'Active Subscribers',
			value: '2,345',
			change: '+12%',
			icon: <Users className="h-4 w-4 text-[#63d392]" />,
		},
		{
			title: 'Monthly Revenue',
			value: '$42,500',
			change: '+8.5%',
			icon: <CreditCard className="h-4 w-4 text-[#63d392]" />,
		},
		{
			title: 'Avg. Plan Value',
			value: '$25.99',
			change: '+3.2%',
			icon: <TrendingUp className="h-4 w-4 text-[#63d392]" />,
		},
		{
			title: 'Most Popular',
			value: 'Pro Plan',
			change: '65% users',
			icon: <BarChart className="h-4 w-4 text-[#63d392]" />,
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat, index) => (
				<Card key={index} className="bg-[#0d5559]/50 border-[#63d392]/20">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-gray-200">
							{stat.title}
						</CardTitle>
						<div className="p-1 bg-[#0a4a4e] rounded-md">{stat.icon}</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">{stat.value}</div>
						<p className="text-xs text-[#63d392] mt-1">{stat.change}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

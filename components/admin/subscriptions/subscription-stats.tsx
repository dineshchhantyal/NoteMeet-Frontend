'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, CheckCircle, XCircle } from 'lucide-react';

const stats = [
	{
		title: 'Total Subscribers',
		value: '2,350',
		icon: Users,
		description: 'Active subscribers across all plans',
	},
	{
		title: 'Monthly Revenue',
		value: '$12,234',
		icon: CreditCard,
		description: 'Revenue this month',
	},
	{
		title: 'Active Plans',
		value: '4',
		icon: CheckCircle,
		description: 'Currently active subscription plans',
	},
	{
		title: 'Churned Users',
		value: '12',
		icon: XCircle,
		description: 'Users who cancelled this month',
	},
];

export function SubscriptionStats() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
			{stats.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
						<stat.icon className="h-4 w-4 text-gray-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stat.value}</div>
						<p className="text-xs text-gray-600">{stat.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

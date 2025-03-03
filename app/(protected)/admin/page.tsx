'use client';

import {
	BarChart3,
	Users,
	FileText,
	Mail,
	Calendar,
	ArrowUpRight,
	CreditCard,
} from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminPage = () => {
	// Sample stats data
	const stats = [
		{
			title: 'Total Users',
			value: '2,853',
			change: '+12.5%',
			icon: <Users className="h-5 w-5 text-[#63d392]" />,
		},
		{
			title: 'Newsletter Subscribers',
			value: '1,245',
			change: '+3.2%',
			icon: <Mail className="h-5 w-5 text-[#63d392]" />,
		},
		{
			title: 'Job Applications',
			value: '357',
			change: '+28.4%',
			icon: <FileText className="h-5 w-5 text-[#63d392]" />,
		},
		{
			title: 'Monthly Revenue',
			value: '$18,420',
			change: '+4.3%',
			icon: <CreditCard className="h-5 w-5 text-[#63d392]" />,
		},
	];

	// Recent activities (you can replace with real data)
	const activities = [
		{
			action: 'New user registered',
			user: 'alex@example.com',
			time: '10 minutes ago',
		},
		{
			action: 'Job application submitted',
			user: 'maria@example.com',
			time: '45 minutes ago',
		},
		{
			action: 'Payment received',
			user: 'john@example.com',
			time: '1 hour ago',
		},
		{
			action: 'Newsletter subscription',
			user: 'sarah@example.com',
			time: '3 hours ago',
		},
	];

	return (
		<div className="min-h-screen bg-[#0a4a4e]">
			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-white mb-2">
						Admin Dashboard
					</h1>
					<p className="text-gray-300">
						Welcome back! Here&apos;s what&apos;s happening with NoteMeet today.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{stats.map((stat, index) => (
						<Card
							key={index}
							className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20"
						>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-white text-sm font-medium">
									{stat.title}
								</CardTitle>
								<div className="p-1 bg-[#0d5559] rounded-md">{stat.icon}</div>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-white">
									{stat.value}
								</div>
								<p className="text-xs text-[#63d392] flex items-center mt-1">
									<ArrowUpRight className="h-3 w-3 mr-1" />
									{stat.change} from last month
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					{/* Recent Activity */}
					<Card className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20">
						<CardHeader>
							<CardTitle className="text-white flex items-center">
								<Calendar className="h-5 w-5 mr-2 text-[#63d392]" />
								Recent Activities
							</CardTitle>
							<CardDescription className="text-gray-300">
								Latest actions across the platform
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{activities.map((activity, i) => (
									<div
										key={i}
										className="border-b border-[#63d392]/10 pb-3 last:border-0"
									>
										<div className="flex justify-between">
											<p className="font-medium text-white">
												{activity.action}
											</p>
											<span className="text-xs text-gray-400">
												{activity.time}
											</span>
										</div>
										<p className="text-sm text-gray-300">{activity.user}</p>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter>
							<Button
								variant="outline"
								className="w-full border-[#63d392]/30 text-[#63d392] hover:bg-[#63d392]/10"
							>
								View All Activities
							</Button>
						</CardFooter>
					</Card>

					{/* Quick Actions */}
					<Card className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20">
						<CardHeader>
							<CardTitle className="text-white flex items-center">
								<BarChart3 className="h-5 w-5 mr-2 text-[#63d392]" />
								Quick Actions
							</CardTitle>
							<CardDescription className="text-gray-300">
								Common administrative tasks
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-2">
							<Button className="justify-start bg-[#0d5559]/70 hover:bg-[#0d5559] text-white">
								<Users className="mr-2 h-4 w-4" />
								View User Management
							</Button>
							<Button className="justify-start bg-[#0d5559]/70 hover:bg-[#0d5559] text-white">
								<Mail className="mr-2 h-4 w-4" />
								Send Newsletter
							</Button>
							<Button className="justify-start bg-[#0d5559]/70 hover:bg-[#0d5559] text-white">
								<FileText className="mr-2 h-4 w-4" />
								Review Job Applications
							</Button>
							<Button className="justify-start bg-[#0d5559]/70 hover:bg-[#0d5559] text-white">
								<CreditCard className="mr-2 h-4 w-4" />
								View Payment Reports
							</Button>
						</CardContent>
						<CardFooter>
							<Button
								variant="default"
								className="w-full bg-[#63d392] hover:bg-[#63d392]/90 text-[#0a4a4e]"
							>
								All Administrative Tools
							</Button>
						</CardFooter>
					</Card>
				</div>
			</main>
		</div>
	);
};

export default AdminPage;

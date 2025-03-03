'use client';

import { useState, useEffect } from 'react';
import {
	JobApplicationInterface,
	JobApplicationStatus,
} from '@/schemas/job-application';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Loader2 } from 'lucide-react';
import { getAdminJobApplications } from '@/data/job-application';
import { DataTable } from './data-table';
import { columns } from './columns';
import { cn } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

export default function JobApplicationsPage() {
	const [applications, setApplications] = useState<JobApplicationInterface[]>(
		[],
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchApplications = async () => {
			const data = await getAdminJobApplications();
			setApplications(data as JobApplicationInterface[]);
			setLoading(false);
		};
		fetchApplications();
	}, []);

	const filterApplications = (status: JobApplicationStatus) => {
		return applications.filter((app) => app.status === status);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen bg-[#0a4a4e]">
				<div className="flex flex-col items-center text-white">
					<Loader2 className="h-8 w-8 animate-spin text-[#63d392] mb-2" />
					<span>Loading applications...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="p-8 min-h-screen bg-[#0a4a4e]">
			<div className="max-w-7xl mx-auto">
				<AdminPageHeader
					title="Job Applications"
					icon={<Briefcase className="h-8 w-8 text-[#63d392]" />}
				/>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<StatCard
						title="Total Applications"
						value={applications.length}
						color="bg-[#156469]/50"
					/>
					<StatCard
						title="Pending Review"
						value={filterApplications(JobApplicationStatus.PENDING).length}
						color="bg-yellow-500/20"
						textColor="text-yellow-400"
					/>
					<StatCard
						title="Approved"
						value={filterApplications(JobApplicationStatus.APPROVED).length}
						color="bg-green-500/20"
						textColor="text-green-400"
					/>
					<StatCard
						title="Rejected"
						value={filterApplications(JobApplicationStatus.REJECTED).length}
						color="bg-red-500/20"
						textColor="text-red-400"
					/>
				</div>

				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden mt-8 p-6">
					<Tabs defaultValue="all" className="w-full">
						<TabsList className="bg-[#0d5559]/60 border border-[#63d392]/20 p-1">
							<TabsTrigger
								value="all"
								className="data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white data-[state=active]:shadow"
							>
								All Applications
							</TabsTrigger>
							<TabsTrigger
								value="pending"
								className="data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white data-[state=active]:shadow"
							>
								Pending
							</TabsTrigger>
							<TabsTrigger
								value="approved"
								className="data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white data-[state=active]:shadow"
							>
								Approved
							</TabsTrigger>
							<TabsTrigger
								value="rejected"
								className="data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white data-[state=active]:shadow"
							>
								Rejected
							</TabsTrigger>
						</TabsList>
						<div className="mt-4">
							<TabsContent value="all">
								<DataTable columns={columns} data={applications} />
							</TabsContent>
							<TabsContent value="pending">
								<DataTable
									columns={columns}
									data={filterApplications(JobApplicationStatus.PENDING)}
								/>
							</TabsContent>
							<TabsContent value="approved">
								<DataTable
									columns={columns}
									data={filterApplications(JobApplicationStatus.APPROVED)}
								/>
							</TabsContent>
							<TabsContent value="rejected">
								<DataTable
									columns={columns}
									data={filterApplications(JobApplicationStatus.REJECTED)}
								/>
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

interface StatCardProps {
	title: string;
	value: number;
	color?: string;
	textColor?: string;
}

function StatCard({
	title,
	value,
	color = 'bg-[#156469]/50',
	textColor = 'text-white',
}: StatCardProps) {
	return (
		<Card className={cn('border border-[#63d392]/20', color)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-gray-200">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className={cn('text-2xl font-bold', textColor)}>{value}</div>
			</CardContent>
		</Card>
	);
}

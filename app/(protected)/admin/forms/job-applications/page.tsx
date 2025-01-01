'use client';

import { useState } from 'react';
import {
	JobApplicationInterface,
	JobApplicationStatus,
} from '@/schemas/job-application';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { getAdminJobApplications } from '@/data/job-application';
import { DataTable } from './data-table';
import { columns } from './columns';

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
			<div className="flex items-center justify-center h-screen">
				Loading...
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<div className="flex items-center space-x-4 mb-8">
				<Briefcase className="h-8 w-8 text-primary" />
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Job Applications
					</h1>
					<p className="text-muted-foreground">
						Manage and review all job applications
					</p>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Applications
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{applications.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Review
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{filterApplications(JobApplicationStatus.PENDING).length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Approved</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{filterApplications(JobApplicationStatus.APPROVED).length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Rejected</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{filterApplications(JobApplicationStatus.REJECTED).length}
						</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="all" className="mt-8">
				<TabsList>
					<TabsTrigger value="all">All Applications</TabsTrigger>
					<TabsTrigger value="pending">Pending</TabsTrigger>
					<TabsTrigger value="approved">Approved</TabsTrigger>
					<TabsTrigger value="rejected">Rejected</TabsTrigger>
				</TabsList>
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
			</Tabs>
		</div>
	);
}

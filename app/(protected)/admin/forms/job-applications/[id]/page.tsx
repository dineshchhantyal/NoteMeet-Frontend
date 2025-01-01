'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
	JobApplicationInterface,
	JobApplicationStatus,
} from '@/schemas/job-application';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, Download, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
	getAdminJobApplicationById,
	updateAdminJobApplicationStatus,
} from '@/data/job-application';

export default function ApplicationDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [application, setApplication] =
		useState<JobApplicationInterface | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchApplication = async () => {
			if (params.id) {
				const data = await getAdminJobApplicationById(Number(params.id));
				setApplication(data as JobApplicationInterface);
				setLoading(false);
			}
		};
		fetchApplication();
	}, [params.id]);

	const handleStatusChange = async (newStatus: JobApplicationStatus) => {
		if (!application) return;

		try {
			const updated = await updateAdminJobApplicationStatus(
				application.id,
				newStatus,
			);
			if (updated) {
				setApplication(updated as JobApplicationInterface);
				toast.success('Application status updated successfully');
			}
		} catch (error) {
			toast.error('Failed to update application status');
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading...
			</div>
		);
	}

	if (!application) {
		return <div>Application not found</div>;
	}

	return (
		<div className="container mx-auto py-10">
			<Button
				variant="ghost"
				className="mb-6"
				onClick={() => router.push('/admin/applications')}
			>
				<ArrowLeft className="mr-2 h-4 w-4" />
				Back to Applications
			</Button>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Applicant Information</CardTitle>
						<CardDescription>Basic details about the applicant</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium text-muted-foreground">Name</p>
							<p className="text-lg font-medium">{application.name}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">Email</p>
							<div className="flex items-center space-x-2">
								<p className="text-lg font-medium">{application.email}</p>
								<Button variant="ghost" size="icon">
									<Mail className="h-4 w-4" />
								</Button>
							</div>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Position
							</p>
							<p className="text-lg font-medium">{application.position}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Applied On
							</p>
							<p className="text-lg font-medium">
								{format(new Date(application.createdAt), 'PPP')}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Application Status</CardTitle>
						<CardDescription>Manage application status</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium text-muted-foreground mb-2">
								Current Status
							</p>
							<Badge
								variant={
									application.status === JobApplicationStatus.APPROVED
										? 'default'
										: application.status === JobApplicationStatus.REJECTED
											? 'destructive'
											: 'outline'
								}
								className="text-sm"
							>
								{application.status}
							</Badge>
						</div>
						<Separator />
						<div>
							<p className="text-sm font-medium text-muted-foreground mb-2">
								Update Status
							</p>
							<Select
								value={application.status}
								onValueChange={(value) =>
									handleStatusChange(value as JobApplicationStatus)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									{Object.values(JobApplicationStatus).map((status) => (
										<SelectItem key={status} value={status}>
											{status}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Documents</CardTitle>
						<CardDescription>Application documents</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between p-4 border rounded-lg">
							<div className="flex items-center space-x-4">
								<div>
									<p className="font-medium">Resume</p>
									<p className="text-sm text-muted-foreground">PDF Document</p>
								</div>
							</div>
							<Button variant="secondary">
								<Download className="mr-2 h-4 w-4" />
								Download
							</Button>
						</div>
						{application.coverLetter && (
							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div className="flex items-center space-x-4">
									<div>
										<p className="font-medium">Cover Letter</p>
										<p className="text-sm text-muted-foreground">
											PDF Document
										</p>
									</div>
								</div>
								<Button variant="secondary">
									<Download className="mr-2 h-4 w-4" />
									Download
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

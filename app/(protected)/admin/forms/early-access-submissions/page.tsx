'use client';

import React, { useState, useEffect } from 'react';
import {
	FileText,
	Loader2,
	Search,
	Download,
	Calendar,
	CheckCircle,
	XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

type EarlyAccessSubmission = {
	id: string;
	email: string;
	name: string;
	createdAt: string;
	status: 'pending' | 'contacted' | 'rejected';
};

type PaginationData = {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};

export default function EarlyAccessSubmissionsPage() {
	const [submissions, setSubmissions] = useState<EarlyAccessSubmission[]>([]);
	const [pagination, setPagination] = useState<PaginationData>({
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] = useState<string | undefined>();
	const [searchQuery, setSearchQuery] = useState('');

	const fetchSubmissions = async () => {
		setLoading(true);

		try {
			const queryParams = new URLSearchParams();
			if (statusFilter) queryParams.set('status', statusFilter);
			queryParams.set('page', pagination.page.toString());
			queryParams.set('limit', pagination.limit.toString());

			const response = await fetch(`/api/admin/early-access?${queryParams}`);

			if (!response.ok) {
				throw new Error('Failed to fetch submissions');
			}

			const data = await response.json();

			// Filter by search query if provided
			let filtered = data.submissions;
			if (searchQuery) {
				filtered = data.submissions.filter(
					(sub: EarlyAccessSubmission) =>
						sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
						sub.name.toLowerCase().includes(searchQuery.toLowerCase()),
				);
			}

			setSubmissions(filtered);
			setPagination(data.pagination);
		} catch (error) {
			console.error('Error fetching submissions:', error);
			toast.error('Failed to load submissions');
		} finally {
			setLoading(false);
		}
	};

	// Handle status change
	const handleStatusChange = async (
		submission: EarlyAccessSubmission,
		newStatus: string,
	) => {
		if (submission.status === newStatus) return;

		try {
			const response = await fetch(`/api/admin/early-access/${submission.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status: newStatus }),
			});

			if (!response.ok) {
				throw new Error('Failed to update submission status');
			}

			// Update local state
			const updatedSubmissions = submissions.map((sub) =>
				sub.id === submission.id
					? { ...sub, status: newStatus as EarlyAccessSubmission['status'] }
					: sub,
			);

			setSubmissions(updatedSubmissions);
			toast.success(`Status updated to ${newStatus}`);
		} catch (error) {
			console.error('Error updating status:', error);
			toast.error('Failed to update submission status');
		}
	};

	// Export to CSV
	const exportToCSV = () => {
		try {
			const headers = ['Name', 'Email', 'Status', 'Submitted Date'];

			const csvContent = [
				headers.join(','),
				...submissions.map((sub) =>
					[
						sub.name,
						sub.email,
						sub.status,
						format(new Date(sub.createdAt), 'MMM dd, yyyy'),
					].join(','),
				),
			].join('\n');

			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.setAttribute('href', url);
			link.setAttribute(
				'download',
				`early-access-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`,
			);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success('Export successful');
		} catch (error) {
			console.error('Error exporting CSV:', error);
			toast.error('Failed to export data');
		}
	};

	// Load data on component mount and when filters change
	useEffect(() => {
		fetchSubmissions();
	}, [pagination.page, statusFilter]);

	return (
		<div className="p-8 min-h-screen bg-[#0a4a4e]">
			<div className="max-w-7xl mx-auto">
				<AdminPageHeader
					title="Early Access Submissions"
					icon={<FileText className="h-8 w-8 text-[#63d392]" />}
				/>

				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden mb-6">
					<div className="p-6 border-b border-[#63d392]/20">
						<div className="flex flex-col md:flex-row gap-4 justify-between">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
									<Input
										type="text"
										placeholder="Search by name or email..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && fetchSubmissions()}
										className="pl-10 bg-[#0d5559]/50 border-[#63d392]/30 text-white placeholder:text-gray-400"
									/>
								</div>
							</div>

							<div className="flex gap-3">
								<div className="w-full md:w-48">
									<Select
										value={statusFilter}
										onValueChange={(value) => {
											setStatusFilter(value === 'all' ? undefined : value);
											setPagination({ ...pagination, page: 1 });
										}}
									>
										<SelectTrigger className="bg-[#0d5559]/50 border-[#63d392]/30 text-white">
											<SelectValue placeholder="Filter by status" />
										</SelectTrigger>
										<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
											<SelectItem
												value="all"
												className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
											>
												All
											</SelectItem>
											<SelectItem
												value="pending"
												className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
											>
												Pending
											</SelectItem>
											<SelectItem
												value="contacted"
												className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
											>
												Contacted
											</SelectItem>
											<SelectItem
												value="rejected"
												className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
											>
												Rejected
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<Button
									onClick={exportToCSV}
									variant="outline"
									className="border-[#63d392] text-[#63d392] hover:bg-[#63d392]/20"
								>
									<Download className="h-4 w-4 mr-2" />
									Export
								</Button>
							</div>
						</div>
					</div>

					<div className="overflow-x-auto">
						<Table>
							<TableHeader className="bg-[#0d5559]/60">
								<TableRow className="hover:bg-transparent border-[#63d392]/20">
									<TableHead className="text-[#63d392] font-medium">
										Name
									</TableHead>
									<TableHead className="text-[#63d392] font-medium">
										Email
									</TableHead>
									<TableHead className="text-[#63d392] font-medium">
										Status
									</TableHead>
									<TableHead className="text-[#63d392] font-medium">
										Submitted Date
									</TableHead>
									<TableHead className="text-[#63d392] font-medium text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-10">
											<div className="flex items-center justify-center">
												<Loader2 className="h-8 w-8 animate-spin text-[#63d392]" />
												<span className="ml-2 text-white">
													Loading submissions...
												</span>
											</div>
										</TableCell>
									</TableRow>
								) : submissions.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center py-10 text-white"
										>
											No submissions found
										</TableCell>
									</TableRow>
								) : (
									submissions.map((submission) => (
										<TableRow
											key={submission.id}
											className="border-[#63d392]/10 hover:bg-[#156469]/50"
										>
											<TableCell className="text-white font-medium">
												{submission.name}
											</TableCell>
											<TableCell className="text-gray-300">
												{submission.email}
											</TableCell>
											<TableCell>
												<StatusBadge status={submission.status} />
											</TableCell>
											<TableCell className="text-gray-300">
												{format(new Date(submission.createdAt), 'MMM dd, yyyy')}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Select
														value={submission.status}
														onValueChange={(value) =>
															handleStatusChange(submission, value)
														}
													>
														<SelectTrigger className="h-8 w-28 bg-[#0d5559]/50 border-[#63d392]/30 text-white">
															<SelectValue placeholder="Status" />
														</SelectTrigger>
														<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
															<SelectItem
																value="pending"
																className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
															>
																Pending
															</SelectItem>
															<SelectItem
																value="contacted"
																className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
															>
																Contacted
															</SelectItem>
															<SelectItem
																value="rejected"
																className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
															>
																Rejected
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					<div className="p-4 border-t border-[#63d392]/20">
						<div className="flex items-center justify-between">
							<div className="text-sm text-gray-300">
								Showing {submissions.length} of {pagination.total} submissions
							</div>

							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											href="#"
											onClick={(e) => {
												e.preventDefault();
												if (pagination.page > 1) {
													setPagination({
														...pagination,
														page: pagination.page - 1,
													});
												}
											}}
											className={`${pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''} text-white hover:text-[#63d392]`}
										/>
									</PaginationItem>

									{Array.from(
										{ length: Math.min(5, pagination.totalPages) },
										(_, i) => {
											const minPage = Math.max(1, pagination.page - 2);
											const pageNumber = minPage + i;

											if (pageNumber <= pagination.totalPages) {
												return (
													<PaginationItem key={pageNumber}>
														<PaginationLink
															href="#"
															onClick={(e) => {
																e.preventDefault();
																setPagination({
																	...pagination,
																	page: pageNumber,
																});
															}}
															isActive={pageNumber === pagination.page}
															className={`${
																pageNumber === pagination.page
																	? 'bg-[#63d392] text-[#0a4a4e]'
																	: 'text-white hover:text-[#63d392]'
															}`}
														>
															{pageNumber}
														</PaginationLink>
													</PaginationItem>
												);
											}
											return null;
										},
									)}

									<PaginationItem>
										<PaginationNext
											href="#"
											onClick={(e) => {
												e.preventDefault();
												if (pagination.page < pagination.totalPages) {
													setPagination({
														...pagination,
														page: pagination.page + 1,
													});
												}
											}}
											className={`${
												pagination.page >= pagination.totalPages
													? 'pointer-events-none opacity-50'
													: ''
											} text-white hover:text-[#63d392]`}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Status badge component for consistent styling
function StatusBadge({ status }: { status: string }) {
	switch (status) {
		case 'contacted':
			return (
				<span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
					<CheckCircle className="h-4 w-4 mr-1" />
					Contacted
				</span>
			);
		case 'rejected':
			return (
				<span className="inline-flex items-center px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
					<XCircle className="h-4 w-4 mr-1" />
					Rejected
				</span>
			);
		default:
			return (
				<span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
					<Calendar className="h-4 w-4 mr-1" />
					Pending
				</span>
			);
	}
}

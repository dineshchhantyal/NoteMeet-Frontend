'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { toast } from 'sonner';
import {
	Mail,
	Loader2,
	RefreshCcw,
	Search,
	CheckCircle,
	XCircle,
	Trash2,
	AlertCircle,
} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

type Subscriber = {
	id: string;
	email: string;
	status: string;
	createdAt: string;
	updatedAt: string;
};

type PaginationData = {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};

export default function AdminNewsletterPage() {
	const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
	const [pagination, setPagination] = useState<PaginationData>({
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] = useState<string | undefined>();
	const [searchQuery, setSearchQuery] = useState('');

	// Dialog states
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [subscriberToDelete, setSubscriberToDelete] =
		useState<Subscriber | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isChangingStatus, setIsChangingStatus] = useState(false);

	// Fetch subscribers
	const fetchSubscribers = async () => {
		setLoading(true);

		try {
			const queryParams = new URLSearchParams();
			if (statusFilter) queryParams.set('status', statusFilter);
			queryParams.set('page', pagination.page.toString());
			queryParams.set('limit', pagination.limit.toString());

			const response = await fetch(`/api/admin/newsletter?${queryParams}`);

			if (!response.ok) {
				throw new Error('Failed to fetch subscribers');
			}

			const data = await response.json();

			// Filter by search query if provided
			let filtered = data.subscribers;
			if (searchQuery) {
				filtered = data.subscribers.filter((sub: Subscriber) =>
					sub.email.toLowerCase().includes(searchQuery.toLowerCase()),
				);
			}

			setSubscribers(filtered);
			setPagination(data.pagination);
		} catch (error) {
			console.error('Error fetching subscribers:', error);
			toast.error('Failed to load subscribers');
		} finally {
			setLoading(false);
		}
	};

	// Handle status change
	const handleStatusChange = async (
		subscriber: Subscriber,
		newStatus: string,
	) => {
		if (subscriber.status === newStatus) return;

		setIsChangingStatus(true);

		try {
			const response = await fetch(`/api/admin/newsletter/${subscriber.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status: newStatus }),
			});

			if (!response.ok) {
				throw new Error('Failed to update subscriber status');
			}

			// Update local state
			const updatedSubscribers = subscribers.map((sub) =>
				sub.id === subscriber.id ? { ...sub, status: newStatus } : sub,
			);

			setSubscribers(updatedSubscribers);
			toast.success(`Subscriber status updated to ${newStatus}`);
		} catch (error) {
			console.error('Error updating status:', error);
			toast.error('Failed to update subscriber status');
		} finally {
			setIsChangingStatus(false);
		}
	};

	// Handle subscriber deletion
	const handleDeleteClick = (subscriber: Subscriber) => {
		setSubscriberToDelete(subscriber);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!subscriberToDelete) return;

		setIsDeleting(true);

		try {
			const response = await fetch(
				`/api/admin/newsletter/${subscriberToDelete.id}`,
				{
					method: 'DELETE',
				},
			);

			if (!response.ok) {
				throw new Error('Failed to delete subscriber');
			}

			// Remove from local state
			const updatedSubscribers = subscribers.filter(
				(sub) => sub.id !== subscriberToDelete.id,
			);

			setSubscribers(updatedSubscribers);
			toast.success('Subscriber deleted successfully');
			setDeleteDialogOpen(false);
		} catch (error) {
			console.error('Error deleting subscriber:', error);
			toast.error('Failed to delete subscriber');
		} finally {
			setIsDeleting(false);
		}
	};

	// Load data on component mount and when filters change
	useEffect(() => {
		fetchSubscribers();
	}, [pagination.page, statusFilter]);

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	return (
		<div className="p-8 min-h-screen bg-[#0a4a4e]">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center">
						<Mail className="h-8 w-8 mr-2 text-[#63d392]" />
						<h1 className="text-3xl font-bold text-white">
							Newsletter Subscribers
						</h1>
					</div>
					<Button
						onClick={() => fetchSubscribers()}
						variant="outline"
						className="border-[#63d392] text-[#63d392] hover:bg-[#63d392]/20"
					>
						<RefreshCcw className="h-4 w-4 mr-2" />
						Refresh
					</Button>
				</div>

				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden mb-6">
					<div className="p-6 border-b border-[#63d392]/20">
						<div className="flex flex-col md:flex-row gap-4 justify-between">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
									<Input
										type="text"
										placeholder="Search by email..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && fetchSubscribers()}
										className="pl-10 bg-[#0d5559]/50 border-[#63d392]/30 text-white placeholder:text-gray-400"
									/>
								</div>
							</div>

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
											value="active"
											className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
										>
											Active
										</SelectItem>
										<SelectItem
											value="unsubscribed"
											className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
										>
											Unsubscribed
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					<div className="overflow-x-auto">
						<Table>
							<TableHeader className="bg-[#0d5559]/60">
								<TableRow className="hover:bg-transparent border-[#63d392]/20">
									<TableHead className="text-[#63d392] font-medium w-[40%]">
										Email
									</TableHead>
									<TableHead className="text-[#63d392] font-medium">
										Status
									</TableHead>
									<TableHead className="text-[#63d392] font-medium">
										Subscribed Date
									</TableHead>
									<TableHead className="text-[#63d392] font-medium">
										Last Updated
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
													Loading subscribers...
												</span>
											</div>
										</TableCell>
									</TableRow>
								) : subscribers.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center py-10 text-white"
										>
											No subscribers found
										</TableCell>
									</TableRow>
								) : (
									subscribers.map((subscriber) => (
										<TableRow
											key={subscriber.id}
											className="border-[#63d392]/10 hover:bg-[#156469]/50"
										>
											<TableCell className="text-white font-medium break-all">
												{subscriber.email}
											</TableCell>
											<TableCell>
												<div className="flex items-center">
													{subscriber.status === 'active' ? (
														<span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
															<CheckCircle className="h-4 w-4 mr-1" />
															Active
														</span>
													) : (
														<span className="inline-flex items-center px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
															<XCircle className="h-4 w-4 mr-1" />
															Unsubscribed
														</span>
													)}
												</div>
											</TableCell>
											<TableCell className="text-gray-300">
												{formatDate(subscriber.createdAt)}
											</TableCell>
											<TableCell className="text-gray-300">
												{formatDate(subscriber.updatedAt)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Select
														value={subscriber.status}
														onValueChange={(value) =>
															handleStatusChange(subscriber, value)
														}
														disabled={isChangingStatus}
													>
														<SelectTrigger className="h-8 w-28 bg-[#0d5559]/50 border-[#63d392]/30 text-white">
															<SelectValue placeholder="Status" />
														</SelectTrigger>
														<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
															<SelectItem
																value="active"
																className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
															>
																<span className="flex items-center">
																	<CheckCircle className="h-4 w-4 mr-1" />
																	Active
																</span>
															</SelectItem>
															<SelectItem
																value="unsubscribed"
																className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
															>
																<span className="flex items-center">
																	<XCircle className="h-4 w-4 mr-1" />
																	Unsubscribed
																</span>
															</SelectItem>
														</SelectContent>
													</Select>

													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
														onClick={() => handleDeleteClick(subscriber)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Fix the pagination section */}
					<div className="p-4 border-t border-[#63d392]/20">
						<div className="flex items-center justify-between">
							<div className="text-sm text-gray-300">
								Showing {subscribers.length} of {pagination.total} subscribers
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
											// Show pages around current page
											const minPage = Math.max(1, pagination.page - 2);
											const pageNumber = minPage + i;

											// Only show if page number is valid
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

					{/* Delete Confirmation Dialog */}
					<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
						<DialogContent className="bg-[#0d5559] border-[#63d392]/30 text-white max-w-md">
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2 text-xl">
									<AlertCircle className="h-5 w-5 text-red-400" />
									Confirm Deletion
								</DialogTitle>
								<DialogDescription className="text-gray-300">
									Are you sure you want to delete this subscriber?
									{subscriberToDelete && (
										<div className="mt-2 p-2 bg-[#156469]/50 rounded-md">
											<p className="font-medium text-white break-all">
												{subscriberToDelete.email}
											</p>
										</div>
									)}
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className="flex gap-2 sm:justify-end">
								<Button
									type="button"
									variant="outline"
									className="border-[#63d392]/30 text-white hover:bg-[#156469]/50"
									onClick={() => setDeleteDialogOpen(false)}
									disabled={isDeleting}
								>
									Cancel
								</Button>
								<Button
									type="button"
									className="bg-red-500/80 hover:bg-red-500 text-white"
									onClick={confirmDelete}
									disabled={isDeleting}
								>
									{isDeleting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Deleting...
										</>
									) : (
										'Delete'
									)}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
}

'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
	Search,
	RefreshCcw,
	ChevronLeft,
	ChevronRight,
	Trash2,
	Edit,
	MailCheck,
	MailX,
	Loader2,
} from 'lucide-react';
import { format } from 'date-fns';

interface Subscriber {
	id: string;
	email: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export function NewsletterSubscribers() {
	// State
	const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [actionInProgress, setActionInProgress] = useState(false);

	// Fetch subscribers
	const fetchSubscribers = async () => {
		setLoading(true);
		try {
			// Build query string with filters
			const params = new URLSearchParams();
			params.append('page', page.toString());
			params.append('limit', limit.toString());

			if (search) params.append('search', search);
			if (statusFilter) params.append('status', statusFilter);

			const response = await fetch(
				`/api/admin/newsletter?${params.toString()}`,
			);

			if (!response.ok) {
				throw new Error('Failed to fetch subscribers');
			}

			const data = await response.json();
			setSubscribers(data.subscribers);
			setTotal(data.meta.total);
			setTotalPages(data.meta.totalPages);
		} catch (error) {
			console.error('Error fetching subscribers:', error);
			toast.error('Failed to load subscribers');
		} finally {
			setLoading(false);
		}
	};

	// Initial fetch
	useEffect(() => {
		fetchSubscribers();
	}, [page, statusFilter]);

	// Handle search with debounce
	useEffect(() => {
		const timer = setTimeout(() => {
			if (page === 1) {
				fetchSubscribers();
			} else {
				setPage(1); // This will trigger fetchSubscribers via the dependency
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [search]);

	// Delete subscriber
	const handleDelete = async (id: string) => {
		setActionInProgress(true);
		try {
			const response = await fetch(`/api/admin/newsletter/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete subscriber');
			}

			toast.success('Subscriber deleted successfully');
			fetchSubscribers();
		} catch (error) {
			console.error('Error deleting subscriber:', error);
			toast.error('Failed to delete subscriber');
		} finally {
			setDeleteDialogOpen(false);
			setActionInProgress(false);
		}
	};

	// Update subscriber status
	const handleStatusChange = async (id: string, status: string) => {
		setActionInProgress(true);
		try {
			const response = await fetch(`/api/admin/newsletter/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status }),
			});

			if (!response.ok) {
				throw new Error('Failed to update subscriber status');
			}

			toast.success(
				`Subscriber ${status === 'active' ? 'reactivated' : 'unsubscribed'} successfully`,
			);
			fetchSubscribers();
		} catch (error) {
			console.error('Error updating subscriber:', error);
			toast.error('Failed to update subscriber');
		} finally {
			setActionInProgress(false);
		}
	};

	// Pagination controls
	const handlePrevPage = () => {
		if (page > 1) setPage(page - 1);
	};

	const handleNextPage = () => {
		if (page < totalPages) setPage(page + 1);
	};

	// Format date helper
	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'MMM d, yyyy');
	};

	return (
		<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 shadow-lg overflow-hidden">
			<div className="p-6 border-b border-[#63d392]/20">
				<h2 className="text-xl font-semibold text-white">
					Newsletter Subscribers
				</h2>
				<p className="text-gray-300 text-sm">
					Manage your newsletter subscribers
				</p>
			</div>

			{/* Filters */}
			<div className="p-4 border-b border-[#63d392]/20 bg-[#0d5559]/30 flex flex-col md:flex-row items-center gap-4">
				<div className="relative flex-grow">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Search by email..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9 bg-[#0d5559]/50 border-[#63d392]/30 text-white placeholder:text-gray-400"
					/>
				</div>

				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-[180px] bg-[#0d5559]/50 border-[#63d392]/30 text-white">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent className="bg-[#156469] border-[#63d392]/30 text-white">
						<SelectItem
							value=""
							className="focus:bg-[#63d392]/20 focus:text-white"
						>
							All Statuses
						</SelectItem>
						<SelectItem
							value="active"
							className="focus:bg-[#63d392]/20 focus:text-white"
						>
							Active
						</SelectItem>
						<SelectItem
							value="unsubscribed"
							className="focus:bg-[#63d392]/20 focus:text-white"
						>
							Unsubscribed
						</SelectItem>
					</SelectContent>
				</Select>

				<Button
					onClick={() => fetchSubscribers()}
					variant="outline"
					size="icon"
					className="border-[#63d392]/30 text-[#63d392] hover:bg-[#63d392]/20"
					disabled={loading}
				>
					{loading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<RefreshCcw className="h-4 w-4" />
					)}
				</Button>
			</div>

			{/* Subscribers Table */}
			<div className="relative overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="border-b border-[#63d392]/20 bg-[#0d5559]/30 hover:bg-[#0d5559]/50">
							<TableHead className="text-[#63d392]">Email</TableHead>
							<TableHead className="text-[#63d392]">Status</TableHead>
							<TableHead className="text-[#63d392]">Subscribed Date</TableHead>
							<TableHead className="text-[#63d392]">Last Updated</TableHead>
							<TableHead className="text-[#63d392] text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow className="border-b border-[#63d392]/10 hover:bg-[#0d5559]/30">
								<TableCell colSpan={5} className="text-center py-8 text-white">
									<div className="flex items-center justify-center">
										<Loader2 className="h-6 w-6 animate-spin mr-2" />
										<span>Loading subscribers...</span>
									</div>
								</TableCell>
							</TableRow>
						) : subscribers.length === 0 ? (
							<TableRow className="border-b border-[#63d392]/10 hover:bg-[#0d5559]/30">
								<TableCell colSpan={5} className="text-center py-8 text-white">
									No subscribers found
								</TableCell>
							</TableRow>
						) : (
							subscribers.map((subscriber) => (
								<TableRow
									key={subscriber.id}
									className="border-b border-[#63d392]/10 hover:bg-[#0d5559]/30"
								>
									<TableCell className="font-medium text-white">
										{subscriber.email}
									</TableCell>
									<TableCell>
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												subscriber.status === 'active'
													? 'bg-[#63d392]/20 text-[#63d392]'
													: 'bg-red-400/20 text-red-400'
											}`}
										>
											{subscriber.status === 'active' ? (
												<>
													<MailCheck className="w-3 h-3 mr-1" />
													Active
												</>
											) : (
												<>
													<MailX className="w-3 h-3 mr-1" />
													Unsubscribed
												</>
											)}
										</span>
									</TableCell>
									<TableCell className="text-gray-300">
										{formatDate(subscriber.createdAt)}
									</TableCell>
									<TableCell className="text-gray-300">
										{formatDate(subscriber.updatedAt)}
									</TableCell>
									<TableCell className="text-right space-x-2">
										{subscriber.status === 'active' ? (
											<Button
												onClick={() =>
													handleStatusChange(subscriber.id, 'unsubscribed')
												}
												variant="ghost"
												size="sm"
												className="h-8 text-gray-300 hover:text-white hover:bg-red-500/20"
												disabled={actionInProgress}
											>
												<MailX className="h-4 w-4 mr-1" />
												Unsubscribe
											</Button>
										) : (
											<Button
												onClick={() =>
													handleStatusChange(subscriber.id, 'active')
												}
												variant="ghost"
												size="sm"
												className="h-8 text-gray-300 hover:text-white hover:bg-[#63d392]/20"
												disabled={actionInProgress}
											>
												<MailCheck className="h-4 w-4 mr-1" />
												Reactivate
											</Button>
										)}
										<Button
											onClick={() => {
												setDeleteId(subscriber.id);
												setDeleteDialogOpen(true);
											}}
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-gray-300 hover:text-red-400 hover:bg-red-500/20"
											disabled={actionInProgress}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{!loading && subscribers.length > 0 && (
				<div className="p-4 border-t border-[#63d392]/20 bg-[#0d5559]/30 flex items-center justify-between">
					<div className="text-sm text-gray-300">
						Showing{' '}
						<span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
						<span className="font-medium">{Math.min(page * limit, total)}</span>{' '}
						of <span className="font-medium">{total}</span> subscribers
					</div>
					<div className="flex items-center space-x-2">
						<Button
							onClick={handlePrevPage}
							disabled={page === 1 || loading}
							variant="outline"
							size="icon"
							className="h-8 w-8 border-[#63d392]/30 text-white hover:bg-[#63d392]/20"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="text-sm text-white">
							Page {page} of {totalPages || 1}
						</span>
						<Button
							onClick={handleNextPage}
							disabled={page === totalPages || loading}
							variant="outline"
							size="icon"
							className="h-8 w-8 border-[#63d392]/30 text-white hover:bg-[#63d392]/20"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent className="bg-[#156469] border border-[#63d392]/30 text-white">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-white">
							Delete Subscriber
						</AlertDialogTitle>
						<AlertDialogDescription className="text-gray-300">
							Are you sure you want to delete this subscriber? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							className="bg-transparent border border-[#63d392]/30 text-white hover:bg-[#0d5559]/50"
							disabled={actionInProgress}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => deleteId && handleDelete(deleteId)}
							className="bg-red-500/80 hover:bg-red-500 text-white"
							disabled={actionInProgress}
						>
							{actionInProgress ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								<>Delete</>
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

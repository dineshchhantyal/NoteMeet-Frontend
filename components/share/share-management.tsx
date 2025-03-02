'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShareMeetingDialog } from './share-meeting-dialog';
import { MeetingInterface } from '@/types';
import { toast } from 'sonner';
import { Mail, Trash2, Share2, RefreshCw } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
import { formatDistanceToNow } from 'date-fns';

// Updated interface to align with actual MeetingShare model
interface ShareUser {
	id: string;
	meetingId: string;
	email: string;
	permission: 'VIEW' | 'EDIT' | 'ADMIN';
	status: 'pending' | 'accepted' | 'rejected';
	token: string;
	createdBy: string;
	createdAt?: string; // Prisma automatically adds this
	updatedAt?: string; // Prisma automatically adds this
	lastAccessAt?: string | null;
}

interface ShareManagementProps {
	meeting: MeetingInterface;
}

export function ShareManagement({ meeting }: ShareManagementProps) {
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
	const [shareUsers, setShareUsers] = useState<ShareUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	// Load share users
	const loadShareUsers = async () => {
		try {
			setLoading(true);
			const response = await fetch(`/api/meetings/${meeting.id}/share`);

			if (!response.ok) {
				throw new Error(`Failed to load shared users: ${response.status}`);
			}

			const data = await response.json();

			if (!data.shares) {
				throw new Error('Invalid response format');
			}

			setShareUsers(data.shares);
		} catch (error) {
			console.error('Error loading shared users:', error);
			toast.error('Failed to load sharing information');
		} finally {
			setLoading(false);
		}
	};

	// Load on component mount
	useEffect(() => {
		if (meeting.id) {
			loadShareUsers();
		}
	}, [meeting.id]);

	// Update share permission
	const updateSharePermission = async (shareId: string, permission: string) => {
		try {
			if (!shareId) {
				throw new Error('Share ID is required');
			}

			const response = await fetch(
				`/api/meetings/${meeting.id}/share/${shareId}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ permission }),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to update permission');
			}

			toast.success('Permission updated successfully');

			// Update local state
			setShareUsers((prev) =>
				prev.map((user) =>
					user.id === shareId
						? { ...user, permission: permission as ShareUser['permission'] }
						: user,
				),
			);
		} catch (error) {
			console.error('Error updating permission:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to update permission',
			);
		}
	};

	// Delete share
	const deleteShare = async () => {
		if (!deleteId) return;

		try {
			const response = await fetch(
				`/api/meetings/${meeting.id}/share/${deleteId}`,
				{
					method: 'DELETE',
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to remove share');
			}

			toast.success('Share removed successfully');

			// Update local state
			setShareUsers((prev) => prev.filter((user) => user.id !== deleteId));
		} catch (error) {
			console.error('Error removing share:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to remove share',
			);
		} finally {
			setDeleteId(null);
		}
	};

	const refreshShares = async () => {
		setRefreshing(true);
		await loadShareUsers();
		setRefreshing(false);
	};

	const getPermissionLabel = (permission: string) => {
		switch (permission) {
			case 'VIEW':
				return 'View only';
			case 'EDIT':
				return 'Can edit';
			case 'ADMIN':
				return 'Admin access';
			default:
				return 'Unknown';
		}
	};

	const getStatusBadgeClass = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30';
			case 'accepted':
				return 'bg-[#63d392]/20 text-[#63d392] border-[#63d392]/30';
			case 'rejected':
				return 'bg-red-500/10 text-red-400 border-red-500/30';
			default:
				return 'bg-[#0d5559]/50 text-gray-300 border-[#63d392]/20';
		}
	};

	const handleShareSubmit = async (email: string, permission: string) => {
		try {
			// Close the dialog first to improve UX
			setIsShareDialogOpen(false);

			const response = await fetch(`/api/meetings/${meeting.id}/share`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, permission }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to share meeting');
			}

			toast.success('Meeting shared successfully');

			// Refresh the shares list
			await loadShareUsers();
		} catch (error) {
			console.error('Error sharing meeting:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to share meeting',
			);
		}
	};

	return (
		<>
			<Card className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 text-white shadow-md">
				<CardHeader className="border-b border-[#63d392]/20 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<CardTitle className="text-lg font-semibold text-white">
						Shared With
					</CardTitle>
					<div className="flex gap-2 w-full sm:w-auto">
						<Button
							variant="outline"
							size="sm"
							onClick={refreshShares}
							disabled={refreshing}
							className="bg-transparent border-[#63d392]/30 text-white hover:bg-[#0d5559]/50"
						>
							<RefreshCw
								className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
							/>
						</Button>
						<Button
							onClick={() => setIsShareDialogOpen(true)}
							size="sm"
							className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#63d392]/80 flex-1 sm:flex-none"
						>
							<Share2 className="mr-1 h-4 w-4" />
							Share
						</Button>
					</div>
				</CardHeader>

				<CardContent className="pt-4">
					{loading ? (
						<div className="flex justify-center py-6">
							<RefreshCw className="h-6 w-6 animate-spin text-[#63d392]/70" />
						</div>
					) : shareUsers.length === 0 ? (
						<div className="text-center py-6 sm:py-8 text-gray-400">
							<Mail className="h-10 w-10 sm:h-12 sm:w-12 mx-auto opacity-20 mb-3" />
							<h3 className="text-base sm:text-lg font-medium text-gray-300">
								Not shared yet
							</h3>
							<p className="mt-2 text-xs sm:text-sm px-4">
								Share this meeting with others to collaborate.
							</p>
							<Button
								onClick={() => setIsShareDialogOpen(true)}
								className="mt-4 bg-[#63d392]/80 text-[#0a4a4e] hover:bg-[#63d392]"
							>
								<Share2 className="mr-2 h-4 w-4" />
								Share Meeting
							</Button>
						</div>
					) : (
						<div className="space-y-3">
							{shareUsers.map((user) => (
								<div
									key={user.id}
									className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 px-3 rounded-md bg-[#0d5559]/40 border border-[#63d392]/10 gap-3"
								>
									<div className="w-full sm:w-auto">
										<div className="flex flex-wrap items-center gap-2 mb-1">
											<span className="font-medium text-sm sm:text-base max-w-[200px] sm:max-w-none truncate">
												{user.email}
											</span>
											<Badge
												className={`${getStatusBadgeClass(user.status)} text-xs`}
											>
												{user.status === 'pending'
													? 'Pending'
													: user.status === 'accepted'
														? 'Accepted'
														: 'Rejected'}
											</Badge>
										</div>
										<p className="text-xs text-gray-400">
											{user.lastAccessAt
												? `Last access: ${formatDistanceToNow(new Date(user.lastAccessAt), { addSuffix: true })}`
												: 'Never accessed'}
										</p>
									</div>

									<div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
										<Select
											value={user.permission}
											onValueChange={(value) =>
												updateSharePermission(user.id, value)
											}
										>
											<SelectTrigger className="bg-[#156469]/50 border-[#63d392]/20 h-8 w-full sm:w-32 text-xs sm:text-sm">
												<SelectValue
													placeholder={getPermissionLabel(user.permission)}
												/>
											</SelectTrigger>
											<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
												<SelectItem value="VIEW">View only</SelectItem>
												<SelectItem value="EDIT">Can edit</SelectItem>
												<SelectItem value="ADMIN">Admin access</SelectItem>
											</SelectContent>
										</Select>

										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/20"
											onClick={() => setDeleteId(user.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Share Dialog */}
			<ShareMeetingDialog
				meetingId={meeting.id}
				isOpen={isShareDialogOpen}
				onClose={() => setIsShareDialogOpen(false)}
				onShare={handleShareSubmit}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}
			>
				<AlertDialogContent className="bg-[#0d5559] border-[#63d392]/30 text-white max-w-[90vw] sm:max-w-lg">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-white">
							Remove Shared Access
						</AlertDialogTitle>
						<AlertDialogDescription className="text-gray-300">
							Are you sure you want to remove this user&apos;s access to the
							meeting? They will no longer be able to view or interact with this
							meeting.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="bg-[#156469]/50 border-[#63d392]/30 text-white hover:bg-[#156469]/70 hover:text-white">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={deleteShare}
							className="bg-red-500/80 text-white hover:bg-red-500"
						>
							Remove Access
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

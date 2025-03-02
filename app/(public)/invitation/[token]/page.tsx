'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Users,
	Calendar,
	Clock,
	Check,
	X,
	Loader2,
	ExternalLink,
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Types
import { MeetingInterface } from '@/types';
import { MeetingStatus } from '@/types/meeting';

export default function InvitationPage({
	params,
}: {
	params: { token: string };
}) {
	const [meeting, setMeeting] = useState<MeetingInterface | null>(null);
	const [loading, setLoading] = useState(true);
	const [accepting, setAccepting] = useState(false);
	const [rejecting, setRejecting] = useState(false);
	const [invitationDetails, setInvitationDetails] = useState<{
		email: string;
		permission: string;
		status: string;
	} | null>(null);
	const [expired, setExpired] = useState(false);

	const router = useRouter();
	const { token } = params;

	// Helper functions
	const getStatusColor = (status: MeetingStatus) => {
		switch (status) {
			case MeetingStatus.Completed:
				return 'bg-[#63d392]/20 text-[#63d392] border-[#63d392]/30';
			case MeetingStatus.InProgress:
				return 'bg-[#156469]/30 text-[#63d392] border-[#156469]/50';
			case MeetingStatus.Scheduled:
				return 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30';
			case MeetingStatus.Cancelled:
				return 'bg-red-500/10 text-red-400 border-red-500/30';
			default:
				return 'bg-[#0d5559]/50 text-gray-300 border-[#63d392]/20';
		}
	};

	const formatDate = (dateStr: string) => {
		if (!dateStr) return 'Date not set';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const formatTime = (timeStr: string) => {
		return timeStr || 'Time not set';
	};

	// Fetch meeting details using token
	useEffect(() => {
		const fetchMeetingDetails = async () => {
			setLoading(true);
			try {
				const response = await fetch(`/api/shares/${token}`);

				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.error || 'Failed to load meeting details');
				}

				const data = await response.json();

				// Check if share is expired
				const shareCreatedAt = new Date(data.share.createdAt);
				const currentDate = new Date();
				const daysSinceCreation = Math.floor(
					(currentDate.getTime() - shareCreatedAt.getTime()) /
						(1000 * 60 * 60 * 24),
				);

				if (daysSinceCreation > 7) {
					// Links expire after 7 days
					setExpired(true);
					throw new Error('This invitation link has expired');
				}

				setMeeting(data.meeting);
				setInvitationDetails({
					email: data.share.email,
					permission: data.share.permission,
					status: data.share.status,
				});
			} catch (error) {
				console.error('Error fetching meeting details:', error);
				toast.error(
					error instanceof Error
						? error.message
						: 'Failed to load meeting details',
				);
			} finally {
				setLoading(false);
			}
		};

		fetchMeetingDetails();
	}, [token]);

	// Handle accept invitation
	const handleAccept = async () => {
		setAccepting(true);
		try {
			const response = await fetch(`/api/shares/${token}/accept`, {
				method: 'POST',
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to accept invitation');
			}

			toast.success('Invitation accepted successfully');
			// Redirect to meeting page
			router.push(`/dashboard`);
		} catch (error) {
			console.error('Error accepting invitation:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to accept invitation',
			);
			setAccepting(false);
		}
	};

	// Handle reject invitation
	const handleReject = async () => {
		setRejecting(true);
		try {
			const response = await fetch(`/api/shares/${token}/reject`, {
				method: 'POST',
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to reject invitation');
			}

			toast.success('Invitation rejected');
			// Redirect to dashboard
			router.push('/dashboard');
		} catch (error) {
			console.error('Error rejecting invitation:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to reject invitation',
			);
			setRejecting(false);
		}
	};

	// Get permission badge color
	const getPermissionBadge = (permission: string) => {
		switch (permission) {
			case 'VIEW':
				return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
			case 'EDIT':
				return 'bg-[#63d392]/20 text-[#63d392] border-[#63d392]/30';
			case 'ADMIN':
				return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
			default:
				return 'bg-[#0d5559]/50 text-gray-300 border-[#63d392]/20';
		}
	};

	return (
		<div className="flex min-h-screen bg-[#0a4a4e] overflow-auto">
			{/* Background gradient elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				<div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#63d392]/5 rounded-full blur-[120px]"></div>
				<div className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] bg-[#156469]/20 rounded-full blur-[150px]"></div>
				<div className="absolute top-[40%] right-[15%] w-64 h-64 bg-[#63d392]/8 rounded-full blur-[100px]"></div>
			</div>

			{/* Main content */}
			<div className="flex flex-col items-center justify-center w-full py-10 px-4 md:px-6 relative z-10">
				<div className="max-w-xl w-full">
					<div className="flex flex-col items-center mb-6">
						<div className="bg-[#63d392]/10 p-4 rounded-full mb-4">
							<Users className="h-8 w-8 text-[#63d392]" />
						</div>
						<h1 className="text-2xl font-semibold text-white mb-2">
							Meeting Invitation
						</h1>
						<p className="text-gray-300 text-center">
							You&apos;ve been invited to join a meeting in NoteMeet
						</p>
					</div>

					{loading ? (
						<Card className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 text-white shadow-lg">
							<CardHeader className="border-b border-[#63d392]/20">
								<Skeleton className="h-7 w-3/4 bg-[#0d5559]/70" />
							</CardHeader>
							<CardContent className="py-6 space-y-4">
								<div className="flex items-center gap-4">
									<Skeleton className="h-12 w-12 rounded-md bg-[#0d5559]/70" />
									<div className="space-y-2 flex-1">
										<Skeleton className="h-5 w-full bg-[#0d5559]/70" />
										<Skeleton className="h-4 w-1/2 bg-[#0d5559]/50" />
									</div>
								</div>
								<Skeleton className="h-20 w-full bg-[#0d5559]/50" />
								<div className="flex items-center justify-between mt-4">
									<Skeleton className="h-10 w-28 bg-[#0d5559]/70 rounded-md" />
									<Skeleton className="h-10 w-28 bg-[#0d5559]/70 rounded-md" />
								</div>
							</CardContent>
						</Card>
					) : expired ? (
						<Card className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 text-white shadow-lg">
							<CardContent className="py-8 text-center">
								<div className="bg-amber-500/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
									<Clock className="h-8 w-8 text-amber-400" />
								</div>
								<h2 className="text-xl font-semibold mb-2">
									Invitation Expired
								</h2>
								<p className="text-gray-300 mb-6">
									This invitation link has expired. Please ask the meeting owner
									to generate a new invitation.
								</p>
								<Button
									onClick={() => router.push('/dashboard')}
									className="bg-[#156469]/50 border-[#63d392]/30 text-white hover:bg-[#156469]/70"
								>
									Return to Dashboard
								</Button>
							</CardContent>
						</Card>
					) : meeting ? (
						<Card className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 text-white shadow-lg overflow-hidden">
							<CardHeader className="border-b border-[#63d392]/20 py-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="bg-[#0d5559]/70 p-2.5 rounded-md">
											<Calendar className="h-5 w-5 text-[#63d392]" />
										</div>
										<div>
											<CardTitle className="text-lg font-semibold text-white flex items-center gap-2 flex-wrap">
												{meeting.title}
												<Badge
													variant="outline"
													className={`${getStatusColor(meeting.status as MeetingStatus)}`}
												>
													{MeetingStatus[meeting.status as MeetingStatus] ||
														'Unknown'}
												</Badge>
											</CardTitle>
										</div>
									</div>
								</div>
							</CardHeader>

							<CardContent className="py-4">
								{invitationDetails && (
									<div className="mb-4 pb-4 border-b border-[#63d392]/10">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-gray-300">Invited as</p>
												<p className="text-white font-medium">
													{invitationDetails.email}
												</p>
											</div>
											<Badge
												variant="outline"
												className={getPermissionBadge(
													invitationDetails.permission,
												)}
											>
												{invitationDetails.permission === 'VIEW'
													? 'View Only'
													: invitationDetails.permission === 'EDIT'
														? 'Can Edit'
														: 'Admin Access'}
											</Badge>
										</div>
									</div>
								)}

								<div className="space-y-4">
									<div className="flex items-center gap-3 flex-wrap">
										<div className="bg-[#0d5559]/40 px-3 py-1.5 rounded-full flex items-center">
											<Calendar className="h-3.5 w-3.5 text-[#63d392] mr-1.5" />
											<span className="text-xs">
												{formatDate(meeting.date)}
											</span>
										</div>

										<div className="bg-[#0d5559]/40 px-3 py-1.5 rounded-full flex items-center">
											<Clock className="h-3.5 w-3.5 text-[#63d392] mr-1.5" />
											<span className="text-xs">
												{formatTime(meeting.time)}
											</span>
										</div>

										{meeting.participants && (
											<div className="bg-[#0d5559]/40 px-3 py-1.5 rounded-full flex items-center">
												<Users className="h-3.5 w-3.5 text-[#63d392] mr-1.5" />
												<span className="text-xs">
													{meeting.participants.length} participants
												</span>
											</div>
										)}
									</div>

									{/* Description */}
									<div className="mt-3 pt-3 border-t border-[#63d392]/10">
										<div className="text-xs text-gray-300 mb-1">
											Description
										</div>
										<p className="text-sm text-gray-100">
											{meeting.description ||
												'No description available for this meeting.'}
										</p>
									</div>

									{/* Meeting owner section - commented out due to missing fields */}
									{/* <div className="flex items-center gap-3 mt-4">
                    <Avatar className="h-8 w-8 bg-[#0d5559]/70 border border-[#63d392]/30">
                      <AvatarFallback className="text-sm text-[#63d392]">
                        {meeting.user?.name?.substring(0, 2) || 'UN'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-gray-300">Created by</p>
                      <p className="text-white font-medium">
                        {meeting.user?.name || meeting.createdBy || 'Unknown'}
                      </p>
                    </div>
                  </div> */}

									{/* Action buttons */}
									{invitationDetails?.status === 'pending' ? (
										<div className="flex flex-col sm:flex-row gap-3 pt-6">
											<Button
												onClick={handleAccept}
												disabled={accepting}
												className="flex-1 bg-[#63d392] text-[#0a4a4e] hover:bg-[#63d392]/80"
											>
												{accepting ? (
													<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												) : (
													<Check className="h-4 w-4 mr-2" />
												)}
												Accept Invitation
											</Button>

											<Button
												onClick={handleReject}
												disabled={rejecting}
												variant="outline"
												className="flex-1 bg-transparent border-[#63d392]/30 text-white hover:bg-[#0d5559]/50"
											>
												{rejecting ? (
													<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												) : (
													<X className="h-4 w-4 mr-2" />
												)}
												Decline
											</Button>
										</div>
									) : (
										<div className="mt-6">
											<Badge
												className={
													invitationDetails?.status === 'accepted'
														? 'bg-[#63d392]/20 text-[#63d392] border-[#63d392]/30'
														: 'bg-red-500/10 text-red-400 border-red-500/30'
												}
											>
												{invitationDetails?.status === 'accepted'
													? 'Accepted'
													: 'Declined'}
											</Badge>

											{invitationDetails?.status === 'accepted' && (
												<Button
													onClick={() => router.push(`/dashboard`)}
													className="w-full mt-4 bg-[#63d392] text-[#0a4a4e] hover:bg-[#63d392]/80"
												>
													<ExternalLink className="h-4 w-4 mr-2" />
													Go to Dashboard
												</Button>
											)}
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					) : (
						<Card className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 text-white shadow-lg">
							<CardContent className="py-8 text-center">
								<div className="bg-red-500/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
									<X className="h-8 w-8 text-red-400" />
								</div>
								<h2 className="text-xl font-semibold mb-2">
									Invalid Invitation
								</h2>
								<p className="text-gray-300 mb-6">
									This invitation link appears to be invalid or has expired.
								</p>
								<Button
									onClick={() => router.push('/dashboard')}
									className="bg-[#156469]/50 border-[#63d392]/30 text-white hover:bg-[#156469]/70"
								>
									Return to Dashboard
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}

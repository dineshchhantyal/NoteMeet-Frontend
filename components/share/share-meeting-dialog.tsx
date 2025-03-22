'use client';

import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowRight, Copy, Mail, Check, RefreshCw } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface ShareMeetingDialogProps {
	meetingId: string;
	isOpen: boolean;
	onClose: () => void;
	onShare: (email: string, permission: string) => void;
}

export function ShareMeetingDialog({
	meetingId,
	isOpen,
	onClose,
}: ShareMeetingDialogProps) {
	const [email, setEmail] = useState('');
	const [permission, setPermission] = useState('VIEW');
	const [isLoading, setIsLoading] = useState(false);
	const [copied, setCopied] = useState(false);
	const [showLinkOption, setShowLinkOption] = useState(false);
	const [shareToken, setShareToken] = useState<string | null>(null);

	useEffect(() => {
		if (showLinkOption && !shareToken) {
			generateShareLink();
		}
	}, [showLinkOption]);

	const generateShareLink = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`/api/meetings/${meetingId}/share/link`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ permission }),
			});

			if (!response.ok) {
				throw new Error('Failed to generate share link');
			}

			const data = await response.json();
			setShareToken(data.token);
		} catch (error) {
			console.error('Error generating share link:', error);
			toast.error('Failed to generate share link');
		} finally {
			setIsLoading(false);
		}
	};

	const shareLink = shareToken
		? `${window.location.origin}/invitation/${shareToken}`
		: '';

	const formatLinkForDisplay = (url: string) => {
		if (!url) return '';

		try {
			const urlObj = new URL(url);
			const token = urlObj.pathname.split('/').pop() || '';

			// Show only a small part of the token
			const shortToken =
				token.length > 8
					? `${token.substring(0, 4)}...${token.substring(token.length - 4)}`
					: token;

			return `Invitation: ${shortToken}`;
		} catch (e) {
			// Fallback for invalid URLs
			console.error(e);
			return 'Click to copy link';
		}
	};

	const handleShare = async () => {
		if (!email || isLoading) {
			toast.error('Please enter an email address');
			return;
		}

		try {
			setIsLoading(true);

			const response = await fetch(`/api/meetings/${meetingId}/share`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, permission }),
			});

			if (!response.ok) {
				const data = await response.json();
				toast.error(data.error || 'Failed to share meeting');
				return;
			}

			toast.success(`Meeting shared with ${email}`);
			setEmail('');
			// Small timeout to prevent dialog state conflicts
			setTimeout(() => {
				onClose();
			}, 100);
		} catch (error) {
			console.error('Share error:', error);
			toast.error('Failed to share meeting');
		} finally {
			setIsLoading(false);
		}
	};

	const copyLink = () => {
		navigator.clipboard.writeText(shareLink);
		setCopied(true);
		toast.success('Share link copied to clipboard');

		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="bg-[#0d5559] border-[#63d392]/30 text-white sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-white">Share Meeting</DialogTitle>
					<DialogDescription className="text-gray-300">
						Invite others to access this meeting and its resources.
					</DialogDescription>
				</DialogHeader>

				<div className="flex gap-2 mt-2">
					<Button
						variant="outline"
						size="sm"
						className={`flex-1 ${!showLinkOption ? 'bg-[#156469]/50' : 'bg-transparent'} border-[#63d392]/30 text-white hover:bg-[#156469]/70`}
						onClick={() => setShowLinkOption(false)}
					>
						<Mail className="mr-2 h-4 w-4" />
						Email
					</Button>
					<Button
						variant="outline"
						size="sm"
						className={`flex-1 ${showLinkOption ? 'bg-[#156469]/50' : 'bg-transparent'} border-[#63d392]/30 text-white hover:bg-[#156469]/70`}
						onClick={() => setShowLinkOption(true)}
					>
						<Copy className="mr-2 h-4 w-4" />
						Link
					</Button>
				</div>

				{!showLinkOption ? (
					<div className="space-y-4 py-2">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-white">
								Email address
							</Label>
							<Input
								id="email"
								placeholder="colleague@example.com"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="bg-[#156469]/50 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="permission" className="text-white">
								Permission level
							</Label>
							<Select value={permission} onValueChange={setPermission}>
								<SelectTrigger className="bg-[#156469]/50 border-[#63d392]/30 text-white">
									<SelectValue placeholder="Select permission" />
								</SelectTrigger>
								<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
									<SelectItem value="VIEW">View only</SelectItem>
									<SelectItem value="EDIT">Can edit</SelectItem>
									<SelectItem value="ADMIN">Admin access</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-xs text-gray-400 mt-1">
								{permission === 'VIEW'
									? 'Can view meeting details and transcripts, but cannot make changes.'
									: permission === 'EDIT'
										? 'Can edit meeting details and add notes.'
										: 'Full access to manage the meeting, including sharing permissions.'}
							</p>
						</div>
					</div>
				) : (
					<div className="space-y-4 py-2">
						<div className="space-y-2">
							<Label className="text-white">Shareable link</Label>
							<div className="flex gap-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="bg-[#156469]/50 border border-[#63d392]/30 rounded-md px-3 py-2 text-sm text-white flex-1 truncate cursor-default">
												{isLoading
													? 'Generating...'
													: formatLinkForDisplay(shareLink)}
											</div>
										</TooltipTrigger>
										<TooltipContent className="max-w-md bg-[#0d5559] text-white border-[#63d392]/20 p-2">
											<p className="text-xs break-all">
												{shareLink || 'Generating...'}
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<div className="flex gap-1">
									<Button
										onClick={generateShareLink}
										size="sm"
										variant="outline"
										className="border-[#63d392]/30 text-[#63d392] bg-[#156469]/70 hover:bg-[#156469] hover:text-white"
										disabled={isLoading}
									>
										{isLoading ? (
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
										) : (
											<RefreshCw className="h-4 w-4" />
										)}
									</Button>
									<Button
										onClick={copyLink}
										size="sm"
										variant="outline"
										className={`border-[#63d392]/30 ${
											copied
												? 'bg-[#63d392]/40 text-[#63d392] hover:bg-[#63d392]/50'
												: 'bg-[#156469]/70 text-[#63d392] hover:bg-[#156469] hover:text-white'
										}`}
										disabled={!shareToken || isLoading}
									>
										{copied ? (
											<Check className="h-4 w-4" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="link-permission" className="text-white">
								Permission level
							</Label>
							<Select value={permission} onValueChange={setPermission}>
								<SelectTrigger
									id="link-permission"
									className="bg-[#156469]/50 border-[#63d392]/30 text-white"
								>
									<SelectValue placeholder="Select permission" />
								</SelectTrigger>
								<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
									<SelectItem value="VIEW">View only</SelectItem>
									<SelectItem value="EDIT">Can edit</SelectItem>
									<SelectItem value="ADMIN">Admin access</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<p className="text-xs text-gray-400 mt-1">
							Anyone with the link can request access with the selected
							permission level. You&apos;ll still need to approve their request.
						</p>
					</div>
				)}

				<DialogFooter className="sm:justify-between">
					<Button
						variant="outline"
						onClick={onClose}
						className="bg-transparent border-[#63d392]/30 text-white hover:bg-[#156469]/50"
					>
						Cancel
					</Button>

					{!showLinkOption && (
						<Button
							onMouseDown={(e) => {
								e.preventDefault(); // Prevent any default behavior
								if (!isLoading) handleShare();
							}}
							disabled={!email || isLoading}
							className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#63d392]/80"
						>
							{isLoading ? (
								<div className="flex items-center">
									<div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
									Sharing...
								</div>
							) : (
								<>
									Share <ArrowRight className="ml-2 h-4 w-4" />
								</>
							)}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

'use client';

import { useState } from 'react';
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
import { ArrowRight, Copy, Mail, Check } from 'lucide-react';
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
	onShare,
}: ShareMeetingDialogProps) {
	const [email, setEmail] = useState('');
	const [permission, setPermission] = useState('VIEW');
	const [isLoading, setIsLoading] = useState(false);
	const [copied, setCopied] = useState(false);
	const [showLinkOption, setShowLinkOption] = useState(false);

	// Create a sharing link
	const shareLink = `${window.location.origin}/invitation/${meetingId}?permission=${permission}`;

	// Format link for display with more aggressive truncation
	const formatLinkForDisplay = (url: string) => {
		if (!url) return '';

		try {
			const urlObj = new URL(url);
			const origin = urlObj.origin.replace(/^https?:\/\//, ''); // Remove protocol
			const pathParts = urlObj.pathname.split('/').filter(Boolean);
			const lastPath =
				pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';

			// For very small screens, be even more aggressive with truncation
			if (window.innerWidth < 400) {
				return `${origin.split('.')[0]}.../${lastPath}`;
			}

			// Medium truncation for normal mobile screens
			if (window.innerWidth < 640) {
				return `${origin.split('.')[0]}.../.../${lastPath}`;
			}

			// Standard truncation for larger screens
			return `${origin}/.../${lastPath}${urlObj.search ? '?...' : ''}`;
		} catch (e) {
			// Fallback for invalid URLs
			console.error(e);
			return url.length > 25 ? url.substring(0, 22) + '...' : url;
		}
	};

	const handleShare = async () => {
		if (!email) {
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
				throw new Error(data.error || 'Failed to share meeting');
			}

			toast.success(`Meeting shared with ${email}`);
			setEmail('');
			onShare(email, permission);
			onClose();
		} catch {
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
												{formatLinkForDisplay(shareLink)}
											</div>
										</TooltipTrigger>
										<TooltipContent className="max-w-md bg-[#0d5559] text-white border-[#63d392]/20 p-2">
											<p className="text-xs break-all">{shareLink}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<Button
									onClick={copyLink}
									size="sm"
									variant="outline"
									className={`border-[#63d392]/30 ${copied ? 'bg-[#63d392]/20 text-[#63d392]' : 'text-gray-700'} hover:bg-[#156469]/70`}
								>
									{copied ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
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
							onClick={handleShare}
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

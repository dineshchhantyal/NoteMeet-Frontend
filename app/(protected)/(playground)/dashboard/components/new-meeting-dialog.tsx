'use client';

import { useState, useEffect } from 'react';
import {
	Calendar,
	Plus,
	X,
	Loader2,
	Mail,
	Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { MeetingInterface } from '@/types';
import { MeetingStatus } from '@/types/meeting';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface NewMeetingDialogProps {
	onMeetingCreated: (meeting: MeetingInterface) => void;
	children?: React.ReactNode;
}

const MEETING_PROVIDERS = [
	{ id: 'google-meet', name: 'Google Meet', logo: '/google-meet-logo.svg' },
	{ id: 'teams', name: 'Microsoft Teams', logo: '/ms-teams-logo.svg' },
	{ id: 'zoom', name: 'Zoom', logo: '/zoom-logo.svg' },
];

export function NewMeetingDialog({
	onMeetingCreated,
	children,
}: NewMeetingDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [participants, setParticipants] = useState<string[]>([]);
	const [currentEmail, setCurrentEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const { toast } = useToast();

	// Reset form when dialog opens/closes
	useEffect(() => {
		if (!open) {
			setParticipants([]);
			setCurrentEmail('');
			setEmailError('');
			setFormErrors({});
		}
	}, [open]);

	const validateEmail = (email: string) => {
		return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
	};

	const handleAddParticipant = () => {
		if (!currentEmail) {
			setEmailError('Email is required');
			return;
		}
		if (!validateEmail(currentEmail)) {
			setEmailError('Please enter a valid email');
			return;
		}
		if (participants.includes(currentEmail)) {
			setEmailError('This email has already been added');
			return;
		}
		setParticipants([...participants, currentEmail]);
		setCurrentEmail('');
		setEmailError('');
	};

	const handleRemoveParticipant = (email: string) => {
		setParticipants(participants.filter((p) => p !== email));
	};

	const validateForm = (formData: FormData): boolean => {
		const errors: Record<string, string> = {};

		// Required fields validation
		const requiredFields = ['title', 'date', 'time', 'duration'];
		requiredFields.forEach((field) => {
			if (!formData.get(field)) {
				errors[field] =
					`${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
			}
		});

		// Meeting link validation if provider is selected
		const provider = formData.get('provider') as string;
		if (provider && !formData.get('meetingLink')) {
			errors.meetingLink = 'Meeting link is required when provider is selected';
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);

		// Validate form
		if (!validateForm(formData)) {
			toast({
				title: 'Validation Error',
				description: 'Please check the form for errors',
				variant: 'destructive',
			});
			return;
		}

		setIsSubmitting(true);

		const meetingData: MeetingInterface = {
			id: Math.random().toString(36).substr(2, 9),
			title: formData.get('title') as string,
			date: formData.get('date') as string,
			time: formData.get('time') as string,
			duration: formData.get('duration') as string,
			description: formData.get('description') as string,
			provider: formData.get('provider') as 'zoom' | 'teams' | 'google-meet',
			meetingLink: formData.get('meetingLink') as string,
			participants,
			notifications: {
				sendTranscript: formData.get('sendTranscript') === 'on',
				sendSummary: formData.get('sendSummary') === 'on',
			},
			status: MeetingStatus.Scheduled,
		};

		try {
			const res = await fetch('/api/meetings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(meetingData),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Failed to create meeting');
			}

			const createdMeeting = await res.json();

			toast({
				title: 'Success!',
				description: 'Meeting created successfully',
				variant: 'default',
			});

			onMeetingCreated(createdMeeting.data);
			setOpen(false);
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to create meeting',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children || (
					<Button className="bg-[#63d392] hover:bg-[#4eb97b] text-[#0a4a4e] font-medium">
						<Calendar className="mr-2 h-4 w-4" />
						New Meeting
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] bg-[#0d5559]/95 border-[#63d392]/20 text-white backdrop-blur-md shadow-xl">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="text-white">
							Schedule New Meeting
						</DialogTitle>
						<DialogDescription className="text-gray-300">
							Fill in the details below to schedule a new meeting.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="title" className="text-gray-200">
								Meeting Title
							</Label>
							<Input
								id="title"
								name="title"
								placeholder="Enter meeting title"
								required
								className={cn(
									'bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50',
									formErrors.title && 'border-red-500',
								)}
							/>
							{formErrors.title && (
								<p className="text-xs text-red-400">{formErrors.title}</p>
							)}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="date" className="text-gray-200">
									Date
								</Label>
								<Input
									id="date"
									name="date"
									type="date"
									required
									className={cn(
										'bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50',
										formErrors.date && 'border-red-500',
									)}
								/>
								{formErrors.date && (
									<p className="text-xs text-red-400">{formErrors.date}</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="time" className="text-gray-200">
									Time
								</Label>
								<Input
									id="time"
									name="time"
									type="time"
									required
									className={cn(
										'bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50',
										formErrors.time && 'border-red-500',
									)}
								/>
								{formErrors.time && (
									<p className="text-xs text-red-400">{formErrors.time}</p>
								)}
							</div>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="duration" className="text-gray-200">
								Duration
							</Label>
							<Select name="duration" required>
								<SelectTrigger
									className={cn(
										'bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus:ring-[#63d392]/30 focus:border-[#63d392]/50',
										formErrors.duration && 'border-red-500',
									)}
								>
									<SelectValue placeholder="Select meeting duration" />
								</SelectTrigger>
								<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
									<SelectItem value="15m" className="hover:bg-[#156469]/60">
										15 minutes
									</SelectItem>
									<SelectItem value="30m" className="hover:bg-[#156469]/60">
										30 minutes
									</SelectItem>
									<SelectItem value="45m" className="hover:bg-[#156469]/60">
										45 minutes
									</SelectItem>
									<SelectItem value="1h" className="hover:bg-[#156469]/60">
										1 hour
									</SelectItem>
									<SelectItem value="1h30m" className="hover:bg-[#156469]/60">
										1.5 hours
									</SelectItem>
									<SelectItem value="2h" className="hover:bg-[#156469]/60">
										2 hours
									</SelectItem>
								</SelectContent>
							</Select>
							{formErrors.duration && (
								<p className="text-xs text-red-400">{formErrors.duration}</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="provider" className="text-gray-200">
								Meeting Provider
							</Label>
							<Select name="provider">
								<SelectTrigger className="bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus:ring-[#63d392]/30 focus:border-[#63d392]/50">
									<SelectValue placeholder="Select meeting provider" />
								</SelectTrigger>
								<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
									{MEETING_PROVIDERS.map((provider) => (
										<SelectItem
											key={provider.id}
											value={provider.id}
											className="hover:bg-[#156469]/60"
										>
											{provider.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label
								htmlFor="meetingLink"
								className="text-gray-200 flex items-center"
							>
								<LinkIcon className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
								Meeting Link
							</Label>
							<Input
								id="meetingLink"
								name="meetingLink"
								placeholder="Paste your meeting link here"
								className={cn(
									'bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50',
									formErrors.meetingLink && 'border-red-500',
								)}
							/>
							{formErrors.meetingLink && (
								<p className="text-xs text-red-400">{formErrors.meetingLink}</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label className="text-gray-200 flex items-center">
								<Mail className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
								Participants
							</Label>
							<div className="flex gap-2">
								<Input
									value={currentEmail}
									onChange={(e) => {
										setCurrentEmail(e.target.value);
										setEmailError('');
									}}
									placeholder="Enter participant email"
									className={cn(
										'bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50',
										emailError && 'border-red-500',
									)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											handleAddParticipant();
										}
									}}
								/>
								<Button
									type="button"
									onClick={handleAddParticipant}
									className="bg-[#156469] hover:bg-[#156469]/80 text-white border border-[#63d392]/30"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							{emailError && (
								<p className="text-xs text-red-400">{emailError}</p>
							)}

							{participants.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2 p-2 bg-[#156469]/20 rounded-md border border-[#63d392]/10 max-h-24 overflow-auto">
									{participants.map((email) => (
										<Badge
											key={email}
											className="bg-[#156469] text-white hover:bg-[#156469] flex items-center gap-1"
										>
											<Mail className="h-3 w-3 text-[#63d392]/90" />
											{email}
											<button
												type="button"
												onClick={() => handleRemoveParticipant(email)}
												className="ml-1 hover:bg-red-500/20 rounded-full p-0.5"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									))}
								</div>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="description" className="text-gray-200">
								Description
							</Label>
							<Textarea
								id="description"
								name="description"
								placeholder="Enter meeting description"
								className="bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50 min-h-[100px]"
							/>
						</div>

						<div className="space-y-4 bg-[#156469]/20 p-3 rounded-md border border-[#63d392]/10">
							<h4 className="text-sm font-medium text-gray-200 mb-2">
								Notification Settings
							</h4>
							<div className="flex items-center justify-between">
								<Label
									htmlFor="sendTranscript"
									className="text-gray-300 text-sm"
								>
									Send transcript to participants
								</Label>
								<Switch
									id="sendTranscript"
									name="sendTranscript"
									className="data-[state=checked]:bg-[#63d392]"
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="sendSummary" className="text-gray-300 text-sm">
									Send meeting summary to participants
								</Label>
								<Switch
									id="sendSummary"
									name="sendSummary"
									className="data-[state=checked]:bg-[#63d392]"
								/>
							</div>
						</div>
					</div>

					<DialogFooter className="gap-2">
						<Button
							type="button"
							onClick={() => setOpen(false)}
							variant="outline"
							className="bg-transparent border-[#63d392]/30 text-white hover:bg-[#156469]/50 hover:text-white"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-[#63d392] hover:bg-[#4eb97b] text-[#0a4a4e] font-medium"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Calendar className="mr-2 h-4 w-4" />
									Create Meeting
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

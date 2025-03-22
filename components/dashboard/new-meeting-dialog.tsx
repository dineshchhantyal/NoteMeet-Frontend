'use client';

import { useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
	Calendar,
	Plus,
	X,
	Loader2,
	Mail,
	Link as LinkIcon,
	Clock,
	Users,
	CornerDownLeft,
	MicIcon,
	CloudIcon,
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from '@/components/ui/form';
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
import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface NewMeetingDialogProps {
	onMeetingCreated: (meeting: MeetingInterface) => void;
	children?: React.ReactNode;
}

const MEETING_PROVIDERS = [
	{ id: 'google-meet', name: 'Google Meet', logo: '/google-meet-logo.svg' },
	{ id: 'teams', name: 'Microsoft Teams', logo: '/ms-teams-logo.svg' },
	{ id: 'zoom', name: 'Zoom', logo: '/zoom-logo.svg' },
];

// Helper functions
const getDefaultDate = () => {
	const today = new Date();
	return today.toISOString().split('T')[0];
};

const getDefaultTime = () => {
	const now = new Date();
	// Round to nearest 30 min
	now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
	return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// Validation schema
const formSchema = z.object({
	title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
	date: z.string().min(1, { message: 'Date is required' }),
	time: z.string().min(1, { message: 'Time is required' }),
	duration: z.string().min(1, { message: 'Duration is required' }),
	description: z.string().optional(),
	meetingLink: z.string().optional(),
	provider: z.string().nullable().optional(),
	sendTranscript: z.boolean().default(true),
	sendSummary: z.boolean().default(true),
	recordingType: z.enum(['CLOUD', 'BROWSER', 'NONE']).default('NONE'),
});

type FormValues = z.infer<typeof formSchema>;

export function NewMeetingDialog({
	onMeetingCreated,
	children,
}: NewMeetingDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [participants, setParticipants] = useState<string[]>([]);
	const [currentEmail, setCurrentEmail] = useState('');
	const [emailError, setEmailError] = useState('');

	const emailInputRef = useRef<HTMLInputElement>(null);

	// Initialize react-hook-form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			date: getDefaultDate(),
			time: getDefaultTime(),
			duration: '',
			description: '',
			meetingLink: '',
			provider: null,
			sendTranscript: true,
			sendSummary: true,
			recordingType: 'NONE',
		},
	});

	// Watch the provider field to conditionally validate meetingLink
	const selectedProvider = form.watch('provider');

	// Reset form when dialog opens/closes
	useEffect(() => {
		if (!open) {
			setParticipants([]);
			setCurrentEmail('');
			setEmailError('');
			form.reset({
				title: '',
				date: getDefaultDate(),
				time: getDefaultTime(),
				duration: '',
				description: '',
				meetingLink: '',
				provider: null,
				sendTranscript: true,
				sendSummary: true,
				recordingType: 'NONE',
			});
		} else {
			// Focus on title input when dialog opens
			setTimeout(() => {
				const titleInput = document.getElementById('title');
				if (titleInput) {
					titleInput.focus();
				}
			}, 100);
		}
	}, [open, form]);

	// Add conditional validation for meetingLink when provider is selected
	useEffect(() => {
		if (selectedProvider) {
			form.register('meetingLink', {
				required: 'Meeting link is required when provider is selected',
			});
		}
	}, [selectedProvider, form]);

	const validateEmail = (email: string) => {
		return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
	};

	const handleAddParticipant = () => {
		// Process multiple emails separated by commas or spaces
		const emails = currentEmail.split(/[,\s]+/).filter(Boolean);

		if (emails.length === 0) {
			setEmailError('Email is required');
			return;
		}

		const validEmails: string[] = [];
		let hasError = false;

		for (const email of emails) {
			if (!validateEmail(email)) {
				setEmailError(`Invalid email: ${email}`);
				hasError = true;
				break;
			}
			if (participants.includes(email)) {
				setEmailError(`Email already added: ${email}`);
				hasError = true;
				break;
			}
			validEmails.push(email);
		}

		if (!hasError && validEmails.length > 0) {
			setParticipants([...participants, ...validEmails]);
			setCurrentEmail('');
			setEmailError('');

			// Focus back on email input for quick addition
			if (emailInputRef.current) {
				emailInputRef.current.focus();
			}
		}
	};

	const handleRemoveParticipant = (email: string) => {
		setParticipants(participants.filter((p) => p !== email));
	};

	// Get meeting link placeholder based on selected provider
	const getMeetingLinkPlaceholder = () => {
		switch (selectedProvider) {
			case 'google-meet':
				return 'e.g., https://meet.google.com/abc-defg-hij';
			case 'zoom':
				return 'e.g., https://zoom.us/j/1234567890';
			case 'teams':
				return 'e.g., https://teams.microsoft.com/l/meetup-join/...';
			default:
				return 'Paste your meeting link here';
		}
	};

	const onSubmit = async (data: FormValues) => {
		// If provider is selected but no meeting link provided
		if (data.provider && !data.meetingLink) {
			form.setError('meetingLink', {
				type: 'manual',
				message: 'Meeting link is required when provider is selected',
			});
			return;
		}

		setIsSubmitting(true);

		const meetingData: MeetingInterface = {
			id: Math.random().toString(36).substr(2, 9),
			title: data.title,
			date: data.date,
			time: data.time,
			duration: data.duration,
			description: data.description || '',
			provider: data.provider as 'zoom' | 'teams' | 'google-meet',
			meetingLink: data.meetingLink || '',
			participants,
			notifications: {
				sendTranscript: data.sendTranscript,
				sendSummary: data.sendSummary,
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

				toast.error(errorData.error || 'Failed to create meeting');
				setIsSubmitting(false);
				return;
			}

			const createdMeeting = await res.json();

			toast(`"${data.title}" scheduled successfully`);

			onMeetingCreated(createdMeeting.data);
			setOpen(false);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Failed to create meeting',
			);
		}
		setIsSubmitting(false);
	};

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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<DialogHeader>
							<DialogTitle className="text-white">
								Schedule New Meeting
							</DialogTitle>
							<DialogDescription className="text-gray-300">
								Fill in the details below to schedule a new meeting.
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4 py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel className="text-gray-200 flex items-center">
											<span className="text-[#63d392] mr-1">*</span> Meeting
											Title
										</FormLabel>
										<FormControl>
											<Input
												id="title"
												placeholder="Enter meeting title"
												className="bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-xs text-red-400" />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="date"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel className="text-gray-200 flex items-center">
												<span className="text-[#63d392] mr-1">*</span> Date
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<Calendar className="ml-1.5 h-3.5 w-3.5 text-[#63d392]/70 cursor-help" />
														</TooltipTrigger>
														<TooltipContent className="bg-[#0d5559] text-white border-[#63d392]/30">
															Today&apos;s date is pre-selected
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</FormLabel>
											<FormControl>
												<Input
													type="date"
													className="bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-xs text-red-400" />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="time"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel className="text-gray-200 flex items-center">
												<span className="text-[#63d392] mr-1">*</span> Time
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<Clock className="ml-1.5 h-3.5 w-3.5 text-[#63d392]/70 cursor-help" />
														</TooltipTrigger>
														<TooltipContent className="bg-[#0d5559] text-white border-[#63d392]/30">
															Current time rounded to nearest 30 min
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</FormLabel>
											<FormControl>
												<Input
													type="time"
													className="bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-xs text-red-400" />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="duration"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel className="text-gray-200 flex items-center">
											<span className="text-[#63d392] mr-1">*</span> Duration
										</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger className="bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus:ring-[#63d392]/30 focus:border-[#63d392]/50">
													<SelectValue placeholder="Select meeting duration" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
												<SelectItem
													value="15m"
													className="hover:bg-[#156469]/60"
												>
													15 minutes
												</SelectItem>
												<SelectItem
													value="30m"
													className="hover:bg-[#156469]/60"
												>
													30 minutes
												</SelectItem>
												<SelectItem
													value="45m"
													className="hover:bg-[#156469]/60"
												>
													45 minutes
												</SelectItem>
												<SelectItem
													value="1h"
													className="hover:bg-[#156469]/60"
												>
													1 hour
												</SelectItem>
												<SelectItem
													value="1h30m"
													className="hover:bg-[#156469]/60"
												>
													1.5 hours
												</SelectItem>
												<SelectItem
													value="2h"
													className="hover:bg-[#156469]/60"
												>
													2 hours
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage className="text-xs text-red-400" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="provider"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel htmlFor="provider" className="text-gray-200">
											Meeting Provider
										</FormLabel>
										<div className="grid grid-cols-3 gap-2">
											{MEETING_PROVIDERS.map((provider) => (
												<Button
													key={provider.id}
													type="button"
													onClick={() => field.onChange(provider.id)}
													className={cn(
														'h-auto py-2 px-3 flex flex-col items-center justify-center gap-1 border border-[#63d392]/30',
														field.value === provider.id
															? 'bg-[#156469] text-white'
															: 'bg-[#156469]/20 text-gray-300 hover:bg-[#156469]/40',
													)}
												>
													<div className="w-6 h-6 flex items-center justify-center">
														{provider.id === 'zoom' && (
															<span className="text-blue-400 text-sm font-bold">
																Zoom
															</span>
														)}
														{provider.id === 'teams' && (
															<span className="text-purple-400 text-sm font-bold">
																Teams
															</span>
														)}
														{provider.id === 'google-meet' && (
															<span className="text-red-400 text-sm font-bold">
																Meet
															</span>
														)}
													</div>
													<span className="text-xs">{provider.name}</span>
												</Button>
											))}
										</div>
									</FormItem>
								)}
							/>

							{selectedProvider && (
								<FormField
									control={form.control}
									name="meetingLink"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel className="text-gray-200 flex items-center">
												<LinkIcon className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
												Meeting Link
												<span className="text-[#63d392] ml-1">*</span>
											</FormLabel>
											<FormControl>
												<Input
													placeholder={getMeetingLinkPlaceholder()}
													className="bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-xs text-red-400" />
										</FormItem>
									)}
								/>
							)}

							<div className="grid gap-2">
								<Label className="text-gray-200 flex items-center">
									<Users className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
									Participants
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<span className="ml-1 text-xs text-[#63d392]/70 cursor-help">
													(Tip)
												</span>
											</TooltipTrigger>
											<TooltipContent className="bg-[#0d5559] text-white border-[#63d392]/30 max-w-xs">
												Add multiple emails at once by separating them with
												commas
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</Label>
								<div className="flex gap-2 items-center">
									<div className="relative flex-1">
										<Input
											ref={emailInputRef}
											value={currentEmail}
											onChange={(e) => {
												setCurrentEmail(e.target.value);
												setEmailError('');
											}}
											placeholder="Enter participant email(s)"
											className={cn(
												'bg-[#156469]/40 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50 pr-8',
												emailError && 'border-red-500',
											)}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													e.preventDefault();
													handleAddParticipant();
												}
											}}
										/>
										<CornerDownLeft className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400/50" />
									</div>
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

							<div className="space-y-4 bg-[#156469]/20 p-3 rounded-md border border-[#63d392]/10">
								<h4 className="text-sm font-medium text-gray-200 mb-2">
									Recording Settings
								</h4>
								<FormField
									control={form.control}
									name="recordingType"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel className="text-gray-200">
												Recording Method
											</FormLabel>
											<div className="grid grid-cols-3 gap-2">
												<Button
													type="button"
													onClick={() => field.onChange('NONE')}
													className={cn(
														'h-auto py-2 px-3 flex flex-col items-center justify-center gap-1 border border-[#63d392]/30',
														field.value === 'NONE'
															? 'bg-[#156469] text-white'
															: 'bg-[#156469]/20 text-gray-300 hover:bg-[#156469]/40',
													)}
												>
													<X className="h-4 w-4 text-red-400" />
													<span className="text-xs">No Recording</span>
												</Button>
												<Button
													type="button"
													onClick={() => field.onChange('BROWSER')}
													className={cn(
														'h-auto py-2 px-3 flex flex-col items-center justify-center gap-1 border border-[#63d392]/30',
														field.value === 'BROWSER'
															? 'bg-[#156469] text-white'
															: 'bg-[#156469]/20 text-gray-300 hover:bg-[#156469]/40',
													)}
												>
													<MicIcon className="h-4 w-4 text-orange-400" />
													<span className="text-xs">Browser Recording</span>
												</Button>
												<Button
													type="button"
													onClick={() => field.onChange('CLOUD')}
													className={cn(
														'h-auto py-2 px-3 flex flex-col items-center justify-center gap-1 border border-[#63d392]/30',
														field.value === 'CLOUD'
															? 'bg-[#156469] text-white'
															: 'bg-[#156469]/20 text-gray-300 hover:bg-[#156469]/40',
													)}
												>
													<CloudIcon className="h-4 w-4 text-blue-400" />
													<span className="text-xs">Cloud Recording</span>
												</Button>
											</div>
											<FormDescription className="text-xs text-gray-400">
												{field.value === 'BROWSER' &&
													'Records directly in your browser. Best for personal use.'}
												{field.value === 'CLOUD' &&
													'Records on our servers. Better quality and reliability.'}
												{field.value === 'NONE' &&
													'No recording will be made for this meeting.'}
											</FormDescription>
											<FormMessage className="text-xs text-red-400" />
										</FormItem>
									)}
								/>
							</div>

							<div className="space-y-4 bg-[#156469]/20 p-3 rounded-md border border-[#63d392]/10">
								<h4 className="text-sm font-medium text-gray-200 mb-2">
									Notification Settings
								</h4>
								<FormField
									control={form.control}
									name="sendTranscript"
									render={({ field }) => (
										<FormItem className="flex items-center justify-between">
											<FormLabel className="text-gray-300 text-sm">
												Send transcript to participants
											</FormLabel>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
													className="data-[state=checked]:bg-[#63d392]"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="sendSummary"
									render={({ field }) => (
										<FormItem className="flex items-center justify-between">
											<FormLabel className="text-gray-300 text-sm">
												Send meeting summary to participants
											</FormLabel>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
													className="data-[state=checked]:bg-[#63d392]"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
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
				</Form>
			</DialogContent>
		</Dialog>
	);
}

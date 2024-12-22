'use client';

import { useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
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
import { MeetingInterface } from '@/interfaces';

interface NewMeetingDialogProps {
	onMeetingCreated: (meeting: MeetingInterface) => void;
}

const MEETING_PROVIDERS = [
	{ id: 'google-meet', name: 'Google Meet', logo: '/google-meet-logo.svg' },
	{ id: 'teams', name: 'Microsoft Teams', logo: '/ms-teams-logo.svg' },
	{ id: 'zoom', name: 'Zoom', logo: '/zoom-logo.svg' },
];

export function NewMeetingDialog({ onMeetingCreated }: NewMeetingDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [participants, setParticipants] = useState<string[]>([]);
	const [currentEmail, setCurrentEmail] = useState('');
	const [emailError, setEmailError] = useState('');

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

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(event.currentTarget);
		const meetingData: MeetingInterface = {
			id: Math.random().toString(36).substr(2, 9),
			duration: '30m',
			title: formData.get('title') as string,
			date: formData.get('date') as string,
			time: formData.get('time') as string,
			description: formData.get('description') as string,
			provider: formData.get('provider') as 'zoom' | 'teams' | 'google-meet',
			meetingLink: formData.get('meetingLink') as string,
			participants,
			notifications: {
				sendTranscript: formData.get('sendTranscript') === 'on',
				sendSummary: formData.get('sendSummary') === 'on',
			},
			status: 'Scheduled',
		};

		try {
			const res = await fetch('/api/meetings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(meetingData),
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || 'Failed to create meeting');
			}

			const createdMeeting = await res.json();
			onMeetingCreated(createdMeeting);
			setOpen(false);
			setParticipants([]);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : 'Failed to create meeting',
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Calendar className="mr-2 h-4 w-4" />
					New Meeting
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Schedule New Meeting</DialogTitle>
						<DialogDescription>
							Fill in the details below to schedule a new meeting.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								name="title"
								placeholder="Enter meeting title"
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="date">Date</Label>
								<Input id="date" name="date" type="date" required />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="time">Time</Label>
								<Input id="time" name="time" type="time" required />
							</div>
						</div>

						{/* duration */}
						<div className="grid gap-2">
							<Label htmlFor="duration">Duration</Label>
							<Select name="duration" required>
								<SelectTrigger>
									<SelectValue placeholder="Select meeting duration" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="15m">15 minutes</SelectItem>
									<SelectItem value="30m">30 minutes</SelectItem>
									<SelectItem value="45m">45 minutes</SelectItem>
									<SelectItem value="1h">1 hour</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="provider">Meeting Provider</Label>
							<Select name="provider" required>
								<SelectTrigger>
									<SelectValue placeholder="Select meeting provider" />
								</SelectTrigger>
								<SelectContent>
									{MEETING_PROVIDERS.map((provider) => (
										<SelectItem key={provider.id} value={provider.id}>
											{provider.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="meetingLink">Meeting Link</Label>
							<Input
								id="meetingLink"
								name="meetingLink"
								placeholder="Paste your meeting link here"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label>Participants</Label>
							<div className="flex gap-2">
								<Input
									value={currentEmail}
									onChange={(e) => {
										setCurrentEmail(e.target.value);
										setEmailError('');
									}}
									placeholder="Enter participant email"
									className={emailError ? 'border-red-500' : ''}
								/>
								<Button type="button" onClick={handleAddParticipant}>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							{emailError && (
								<p className="text-sm text-red-500">{emailError}</p>
							)}
							<div className="flex flex-wrap gap-2 mt-2">
								{participants.map((email) => (
									<Badge key={email} variant="secondary">
										{email}
										<button
											type="button"
											onClick={() => handleRemoveParticipant(email)}
											className="ml-2 hover:text-red-500"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))}
							</div>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								placeholder="Enter meeting description"
							/>
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label htmlFor="sendTranscript">
									Send transcript to participants
								</Label>
								<Switch id="sendTranscript" name="sendTranscript" />
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="sendSummary">
									Send meeting summary to participants
								</Label>
								<Switch id="sendSummary" name="sendSummary" />
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Creating...' : 'Create Meeting'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

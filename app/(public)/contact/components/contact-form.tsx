'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(event.currentTarget);
		const data = {
			name: formData.get('name'),
			email: formData.get('email'),
			subject: formData.get('subject'),
			message: formData.get('message'),
		};

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				const { error } = await res.json();
				throw new Error(error);
			}

			alert('Message sent successfully!');
		} catch (error) {
			alert('Failed to send message.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<Label htmlFor="name">Name</Label>
				<Input id="name" name="name" required />
			</div>

			<div>
				<Label htmlFor="email">Email</Label>
				<Input id="email" name="email" type="email" required />
			</div>

			<div>
				<Label htmlFor="subject">Subject</Label>
				<Select name="subject" required>
					<SelectTrigger>
						<SelectValue placeholder="Select a subject" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="general">General Inquiry</SelectItem>
						<SelectItem value="support">Technical Support</SelectItem>
						<SelectItem value="sales">Sales</SelectItem>
						<SelectItem value="partnership">Partnership</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label htmlFor="message">Message</Label>
				<Textarea id="message" name="message" rows={5} required />
			</div>

			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Sending...' : 'Send Message'}
			</Button>
		</form>
	);
}

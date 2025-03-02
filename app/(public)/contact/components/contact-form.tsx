'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		setTimeout(() => {
			setIsSubmitting(false);
			setIsSubmitted(true);
		}, 1500);
	};

	if (isSubmitted) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8 h-full flex flex-col items-center justify-center text-center"
			>
				<div className="bg-[#63d392]/20 h-20 w-20 flex items-center justify-center rounded-full mb-6">
					<CheckCircle className="h-10 w-10 text-[#63d392]" />
				</div>
				<h3 className="text-2xl font-bold text-white mb-4">
					Message Received!
				</h3>
				<p className="text-gray-300 mb-8 max-w-md">
					Thanks for reaching out! We've received your message and will get back
					to you as soon as possible, usually within 24 hours.
				</p>
				<Button
					onClick={() => setIsSubmitted(false)}
					className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a] hover:shadow-lg hover:shadow-[#63d392]/20 transition-all"
				>
					Send Another Message
				</Button>
			</motion.div>
		);
	}

	return (
		<Card className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 shadow-xl">
			<CardHeader className="border-b border-[#63d392]/20 pb-6">
				<CardTitle className="text-white text-2xl">Send a Message</CardTitle>
				<CardDescription className="text-gray-300">
					Fill out the form below and we'll respond as soon as possible.
				</CardDescription>
			</CardHeader>

			<CardContent className="pt-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="name" className="text-white">
								Name
							</Label>
							<Input
								id="name"
								placeholder="Your name"
								required
								className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email" className="text-white">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="your.email@example.com"
								required
								className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="subject" className="text-white">
							Subject
						</Label>
						<Select>
							<SelectTrigger className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white">
								<SelectValue placeholder="Select a subject" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="general">General Inquiry</SelectItem>
								<SelectItem value="support">Technical Support</SelectItem>
								<SelectItem value="billing">Billing Question</SelectItem>
								<SelectItem value="feedback">Feedback</SelectItem>
								<SelectItem value="partnership">
									Partnership Opportunity
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="message" className="text-white">
							Message
						</Label>
						<Textarea
							id="message"
							placeholder="How can we help you?"
							rows={6}
							required
							className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
						/>
					</div>

					<Button
						type="submit"
						className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a] hover:shadow-lg hover:shadow-[#63d392]/20 transition-all w-full"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending Message...
							</>
						) : (
							<>
								<Send className="mr-2 h-4 w-4" />
								Send Message
							</>
						)}
					</Button>

					<p className="text-center text-xs text-gray-400 pt-4">
						By submitting this form, you agree to our{' '}
						<a href="/privacy" className="text-[#63d392] hover:underline">
							Privacy Policy
						</a>
						.
					</p>
				</form>
			</CardContent>
		</Card>
	);
}

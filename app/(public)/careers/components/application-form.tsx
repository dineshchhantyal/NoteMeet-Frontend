'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Upload, Send, Loader2 } from 'lucide-react';

export function ApplicationForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formSubmitted, setFormSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission delay
		setTimeout(() => {
			setIsSubmitting(false);
			setFormSubmitted(true);
		}, 1500);
	};

	if (formSubmitted) {
		return (
			<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8 text-center">
				<div className="bg-[#63d392]/20 h-16 w-16 flex items-center justify-center rounded-full mx-auto mb-6">
					<svg
						className="h-8 w-8 text-[#63d392]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h3 className="text-2xl font-semibold mb-3 text-white">
					Application Submitted!
				</h3>
				<p className="text-gray-300 mb-6 max-w-md mx-auto">
					Thank you for applying to join the NoteMeet team. We&apos;ll review
					your application and get back to you soon.
				</p>
				<Button
					onClick={() => setFormSubmitted(false)}
					className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a]"
				>
					Apply for Another Position
				</Button>
			</div>
		);
	}

	return (
		<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8">
			<form onSubmit={handleSubmit} className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Label htmlFor="fullName" className="text-white">
							Full Name
						</Label>
						<Input
							id="fullName"
							required
							className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
							placeholder="Enter your full name"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="text-white">
							Email Address
						</Label>
						<Input
							id="email"
							type="email"
							required
							className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
							placeholder="your.email@example.com"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone" className="text-white">
							Phone Number
						</Label>
						<Input
							id="phone"
							className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
							placeholder="(555) 123-4567"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="position" className="text-white">
							Position
						</Label>
						<Select>
							<SelectTrigger className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white">
								<SelectValue placeholder="Select a position" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ai-engineer">Senior AI Engineer</SelectItem>
								<SelectItem value="ui-designer">UI/UX Designer</SelectItem>
								<SelectItem value="full-stack">Full Stack Developer</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="coverLetter" className="text-white">
						Cover Letter
					</Label>
					<Textarea
						id="coverLetter"
						rows={5}
						className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
						placeholder="Tell us why you're interested in this position and what you can bring to our team..."
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="resume" className="text-white">
						Resume/CV
					</Label>
					<div className="flex items-center justify-center w-full">
						<label
							htmlFor="resume"
							className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#63d392]/30 border-dashed rounded-lg cursor-pointer bg-[#0d5559]/50 hover:bg-[#0d5559]/70 transition-colors"
						>
							<div className="flex flex-col items-center justify-center pt-5 pb-6">
								<Upload className="w-10 h-10 mb-3 text-[#63d392]" />
								<p className="mb-2 text-sm text-white">
									<span className="font-semibold">Click to upload</span> or drag
									and drop
								</p>
								<p className="text-xs text-gray-300">
									PDF, DOCX or TXT (MAX. 5MB)
								</p>
							</div>
							<input id="resume" type="file" className="hidden" />
						</label>
					</div>
				</div>

				<div className="pt-4">
					<Button
						type="submit"
						className="w-full sm:w-auto bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a] hover:shadow-lg hover:shadow-[#63d392]/20 transition-all"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
							</>
						) : (
							<>
								<Send className="mr-2 h-4 w-4" /> Submit Application
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}

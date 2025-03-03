'use client';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Github,
	Globe,
	Mail,
	ArrowRight,
	ChevronRight,
	Loader2,
} from 'lucide-react';
import Logo from './ui/Logo';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const subscribeSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

export function Footer() {
	const [email, setEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Validate email
			subscribeSchema.parse({ email });

			setIsSubmitting(true);

			const response = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Failed to subscribe');
			}

			toast.success(data.message);
			setEmail('');
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error(error.errors[0].message);
			} else if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Failed to subscribe. Please try again later.');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<footer className="bg-[#0a4a4e] pt-20 pb-12 relative overflow-hidden">
			{/* Background elements */}
			<div className="absolute top-0 left-0 w-1/3 h-1/3 bg-[#63d392]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
			<div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#156469]/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>

			<div className="container mx-auto px-4 relative">
				{/* Newsletter Subscription */}
				<div className="bg-[#156469]/40 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-[#63d392]/20 max-w-4xl mx-auto">
					<div className="flex flex-col md:flex-row items-center justify-between gap-8">
						<div className="md:w-1/2 text-center md:text-left">
							<h3 className="text-2xl font-bold mb-2 text-white">
								Stay Updated
							</h3>
							<p className="text-gray-300">
								Get the latest features and updates directly to your inbox
							</p>
						</div>
						<div className="md:w-1/2">
							<form
								className="flex flex-col sm:flex-row gap-2"
								onSubmit={handleSubscribe}
							>
								<Input
									type="email"
									placeholder="Enter your email"
									className="bg-white/10 border-[#63d392]/30 text-white placeholder:text-gray-400 focus:border-[#63d392] focus:ring-[#63d392]/30"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={isSubmitting}
								/>
								<Button
									type="submit"
									className="bg-[#63d392] hover:bg-[#4fb87a] text-[#0a4a4e] font-medium border-none transition-colors whitespace-nowrap flex items-center"
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Subscribing
										</>
									) : (
										<>
											Subscribe <ArrowRight className="ml-2 h-4 w-4" />
										</>
									)}
								</Button>
							</form>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5">
					{/* Logo and About */}
					<div className="md:col-span-4">
						<div className="flex items-center mb-6">
							<Logo className="h-10 w-10 mr-3" />
							<span className="text-2xl font-bold text-white">NoteMeet</span>
						</div>
						<p className="text-gray-300 mb-6 leading-relaxed">
							Transform your meetings with AI-powered recording, transcription,
							and automatic summary generation.
						</p>
					</div>

					{/* Links Section */}
					<div className="md:col-span-2">
						<h3 className="font-bold text-lg mb-4 text-white">Product</h3>
						<ul className="space-y-3">
							{['About', 'Pricing'].map((item) => (
								<li key={item}>
									<Link
										href={`/${item.toLowerCase()}`}
										className="text-gray-300 hover:text-[#63d392] transition-colors flex items-center"
									>
										<ChevronRight className="h-4 w-4 mr-1 text-[#63d392]" />
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="md:col-span-2">
						<h3 className="font-bold text-lg mb-4 text-white">Company</h3>
						<ul className="space-y-3">
							{['Careers', 'Contact', 'Blog'].map((item) => (
								<li key={item}>
									<Link
										href={`/${item.toLowerCase()}`}
										className="text-gray-300 hover:text-[#63d392] transition-colors flex items-center"
									>
										<ChevronRight className="h-4 w-4 mr-1 text-[#63d392]" />
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="md:col-span-2">
						<h3 className="font-bold text-lg mb-4 text-white">Resources</h3>
						<ul className="space-y-3">
							{['Privacy', 'Terms'].map((item) => (
								<li key={item}>
									<Link
										href={`/${item.toLowerCase().replace(' ', '-')}`}
										className="text-gray-300 hover:text-[#63d392] transition-colors flex items-center"
									>
										<ChevronRight className="h-4 w-4 mr-1 text-[#63d392]" />
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="md:col-span-2">
						<h3 className="font-bold text-lg mb-4 text-white">Support</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/early-access"
									className="text-gray-300 hover:text-[#63d392] transition-colors flex items-center"
								>
									<ChevronRight className="h-4 w-4 mr-1 text-[#63d392]" />
									Early Access
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-gray-300 hover:text-[#63d392] transition-colors flex items-center"
								>
									<ChevronRight className="h-4 w-4 mr-1 text-[#63d392]" />
									Request Demo
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Credits and Legal */}
				<div className="mt-16 pt-8 border-t border-[#63d392]/20">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-400 mb-6 md:mb-0">
							&copy; {new Date().getFullYear()} NoteMeet. All rights reserved.
						</p>

						<div className="flex flex-wrap gap-4 md:gap-8 justify-center">
							<Link
								href="/privacy"
								className="text-gray-400 hover:text-[#63d392] transition-colors text-sm"
							>
								Privacy Policy
							</Link>
							<Link
								href="/terms"
								className="text-gray-400 hover:text-[#63d392] transition-colors text-sm"
							>
								Terms of Service
							</Link>
							<Link
								href="/cookies"
								className="text-gray-400 hover:text-[#63d392] transition-colors text-sm"
							>
								Cookie Policy
							</Link>
						</div>
					</div>

					<div className="mt-12 pt-6 border-t border-[#156469]/50 flex flex-col items-center">
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="bg-gradient-to-r from-[#156469] to-[#0a4a4e] p-4 rounded-xl border border-[#63d392]/20 shadow-lg mb-4"
						>
							<p className="text-sm text-[#63d392] font-medium mb-2 text-center">
								Designed & Developed with ❤️ by Dinesh Chhantyal
							</p>
							<div className="flex flex-wrap justify-center items-center gap-3">
								<Link
									href="https://www.dineshchhantyal.com"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#63d392]/10 hover:bg-[#63d392]/20 text-[#63d392] transition-all duration-300 text-xs"
								>
									<Globe className="h-3 w-3 mr-1.5" />
									dineshchhantyal.com
								</Link>
								<Link
									href="https://github.com/dineshchhantyal"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#63d392]/10 hover:bg-[#63d392]/20 text-[#63d392] transition-all duration-300 text-xs"
								>
									<Github className="h-3 w-3 mr-1.5" />
									@dineshchhantyal
								</Link>
								<Link
									href="mailto:myagdichhantyal@gmail.com"
									className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#63d392]/10 hover:bg-[#63d392]/20 text-[#63d392] transition-all duration-300 text-xs"
								>
									<Mail className="h-3 w-3 mr-1.5" />
									myagdichhantyal@gmail.com
								</Link>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</footer>
	);
}

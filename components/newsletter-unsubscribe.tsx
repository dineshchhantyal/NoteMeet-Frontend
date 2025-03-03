'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MailX, Loader2 } from 'lucide-react';

const unsubscribeSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

type UnsubscribeFormValues = z.infer<typeof unsubscribeSchema>;

export function NewsletterUnsubscribe() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [unsubscribed, setUnsubscribed] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UnsubscribeFormValues>({
		resolver: zodResolver(unsubscribeSchema),
	});

	const onSubmit = async (data: UnsubscribeFormValues) => {
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/newsletter/unsubscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: data.email }),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to unsubscribe');
			}

			setUnsubscribed(true);
			toast.success(result.message);
		} catch (error) {
			console.error('Unsubscribe error:', error);

			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Failed to unsubscribe. Please try again later.');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8 max-w-md mx-auto">
			<div className="text-center mb-6">
				<div className="mx-auto w-12 h-12 bg-[#0d5559]/50 rounded-full flex items-center justify-center mb-4">
					<MailX className="h-6 w-6 text-[#63d392]" />
				</div>
				<h2 className="text-2xl font-bold text-white mb-2">
					Unsubscribe from Newsletter
				</h2>
				<p className="text-gray-300">
					We&apos;re sorry to see you go. Enter your email to unsubscribe from
					our newsletter.
				</p>
			</div>

			{unsubscribed ? (
				<div className="text-center p-6 bg-[#0d5559]/30 rounded-lg border border-[#63d392]/20">
					<h3 className="text-lg font-medium text-white mb-2">
						Successfully Unsubscribed
					</h3>
					<p className="text-gray-300">
						You have been removed from our newsletter list. You can resubscribe
						at any time.
					</p>
					<Button
						className="mt-4 bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e]"
						onClick={() => (window.location.href = '/')}
					>
						Return to Home
					</Button>
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<Input
							{...register('email')}
							type="email"
							placeholder="Enter your email address"
							className="bg-[#0d5559]/50 border-[#63d392]/30 text-white placeholder:text-gray-400 focus:border-[#63d392] focus:ring-[#63d392]/30"
							disabled={isSubmitting}
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-400">
								{errors.email.message}
							</p>
						)}
					</div>

					<Button
						type="submit"
						className="w-full bg-red-500/80 hover:bg-red-500 text-white"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Processing...
							</>
						) : (
							'Unsubscribe'
						)}
					</Button>
				</form>
			)}
		</div>
	);
}

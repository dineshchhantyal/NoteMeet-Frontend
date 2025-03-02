'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	company: z.string().min(2, {
		message: 'Company name must be at least 2 characters.',
	}),
	subscription: z.enum(['starter', 'pro', 'business', 'enterprise'], {
		required_error: 'Please select a subscription plan.',
	}),
	paymentMethod: z.enum(['credit_card', 'paypal', 'bank_transfer'], {
		required_error: 'Please select a payment method.',
	}),
	features: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: 'You have to select at least one feature.',
	}),
	message: z.string().optional(),
	agreeTerms: z.literal(true, {
		errorMap: () => ({
			message: 'You must agree to the terms and conditions.',
		}),
	}),
});

export function EarlyAccessForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			company: '',
			subscription: undefined,
			paymentMethod: undefined,
			features: [],
			message: '',
			agreeTerms: undefined,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsSubmitting(true);
		try {
			const response = await fetch('/api/early-access', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				throw new Error('Failed to submit application');
			}

			toast({
				title: 'Application Submitted',
				description:
					'Thank you for your interest. We will contact you shortly.',
			});

			form.reset();
			setIsSubmitted(true);
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Submission Failed',
				description:
					error instanceof Error ? error.message : 'Something went wrong.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="text-center py-8">
				<div className="bg-[#63d392]/20 h-20 w-20 flex items-center justify-center rounded-full mx-auto mb-6">
					<CheckCircle2 className="h-10 w-10 text-[#63d392]" />
				</div>
				<h3 className="text-2xl font-semibold mb-3 text-white">
					Application Received!
				</h3>
				<p className="text-gray-300 mb-6">
					Thank you for your interest in NoteMeet. We've received your early
					access application and will be in touch soon.
				</p>
				<Button
					onClick={() => setIsSubmitted(false)}
					variant="outline"
					className="border-[#63d392]/30 text-[#63d392] hover:bg-[#63d392]/10"
				>
					Submit Another Application
				</Button>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 text-white"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">Full Name</FormLabel>
							<FormControl>
								<Input
									placeholder="John Doe"
									{...field}
									className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
								/>
							</FormControl>
							<FormMessage className="text-[#ff8882]" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">Email</FormLabel>
							<FormControl>
								<Input
									placeholder="john.doe@example.com"
									{...field}
									className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
								/>
							</FormControl>
							<FormMessage className="text-[#ff8882]" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="company"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">Company</FormLabel>
							<FormControl>
								<Input
									placeholder="Acme Inc."
									{...field}
									className="bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
								/>
							</FormControl>
							<FormMessage className="text-[#ff8882]" />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={form.control}
						name="subscription"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">
									Desired Subscription
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="bg-[#0d5559]/70 border-[#63d392]/30 text-white focus:ring-[#63d392] focus:ring-opacity-20">
											<SelectValue placeholder="Select a plan" />
										</SelectTrigger>
									</FormControl>
									<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
										<SelectItem value="starter">Starter</SelectItem>
										<SelectItem value="pro">Pro</SelectItem>
										<SelectItem value="business">Business</SelectItem>
										<SelectItem value="enterprise">Enterprise</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage className="text-[#ff8882]" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="paymentMethod"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">
									Preferred Payment Method
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="bg-[#0d5559]/70 border-[#63d392]/30 text-white focus:ring-[#63d392] focus:ring-opacity-20">
											<SelectValue placeholder="Select payment method" />
										</SelectTrigger>
									</FormControl>
									<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
										<SelectItem value="credit_card">Credit Card</SelectItem>
										<SelectItem value="paypal">PayPal</SelectItem>
										<SelectItem value="bank_transfer">Bank Transfer</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage className="text-[#ff8882]" />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="features"
					render={() => (
						<FormItem>
							<div className="mb-4">
								<FormLabel className="text-white text-base">
									Desired Features
								</FormLabel>
								<FormDescription className="text-gray-300">
									Select the features you're most interested in trying.
								</FormDescription>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{[
									'AI Transcription',
									'Meeting Summaries',
									'Action Item Extraction',
									'Integration with Calendar',
									'Custom Branding',
								].map((feature) => (
									<FormField
										key={feature}
										control={form.control}
										name="features"
										render={({ field }) => {
											return (
												<FormItem
													key={feature}
													className="flex flex-row items-start space-x-3 space-y-0"
												>
													<FormControl>
														<Checkbox
															checked={field.value?.includes(feature)}
															onCheckedChange={(checked) => {
																return checked
																	? field.onChange([...field.value, feature])
																	: field.onChange(
																			field.value?.filter(
																				(value) => value !== feature,
																			),
																		);
															}}
															className="border-[#63d392]/50 text-[#63d392] data-[state=checked]:bg-[#63d392] data-[state=checked]:text-white"
														/>
													</FormControl>
													<FormLabel className="text-gray-300 font-normal">
														{feature}
													</FormLabel>
												</FormItem>
											);
										}}
									/>
								))}
							</div>
							<FormMessage className="text-[#ff8882] mt-2" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">
								Additional Message (Optional)
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Tell us about your specific needs or any questions you have."
									className="resize-none bg-[#0d5559]/70 border-[#63d392]/30 focus:border-[#63d392] text-white placeholder:text-gray-400"
									{...field}
								/>
							</FormControl>
							<FormMessage className="text-[#ff8882]" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="agreeTerms"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-[#63d392]/20 p-4 bg-[#0d5559]/30">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
									className="border-[#63d392]/50 text-[#63d392] data-[state=checked]:bg-[#63d392] data-[state=checked]:text-white mt-1"
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel className="text-white">
									I agree to the terms and conditions
								</FormLabel>
								<FormDescription className="text-gray-300">
									By checking this box, you agree to our{' '}
									<a href="/terms" className="text-[#63d392] hover:underline">
										Terms of Service
									</a>{' '}
									and{' '}
									<a href="/privacy" className="text-[#63d392] hover:underline">
										Privacy Policy
									</a>
									.
								</FormDescription>
							</div>
							<FormMessage className="text-[#ff8882]" />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a] hover:shadow-lg hover:shadow-[#63d392]/20 transition-all mt-4"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Submitting...
						</>
					) : (
						<>
							Submit Application
							<ArrowRight className="ml-2 h-4 w-4" />
						</>
					)}
				</Button>
			</form>
		</Form>
	);
}

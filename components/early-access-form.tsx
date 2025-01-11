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

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			company: '',
			features: [],
			message: '',
			agreeTerms: undefined,
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		setIsSubmitting(true);
		fetch('/api/early-access-form', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to submit application');
				}
				toast({
					title: 'Application Submitted',
					description:
						'Thank you for your interest. We will contact you shortly.',
				});
				alert('Application submitted successfully!');
				form.reset();
			})
			.catch((error) => {
				toast({
					variant: 'destructive',
					title: 'Submission Failed',
					description:
						error instanceof Error ? error.message : 'Something went wrong.',
				});
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 bg-gray-200 p-6 rounded-lg shadow-md text-primary"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input placeholder="John Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="john.doe@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="company"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Company</FormLabel>
							<FormControl>
								<Input placeholder="Acme Inc." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="subscription"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Desired Subscription</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a subscription plan" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="starter">Starter</SelectItem>
									<SelectItem value="pro">Pro</SelectItem>
									<SelectItem value="business">Business</SelectItem>
									<SelectItem value="enterprise">Enterprise</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="paymentMethod"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Preferred Payment Method</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a payment method" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="credit_card">Credit Card</SelectItem>
									<SelectItem value="paypal">PayPal</SelectItem>
									<SelectItem value="bank_transfer">Bank Transfer</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="features"
					render={() => (
						<FormItem>
							<div className="mb-4">
								<FormLabel className="text-base">Desired Features</FormLabel>
								<FormDescription>
									Select the features you&apos;re most interested in trying.
								</FormDescription>
							</div>
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
													/>
												</FormControl>
												<FormLabel className="font-normal">{feature}</FormLabel>
											</FormItem>
										);
									}}
								/>
							))}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Additional Message (Optional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Tell us about your specific needs or any questions you have."
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="agreeTerms"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>I agree to the terms and conditions</FormLabel>
								<FormDescription>
									By checking this box, you agree to our{' '}
									<a href="/terms" className="text-primary hover:underline">
										Terms of Service
									</a>{' '}
									and{' '}
									<a href="/privacy" className="text-primary hover:underline">
										Privacy Policy
									</a>
									.
								</FormDescription>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Submit Application'}
				</Button>
			</form>
		</Form>
	);
}

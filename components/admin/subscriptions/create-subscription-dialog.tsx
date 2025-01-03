'use client';

import { useState, useTransition } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { SubscriptionPlan, SubscriptionTier } from '@prisma/client';
import {
	SubscriptionCurrency,
	SubscriptionBillingCycle,
	SubscriptionBillingFrequency,
	SubscriptionSchema,
} from '@/schemas/subscriptions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { createSubscription } from '@/actions/create-subscription';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';
import { toast } from 'sonner';

interface CreateSubscriptionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateSubscriptionDialog({
	open,
	onOpenChange,
}: CreateSubscriptionDialogProps) {
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();
	console.log(SubscriptionBillingCycle);

	const form = useForm<z.infer<typeof SubscriptionSchema>>({
		resolver: zodResolver(SubscriptionSchema),
		defaultValues: {
			name: '',
			cost: 0,
			currency: SubscriptionCurrency.USD,
			billingCycle: SubscriptionBillingCycle.MONTHLY,
			billingFrequency: SubscriptionBillingFrequency.RECURRING,
		},
	});

	const onSubmit = async (data: z.infer<typeof SubscriptionSchema>) => {
		console.log('Form data:', data);
		setError('');
		setSuccess('');
		startTransition(() => {
			createSubscription(data)
				.then((data) => {
					if (data?.error) {
						setError(data.error);
					}

					if (data?.success) {
						setSuccess(data.success);
						form.reset();
						onOpenChange(false);
						toast.success('Subscription plan created successfully');
					}
				})
				.catch((e) => setError(e.message));
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Create New Subscription Plan</DialogTitle>
				</DialogHeader>
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-4 py-4">
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="name">Plan Name</FormLabel>
											<FormControl>
												<Input
													id="name"
													placeholder="Enter plan name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="space-y-2">
									<FormField
										control={form.control}
										name="plan"
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor="plan">Plan Type</FormLabel>
												<FormControl>
													<Select
														disabled={isPending}
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select plan" />
														</SelectTrigger>
														<SelectContent>
															{Object.values(SubscriptionTier).map((tier) => (
																<SelectItem key={tier} value={tier}>
																	{tier}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="cost"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="cost">Cost</FormLabel>
											<FormControl>
												<Input
													id="cost"
													type="number"
													step="0.01"
													placeholder="0.00"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="space-y-2">
									<FormField
										control={form.control}
										name="currency"
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor="currency">Currency</FormLabel>
												<FormControl>
													<Select
														disabled={isPending}
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select currency" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="USD">USD</SelectItem>
															<SelectItem value="EUR">EUR</SelectItem>
															<SelectItem value="GBP">GBP</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="billingFrequency"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="billingFrequency">
												Billing Frequency
											</FormLabel>
											<FormControl>
												<Select
													disabled={isPending}
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select frequency" />
													</SelectTrigger>
													<SelectContent>
														{Object.values(SubscriptionBillingFrequency).map(
															(frequency) => (
																<SelectItem key={frequency} value={frequency}>
																	{frequency}
																</SelectItem>
															),
														)}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="billingCycle"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="billingCycle">
												Billing Cycle
											</FormLabel>
											<FormControl>
												<Select
													disabled={isPending}
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select cycle" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="monthly">Monthly</SelectItem>
														<SelectItem value="yearly">Yearly</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="meetingsAllowed"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="meetingsAllowed">
												Meetings Allowed
											</FormLabel>
											<FormControl>
												<Input
													id="meetingsAllowed"
													type="number"
													placeholder="e.g., 100"
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
													value={field.value}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="meetingDuration"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="meetingDuration">
												Meeting Duration (min)
											</FormLabel>
											<FormControl>
												<Input
													id="meetingDuration"
													type="number"
													placeholder="e.g., 60"
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
													value={field.value}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="space-y-2">
								<FormField
									control={form.control}
									name="cloudStorage"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="cloudStorage">
												Cloud Storage (GB)
											</FormLabel>
											<FormControl>
												<Input
													id="cloudStorage"
													type="number"
													placeholder="e.g., 100"
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
													value={field.value}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="space-y-2">
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="description">Description</FormLabel>
											<FormControl>
												<Textarea
													id="description"
													placeholder="Enter plan description"
													className="resize-none"
													rows={3}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter>
							<FormError message={error} />
							<FormSuccess message={success} />

							<Button variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? 'Creating...' : 'Create Plan'}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}

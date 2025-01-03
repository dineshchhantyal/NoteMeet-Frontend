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
import { BillingPeriod, Currency, SubscriptionTier } from '@prisma/client';
import { SubscriptionPlanSchema } from '@/schemas/subscriptions';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { createSubscriptionPlan } from '@/actions/create-subscription';
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

	const form = useForm<z.infer<typeof SubscriptionPlanSchema>>({
		resolver: zodResolver(SubscriptionPlanSchema),
		defaultValues: {
			name: '',
			tier: SubscriptionTier.FREE,
			basePrice: 0,
			currency: Currency.USD,
			billingPeriods: BillingPeriod.MONTHLY,
		},
	});

	const onSubmit = async (data: z.infer<typeof SubscriptionPlanSchema>) => {
		console.log('Form data:', data);
		setError('');
		setSuccess('');
		startTransition(() => {
			createSubscriptionPlan(data)
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
										name="tier"
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor="tier">Plan Type</FormLabel>
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
									name="basePrice"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="basePrice">Cost</FormLabel>
											<FormControl>
												<Input
													id="basePrice"
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
									name="billingPeriods"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="billingPeriods">
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
														{Object.values(BillingPeriod).map((period) => (
															<SelectItem key={period} value={period}>
																{period}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="billingPeriods"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="billingPeriods">
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
									name="storageLimit"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="storageLimit">
												Cloud Storage (GB)
											</FormLabel>
											<FormControl>
												<Input
													id="storageLimit"
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

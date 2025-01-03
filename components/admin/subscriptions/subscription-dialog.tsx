'use client';

import { useState, useTransition } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
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
import {
	BillingPeriod,
	Currency,
	SubscriptionPlan,
	SubscriptionTier,
} from '@prisma/client';
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
import {
	createSubscriptionPlan,
	updateSubscriptionPlan,
} from '@/actions/subscription';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

interface SubscriptionFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: 'create' | 'edit';
	subscriptionPlan?: Partial<SubscriptionPlan>;
	setSubscriptionPlan?: (subscriptionPlan: Partial<SubscriptionPlan>) => void;
}

export function SubscriptionFormDialog({
	open,
	onOpenChange,
	mode = 'create',
	subscriptionPlan,
	setSubscriptionPlan,
}: SubscriptionFormDialogProps) {
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<z.infer<typeof SubscriptionPlanSchema>>({
		resolver: zodResolver(SubscriptionPlanSchema),
		defaultValues: {
			name: subscriptionPlan?.name || '',
			isActive: subscriptionPlan?.isActive ?? true,
			tier: subscriptionPlan?.tier ?? SubscriptionTier.FREE,
			basePrice: subscriptionPlan?.basePrice
				? Number(subscriptionPlan.basePrice)
				: 0,
			currency: (subscriptionPlan?.currency as Currency) ?? ('USD' as Currency),
			billingPeriods: subscriptionPlan?.billingPeriods ?? BillingPeriod.MONTHLY,
			meetingsAllowed: subscriptionPlan?.meetingsAllowed ?? 1,
			meetingDuration: subscriptionPlan?.meetingDuration ?? 1,
			storageLimit: subscriptionPlan?.storageLimit || 1,
			features: subscriptionPlan?.features || [],
			description: subscriptionPlan?.description || '',
			trialDays: subscriptionPlan?.trialDays || 0,
		},
	});

	console.log('Form data:', form.getValues());
	console.log('Form errors:', form.formState.errors);

	const onSubmit = async (data: z.infer<typeof SubscriptionPlanSchema>) => {
		console.log('Form data:', data);
		setError('');
		setSuccess('');

		if (mode === 'create') {
			startTransition(() => {
				createSubscriptionPlan(data)
					.then(
						(data: {
							error?: string;
							success?: string;
							data?: Partial<SubscriptionPlan>;
						}) => {
							console.log('Response data:', data);
							if (data?.error) {
								setError(data.error);
							}

							if (data?.success) {
								form.reset();
								onOpenChange(false);
								toast.success('Subscription plan created successfully');
								if (data?.data && setSubscriptionPlan) {
									setSubscriptionPlan(data.data);
								}

								router.refresh();
							}
						},
					)
					.catch((e: Error) => {
						console.error('Error:', e);
						setError(e.message);
					});
			});
		} else if (mode === 'edit') {
			startTransition(() => {
				updateSubscriptionPlan({
					...data,
					id: subscriptionPlan?.id || '',
				}).then(
					(data: {
						error?: string;
						success?: string;
						data?: Partial<SubscriptionPlan>;
					}) => {
						console.log('Response data:', data);
						if (data?.error) {
							setError(data.error);
						}

						if (data?.success) {
							form.reset();
							onOpenChange(false);
							toast.success('Subscription plan updated successfully');
							if (data?.data && setSubscriptionPlan) {
								setSubscriptionPlan(data.data);
							}
							router.refresh();
						}
					},
				);
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Create New Subscription Plan</DialogTitle>
					<DialogDescription>
						Create a new subscription plan to offer to your users.
					</DialogDescription>
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
													value={field.value}
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
													value={field.value}
													onChange={(e) =>
														field.onChange(
															e.target.value ? Number(e.target.value) : '',
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

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
													value={field.value}
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
													value={field.value}
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
													{...field}
													value={field.value}
													onChange={(e) =>
														field.onChange(
															e.target.value ? Number(e.target.value) : '',
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
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
													{...field}
													value={field.value}
													onChange={(e) =>
														field.onChange(
															e.target.value ? Number(e.target.value) : '',
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

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
													{...field}
													value={field.value}
													onChange={(e) =>
														field.onChange(
															e.target.value ? Number(e.target.value) : '',
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

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
						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											className="mt-2"
										/>
									</FormControl>
									<FormLabel htmlFor="isActive" className="m-0 p-0">
										Active Subscription
									</FormLabel>

									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<FormError message={error} />
							<FormSuccess message={success} />

							<Button variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending
									? 'Processing...'
									: mode === 'create'
										? 'Create Plan'
										: 'Update Plan'}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}

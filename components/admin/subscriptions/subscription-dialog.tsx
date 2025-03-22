import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { SubscriptionPlan } from '@/types/subscription';

// Define form schema with Zod
const formSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	basePrice: z.preprocess(
		(val) => (val === '' ? 0 : Number(val)),
		z.number().min(0, 'Price must be a positive number'),
	),
	currency: z.string().min(1, 'Currency is required'),
	billingPeriods: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM']),
	tier: z.enum(['FREE', 'TRIAL', 'PRO', 'BUSINESS', 'CUSTOM']),
	features: z.array(z.string()).optional(),
	meetingsAllowed: z.preprocess(
		(val) => (val === '' ? 0 : Number(val)),
		z.number().int().min(0),
	),
	meetingDuration: z.preprocess(
		(val) => (val === '' ? 0 : Number(val)),
		z.number().int().min(0),
	),
	storageLimit: z.preprocess(
		(val) => (val === '' ? 0 : Number(val)),
		z.number().min(0),
	),
	trialDays: z.preprocess(
		(val) => (val === '' ? 0 : Number(val)),
		z.number().int().min(0),
	),
	isActive: z.boolean().default(true),
	isPublic: z.boolean().default(false),
	public: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface SubscriptionFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: 'create' | 'edit';
	plan?: SubscriptionPlan;
	onSuccess?: () => Promise<void> | void;
}

export function SubscriptionFormDialog({
	open,
	onOpenChange,
	mode = 'create',
	plan,
	onSuccess,
}: SubscriptionFormDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [activeTab, setActiveTab] = useState('details');

	// Initialize form with default values or existing plan data
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues:
			mode === 'edit' && plan
				? {
						name: plan.name,
						description: plan.description || '',
						basePrice: plan.basePrice, // Changed from price
						currency: plan.currency,
						billingPeriods: plan.billingPeriods, // Changed from billingPeriod
						tier: plan.tier,
						features: plan.features || [],
						meetingsAllowed: plan.meetingsAllowed, // Changed from maxMeetings
						meetingDuration: plan.meetingDuration, // Changed from maxParticipants
						storageLimit: plan.storageLimit, // Changed from maxStorageGB
						trialDays: plan.trialDays || 0,
						isActive: plan.isActive,
						isPublic: plan.isPublic || false,
						public: plan.public || true,
					}
				: {
						name: '',
						description: '',
						basePrice: 0, // Changed from price
						currency: 'USD',
						billingPeriods: 'MONTHLY', // Changed from billingPeriod
						tier: 'TRIAL', // Changed from BASIC
						features: [],
						meetingsAllowed: 10, // Changed from maxMeetings
						meetingDuration: 60, // Changed from maxParticipants
						storageLimit: 1, // Changed from maxStorageGB
						trialDays: 0,
						isActive: true,
						isPublic: false,
						public: true,
					},
	});

	// Handle form submission
	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		try {
			const endpoint =
				mode === 'edit' ? `/api/admin/plans` : `/api/admin/plans`;

			const method = mode === 'edit' ? 'PUT' : 'POST';

			// If editing, include the plan ID
			const payload = mode === 'edit' && plan ? { ...data, id: plan.id } : data;

			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to save plan');
			}

			toast.success(
				mode === 'create'
					? 'Subscription plan created successfully'
					: 'Subscription plan updated successfully',
			);

			// Call onSuccess callback if provided
			if (onSuccess) await onSuccess();

			// Close the dialog
			onOpenChange(false);
		} catch (error) {
			console.error('Error saving subscription plan:', error);
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to save subscription plan',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Features management
	const [featureInput, setFeatureInput] = useState('');
	const [features, setFeatures] = useState<string[]>(
		form.getValues('features') || [],
	);

	const addFeature = () => {
		if (featureInput.trim() !== '') {
			const updatedFeatures = [...features, featureInput.trim()];
			setFeatures(updatedFeatures);
			form.setValue('features', updatedFeatures);
			setFeatureInput('');
		}
	};

	const removeFeature = (index: number) => {
		const updatedFeatures = features.filter((_, i) => i !== index);
		setFeatures(updatedFeatures);
		form.setValue('features', updatedFeatures);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-[#0d5559] border-[#63d392]/30 text-white sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-xl">
						{mode === 'create' ? 'Create New' : 'Edit'} Subscription Plan
					</DialogTitle>
					<DialogDescription className="text-gray-300">
						Complete the form below to{' '}
						{mode === 'create' ? 'create a new' : 'update this'} subscription
						plan.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className="bg-[#0a4a4e] border border-[#63d392]/20">
								<TabsTrigger
									value="details"
									className="data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e]"
								>
									Basic Details
								</TabsTrigger>
								<TabsTrigger
									value="features"
									className="data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e]"
								>
									Features & Limits
								</TabsTrigger>
								<TabsTrigger
									value="advanced"
									className="data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e]"
								>
									Advanced
								</TabsTrigger>
							</TabsList>

							<TabsContent value="details" className="space-y-4 py-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-white">Plan Name</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Basic Plan"
													{...field}
													className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white"
												/>
											</FormControl>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-white">Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe what's included in this plan..."
													{...field}
													className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white resize-none"
												/>
											</FormControl>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="basePrice"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-white">Price</FormLabel>
												<FormControl>
													<Input
														type="number"
														min="0"
														step="0.01"
														{...field}
														className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white"
													/>
												</FormControl>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="currency"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-white">Currency</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white">
															<SelectValue placeholder="Select currency" />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="bg-[#0d5559] border-[#63d392]/20 text-white">
														<SelectItem value="USD">USD ($)</SelectItem>
														<SelectItem value="EUR">EUR (€)</SelectItem>
														<SelectItem value="GBP">GBP (£)</SelectItem>
														<SelectItem value="JPY">JPY (¥)</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage className="text-red-400" />
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
												<FormLabel className="text-white">
													Billing Period
												</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white">
															<SelectValue placeholder="Select period" />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="bg-[#0d5559] border-[#63d392]/20 text-white">
														<SelectItem value="MONTHLY">Monthly</SelectItem>
														<SelectItem value="QUARTERLY">Quarterly</SelectItem>
														<SelectItem value="ANNUAL">Annual</SelectItem>
														<SelectItem value="CUSTOM">Custom</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="tier"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-white">Tier</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white">
															<SelectValue placeholder="Select tier" />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="bg-[#0d5559] border-[#63d392]/20 text-white">
														<SelectItem value="FREE">Free</SelectItem>
														<SelectItem value="TRIAL">Trial</SelectItem>
														<SelectItem value="PRO">Pro</SelectItem>
														<SelectItem value="BUSINESS">Business</SelectItem>
														<SelectItem value="CUSTOM">Custom</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>
								</div>
							</TabsContent>

							<TabsContent value="features" className="space-y-4 py-4">
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="meetingsAllowed"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-white">
													Max Meetings
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														min="0"
														{...field}
														className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white"
													/>
												</FormControl>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="meetingDuration"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-white">
													Max Participants
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														min="0"
														{...field}
														className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white"
													/>
												</FormControl>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="storageLimit"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-white">
													Storage (GB)
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														min="0"
														step="0.1"
														{...field}
														className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white"
													/>
												</FormControl>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>
								</div>

								<div className="space-y-4">
									<FormLabel className="text-white">Features</FormLabel>
									<div className="flex gap-2">
										<Input
											value={featureInput}
											onChange={(e) => setFeatureInput(e.target.value)}
											placeholder="Add a feature..."
											className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white flex-1"
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													e.preventDefault();
													addFeature();
												}
											}}
										/>
										<Button
											type="button"
											onClick={addFeature}
											className="bg-[#63d392] hover:bg-[#63d392]/90 text-[#0a4a4e]"
										>
											Add
										</Button>
									</div>
									<div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
										{features.map((feature, index) => (
											<div
												key={index}
												className="flex items-center justify-between bg-[#0a4a4e]/70 border border-[#63d392]/30 rounded-md p-2"
											>
												<span className="text-white">{feature}</span>
												<Button
													type="button"
													variant="ghost"
													onClick={() => removeFeature(index)}
													className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/20"
												>
													&times;
												</Button>
											</div>
										))}
										{features.length === 0 && (
											<p className="text-gray-400 text-center italic py-2">
												No features added yet
											</p>
										)}
									</div>
								</div>
							</TabsContent>

							<TabsContent value="advanced" className="space-y-4 py-4">
								<FormField
									control={form.control}
									name="trialDays"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-white">
												Trial Period (Days)
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													min="0"
													{...field}
													className="bg-[#0a4a4e]/70 border-[#63d392]/30 text-white"
												/>
											</FormControl>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="isActive"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#63d392]/30 p-4 bg-[#0a4a4e]/70">
											<div className="space-y-0.5">
												<FormLabel className="text-white">
													Active Status
												</FormLabel>
												<FormDescription className="text-gray-400">
													Toggle whether this plan is visible to users
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
													className="data-[state=checked]:bg-[#63d392]"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</TabsContent>
						</Tabs>

						<DialogFooter className="pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								className="bg-transparent border-[#63d392]/30 text-white hover:bg-[#156469]/50"
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-[#63d392] hover:bg-[#63d392]/90 text-[#0a4a4e]"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-[#0a4a4e] rounded-full"></div>
										{mode === 'create' ? 'Creating...' : 'Updating...'}
									</>
								) : (
									<>{mode === 'create' ? 'Create Plan' : 'Update Plan'}</>
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

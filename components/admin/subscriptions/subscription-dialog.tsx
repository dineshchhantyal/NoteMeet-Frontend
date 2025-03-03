'use client';

import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';
import { Loader2, PlusCircle, X } from 'lucide-react';

type SubscriptionPlan = {
	id: string;
	name: string;
	description: string;
	price: number;
	interval: 'monthly' | 'yearly';
	features: string[];
	isActive: boolean;
};

type SubscriptionFormDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: 'create' | 'edit';
	plan?: SubscriptionPlan | null;
};

export function SubscriptionFormDialog({
	open,
	onOpenChange,
	mode,
	plan,
}: SubscriptionFormDialogProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
	const [features, setFeatures] = useState<string[]>(['']);
	const [isActive, setIsActive] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (mode === 'edit' && plan) {
			setName(plan.name);
			setDescription(plan.description);
			setPrice(plan.price.toString());
			setInterval(plan.interval);
			setFeatures(plan.features.length > 0 ? plan.features : ['']);
			setIsActive(plan.isActive);
		} else {
			resetForm();
		}
	}, [mode, plan, open]);

	const resetForm = () => {
		setName('');
		setDescription('');
		setPrice('');
		setInterval('monthly');
		setFeatures(['']);
		setIsActive(true);
	};

	const handleAddFeature = () => {
		setFeatures([...features, '']);
	};

	const handleFeatureChange = (index: number, value: string) => {
		const newFeatures = [...features];
		newFeatures[index] = value;
		setFeatures(newFeatures);
	};

	const handleRemoveFeature = (index: number) => {
		const newFeatures = features.filter((_, i) => i !== index);
		setFeatures(newFeatures.length > 0 ? newFeatures : ['']);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name || !description || !price) {
			toast.error('Please fill all required fields');
			return;
		}

		setIsSubmitting(true);

		try {
			// Replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast.success(
				mode === 'create'
					? 'Subscription plan created successfully!'
					: 'Subscription plan updated successfully!',
			);

			onOpenChange(false);
			resetForm();
		} catch {
			toast.error(
				mode === 'create'
					? 'Failed to create subscription plan'
					: 'Failed to update subscription plan',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] bg-[#0d5559] border-[#63d392]/30 text-white">
				<DialogHeader>
					<DialogTitle className="text-xl text-white">
						{mode === 'create'
							? 'Create New Subscription Plan'
							: 'Edit Subscription Plan'}
					</DialogTitle>
					<DialogDescription className="text-gray-300">
						{mode === 'create'
							? 'Add a new subscription plan to your offerings.'
							: 'Make changes to the subscription plan details.'}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name" className="text-gray-200">
								Plan Name
							</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g. Pro Plan"
								className="bg-[#0a4a4e]/80 border-[#63d392]/30 text-white placeholder:text-gray-400"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="price" className="text-gray-200">
								Price
							</Label>
							<Input
								id="price"
								type="number"
								step="0.01"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								placeholder="e.g. 19.99"
								className="bg-[#0a4a4e]/80 border-[#63d392]/30 text-white placeholder:text-gray-400"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="interval" className="text-gray-200">
								Billing Interval
							</Label>
							<Select
								value={interval}
								onValueChange={(value) =>
									setInterval(value as 'monthly' | 'yearly')
								}
							>
								<SelectTrigger
									id="interval"
									className="bg-[#0a4a4e]/80 border-[#63d392]/30 text-white"
								>
									<SelectValue placeholder="Select interval" />
								</SelectTrigger>
								<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
									<SelectItem
										value="monthly"
										className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
									>
										Monthly
									</SelectItem>
									<SelectItem
										value="yearly"
										className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
									>
										Yearly
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="status" className="text-gray-200">
								Status
							</Label>
							<Select
								value={isActive ? 'active' : 'inactive'}
								onValueChange={(value) => setIsActive(value === 'active')}
							>
								<SelectTrigger
									id="status"
									className="bg-[#0a4a4e]/80 border-[#63d392]/30 text-white"
								>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent className="bg-[#0d5559] border-[#63d392]/30 text-white">
									<SelectItem
										value="active"
										className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
									>
										Active
									</SelectItem>
									<SelectItem
										value="inactive"
										className="hover:bg-[#156469] focus:bg-[#156469] cursor-pointer"
									>
										Inactive
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description" className="text-gray-200">
							Description
						</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe this subscription plan"
							className="min-h-[80px] bg-[#0a4a4e]/80 border-[#63d392]/30 text-white placeholder:text-gray-400"
							required
						/>
					</div>

					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<Label className="text-gray-200">Features</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-8 border-[#63d392]/30 text-[#63d392] hover:bg-[#63d392]/10"
								onClick={handleAddFeature}
							>
								<PlusCircle className="h-4 w-4 mr-1" />
								Add Feature
							</Button>
						</div>

						{features.map((feature, index) => (
							<div key={index} className="flex gap-2">
								<Input
									value={feature}
									onChange={(e) => handleFeatureChange(index, e.target.value)}
									placeholder={`Feature ${index + 1}`}
									className="bg-[#0a4a4e]/80 border-[#63d392]/30 text-white placeholder:text-gray-400"
								/>
								{features.length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="text-gray-300 hover:text-red-400 hover:bg-red-500/10"
										onClick={() => handleRemoveFeature(index)}
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						))}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="border-[#63d392]/30 text-white hover:bg-[#156469]/50"
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
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{mode === 'create' ? 'Creating...' : 'Saving...'}
								</>
							) : mode === 'create' ? (
								'Create Plan'
							) : (
								'Save Changes'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Subscription, SubscriptionPlan } from '@prisma/client';

interface EditSubscriptionDialogProps {
	subscription: Partial<Subscription> | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditSubscriptionDialog({
	subscription,
	open,
	onOpenChange,
}: EditSubscriptionDialogProps) {
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// Add API call here
		setLoading(false);
		onOpenChange(false);
	};

	if (!subscription) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Subscription Plan</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="space-y-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Plan Name</Label>
								<Input id="name" defaultValue={subscription.name} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="plan">Plan Type</Label>
								<Select defaultValue={subscription.plan}>
									<SelectTrigger>
										<SelectValue placeholder="Select plan" />
									</SelectTrigger>
									<SelectContent>
										{Object.values(SubscriptionPlan).map((plan) => (
											<SelectItem key={plan} value={plan}>
												{plan}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="cost">Cost</Label>
								<Input
									id="cost"
									type="number"
									step="0.01"
									defaultValue={subscription.cost}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="currency">Currency</Label>
								<Select defaultValue={subscription.currency}>
									<SelectTrigger>
										<SelectValue placeholder="Select currency" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="USD">USD</SelectItem>
										<SelectItem value="EUR">EUR</SelectItem>
										<SelectItem value="GBP">GBP</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="billingFrequency">Billing Frequency</Label>
								<Input
									id="billingFrequency"
									defaultValue={subscription.billingFrequency}
									placeholder="e.g., 1, 3, 6, 12"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="billingCycle">Billing Cycle</Label>
								<Select defaultValue={subscription.billingCycle}>
									<SelectTrigger>
										<SelectValue placeholder="Select cycle" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="monthly">Monthly</SelectItem>
										<SelectItem value="yearly">Yearly</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="meetingsAllowed">Meetings Allowed</Label>
								<Input
									id="meetingsAllowed"
									type="number"
									defaultValue={subscription.meetingsAllowed}
									placeholder="e.g., 100"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="meetingDuration">Meeting Duration (min)</Label>
								<Input
									id="meetingDuration"
									type="number"
									defaultValue={subscription.meetingDuration}
									placeholder="e.g., 60"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="cloudStorage">Cloud Storage (GB)</Label>
							<Input
								id="cloudStorage"
								type="number"
								defaultValue={subscription.cloudStorage}
								placeholder="e.g., 100"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								defaultValue={subscription.description || ''}
								placeholder="Enter plan description"
								className="resize-none"
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? 'Saving...' : 'Save Changes'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

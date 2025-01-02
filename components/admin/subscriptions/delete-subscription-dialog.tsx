'use client';

import { useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteSubscriptionDialogProps {
	subscription: any;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteSubscriptionDialog({
	subscription,
	open,
	onOpenChange,
}: DeleteSubscriptionDialogProps) {
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		setLoading(true);
		// Add API call here
		setLoading(false);
		onOpenChange(false);
	};

	if (!subscription) return null;

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Subscription Plan</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete the "{subscription.name}" plan? This
						action cannot be undone. All users on this plan will need to be
						migrated to a different plan.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={loading}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{loading ? 'Deleting...' : 'Delete Plan'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

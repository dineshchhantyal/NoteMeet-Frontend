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
import { toast } from 'sonner';
import { Subscription, SubscriptionPlan, User } from '@prisma/client';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddUserToSubscriptionPlanSchema } from '@/schemas/subscriptions';
import { z } from 'zod';
import { addUserToSubscriptionPlan } from '@/actions/subscription';
import { getUserByEmail } from '@/actions/subscription';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { UserCircleIcon } from 'lucide-react';
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { FormError } from '@/components/form-error';

interface AddUserDialogProps {
	subscriptionPlan: Partial<SubscriptionPlan> | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

export function AddUserDialog({
	subscriptionPlan,
	open,
	onOpenChange,
	onSuccess,
}: AddUserDialogProps) {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState<
		(User & { activeSubscriptions: Subscription[] }) | null
	>(null);

	const form = useForm<z.infer<typeof AddUserToSubscriptionPlanSchema>>({
		resolver: zodResolver(AddUserToSubscriptionPlanSchema),
		defaultValues: {
			email: '',
			subscriptionPlanId: subscriptionPlan?.id,
		},
	});

	const { control, handleSubmit } = form;

	const onSubmit = async (
		data: z.infer<typeof AddUserToSubscriptionPlanSchema>,
	) => {
		setLoading(true);
		try {
			// Add API call here to add user to subscription
			await addUserToSubscriptionPlan(data).then((res) => {
				if (res.success) {
					toast.success('User added to subscription successfully');
					onSuccess?.();
					onOpenChange(false);
					form.reset();
				} else {
					toast.error(res.error || 'Failed to add user to subscription');
				}
			});
		} catch {
			toast.error('Failed to add user to subscription');
		} finally {
			setLoading(false);
		}
	};
	const findUser = async (email: string) => {
		const user = await getUserByEmail(email, false, true);
		if (user) {
			setUser(user as User & { activeSubscriptions: Subscription[] });
		} else {
			toast.error('User not found');
		}
	};
	if (!subscriptionPlan) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add User to {subscriptionPlan.name}</DialogTitle>
				</DialogHeader>
				<FormProvider {...form}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="email">User Email</Label>
								<FormField
									name="email"
									control={control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													id="email"
													type="email"
													placeholder="Enter user email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<FormMessage />
						<FormError />
						{user && (
							<Accordion
								type="single"
								collapsible={true}
								defaultValue="user-info"
								className="my-2"
							>
								<AccordionItem value="user-info">
									<AccordionTrigger className="text-sm">
										<span className="flex items-center gap-2">
											<UserCircleIcon className="w-4 h-4" /> User Information
										</span>
									</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-2">
											<div className="flex flex-col">
												<Label htmlFor="user-email">Email:</Label>
												<p id="user-email" className="text-gray-700">
													{user.email}
												</p>
											</div>
											<div className="flex flex-col">
												<Label htmlFor="user-name">Name:</Label>
												<p id="user-name" className="text-gray-700">
													{user.name}
												</p>
											</div>
											<div className="flex flex-col">
												<Label htmlFor="user-role">Role:</Label>
												<p id="user-role" className="text-gray-700">
													{user.role}
												</p>
											</div>
											<div className="flex flex-col">
												<Label htmlFor="user-status">Subscription:</Label>
												<p id="user-status" className="text-gray-700">
													{user.activeSubscriptions.length}
												</p>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						)}
						<DialogFooter>
							<Button variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={() => findUser(form.getValues('email'))}
							>
								Check User
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? 'Adding...' : 'Add User'}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}

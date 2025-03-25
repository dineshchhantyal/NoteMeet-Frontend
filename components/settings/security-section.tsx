import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';
import { LockKeyhole } from 'lucide-react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updatePassword, toggleTwoFactor } from '@/actions/settings';
import { PasswordSchema } from '@/schemas';

export function SecuritySection() {
	const user = useCurrentUser();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();
	const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(
		user?.isTwoFactorEnabled ?? false,
	);

	const form = useForm<z.infer<typeof PasswordSchema>>({
		resolver: zodResolver(PasswordSchema),
		defaultValues: {
			password: undefined,
			newPassword: undefined,
		},
	});

	const onSubmit = (values: z.infer<typeof PasswordSchema>) => {
		startTransition(() => {
			updatePassword(values)
				.then((data) => {
					if (data.error) {
						setError(data.error);
					}
					if (data.success) {
						setSuccess(data.success);
						form.reset();
					}
				})
				.catch(() => setError('Something went wrong!'));
		});
	};

	const handleTwoFactorToggle = (enabled: boolean) => {
		startTransition(() => {
			setIsTwoFactorEnabled(enabled);
			toggleTwoFactor(enabled)
				.then((data) => {
					if (data.error) {
						setError(data.error);
						setIsTwoFactorEnabled(!enabled); // Revert on error
					}
					if (data.success) {
						setSuccess(data.success);
					}
				})
				.catch(() => {
					setError('Something went wrong!');
					setIsTwoFactorEnabled(!enabled); // Revert on error
				});
		});
	};

	return (
		<div className="border-b border-[#63d392]/20 p-6">
			<div className="flex items-center mb-2">
				<LockKeyhole className="h-5 w-5 text-[#63d392] mr-2" />
				<h2 className="text-xl font-semibold text-white">Security</h2>
			</div>
			<p className="text-gray-300 text-sm mb-6">
				Manage your password and security settings
			</p>

			<div className="mb-8">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-white font-medium">
							Two-Factor Authentication
						</h3>
						<p className="text-gray-300 text-sm">
							Add an extra layer of security to your account
						</p>
					</div>
					<Switch
						checked={isTwoFactorEnabled}
						onCheckedChange={handleTwoFactorToggle}
						className="data-[state=checked]:bg-[#63d392]"
						disabled={isPending}
					/>
				</div>
			</div>

			<div>
				<h3 className="text-white font-medium mb-4">Change Password</h3>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-white">
											Current Password
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder="••••••••"
												type="password"
												className="bg-[#0d5559]/50 border-[#63d392]/30 text-white placeholder:text-gray-400 focus:border-[#63d392] focus:ring-[#63d392]/30"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-white">New Password</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder="••••••••"
												type="password"
												className="bg-[#0d5559]/50 border-[#63d392]/30 text-white placeholder:text-gray-400 focus:border-[#63d392] focus:ring-[#63d392]/30"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormError message={error} />
						<FormSuccess message={success} />

						<div className="flex justify-end">
							<Button
								disabled={isPending}
								type="submit"
								className="bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e] font-medium"
							>
								Update Password
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updatePersonalInfo } from '@/actions/settings';
import { PersonalInfoSchema } from '@/schemas';

export function PersonalInfoSection() {
	const user = useCurrentUser();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof PersonalInfoSchema>>({
		resolver: zodResolver(PersonalInfoSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
		},
	});

	const onSubmit = (values: z.infer<typeof PersonalInfoSchema>) => {
		startTransition(() => {
			updatePersonalInfo(values)
				.then((data) => {
					if (data.error) {
						setError(data.error);
					}
					if (data.success) {
						setSuccess(data.success);
					}
				})
				.catch(() => setError('Something went wrong!'));
		});
	};

	return (
		<div className="border-b border-[#63d392]/20 p-6">
			<h2 className="text-xl font-semibold text-white">Personal Information</h2>
			<p className="text-gray-300 text-sm mb-4">
				Update your basic profile details
			</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-white">Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder="John Doe"
											className="bg-[#0d5559]/50 border-[#63d392]/30 text-white placeholder:text-gray-400 focus:border-[#63d392] focus:ring-[#63d392]/30"
										/>
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
									<FormLabel className="text-white">Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder="john.doe@example.com"
											type="email"
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
							Save Profile
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

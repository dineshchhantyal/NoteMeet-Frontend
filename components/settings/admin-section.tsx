import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Shield } from 'lucide-react';
import { UserRole } from '@prisma/client';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { settings } from '@/actions/settings';

const AdminSchema = z.object({
	role: z.enum([UserRole.ADMIN, UserRole.USER]),
});

export function AdminSection() {
	const user = useCurrentUser();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof AdminSchema>>({
		resolver: zodResolver(AdminSchema),
		defaultValues: {
			role: user?.role || UserRole.USER,
		},
	});

	const onSubmit = (values: z.infer<typeof AdminSchema>) => {
		startTransition(() => {
			settings({ role: values.role })
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
		<div className="p-6">
			<div className="flex items-center mb-2">
				<Shield className="h-5 w-5 text-red-400 mr-2" />
				<h2 className="text-xl font-semibold text-white">Admin Settings</h2>
			</div>
			<p className="text-gray-300 text-sm mb-6">
				These settings are only available to administrators
			</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">Role</FormLabel>
								<Select
									disabled={isPending}
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="bg-[#0d5559]/50 border-[#63d392]/30 text-white focus:ring-[#63d392]/30">
											<SelectValue placeholder="Select a role" />
										</SelectTrigger>
									</FormControl>

									<SelectContent className="bg-[#156469] border-[#63d392]/30 text-white">
										<SelectItem
											value={UserRole.ADMIN}
											className="focus:bg-[#63d392]/20 focus:text-white"
										>
											Admin
										</SelectItem>
										<SelectItem
											value={UserRole.USER}
											className="focus:bg-[#63d392]/20 focus:text-white"
										>
											User
										</SelectItem>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>

					<FormError message={error} />
					<FormSuccess message={success} />

					<div className="flex justify-end">
						<Button
							disabled={isPending}
							type="submit"
							className="bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e] font-medium"
						>
							Save Admin Settings
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

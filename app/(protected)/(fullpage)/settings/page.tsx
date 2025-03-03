'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
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
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { settings } from '@/actions/settings';
import { SettingsSchema } from '@/schemas';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UserRole } from '@prisma/client';
import { motion } from 'framer-motion';
import { UserCog } from 'lucide-react';

export default function SettingsPage() {
	const user = useCurrentUser();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const { update } = useSession();
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			password: undefined,
			newPassword: undefined,
			role: user?.role || undefined,
			isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
		},
	});

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		startTransition(() => {
			settings(values)
				.then((data) => {
					if (data.error) {
						setError(data.error);
					}

					if (data.success) {
						update();
						setSuccess(data.success);
					}
				})
				.catch(() => setError('Something went wrong!'));
		});
	};

	return (
		<div className="flex flex-col min-h-screen bg-[#0a4a4e] py-16 px-4">
			<div className="container mx-auto max-w-4xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center justify-center mb-8">
						<UserCog className="h-8 w-8 text-[#63d392] mr-3" />
						<h1 className="text-3xl font-bold text-white">Account Settings</h1>
					</div>

					<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden shadow-lg">
						<div className="border-b border-[#63d392]/20 p-6">
							<h2 className="text-xl font-semibold text-white">
								Personal Information
							</h2>
							<p className="text-gray-300 text-sm">
								Update your account details and preferences
							</p>
						</div>

						<div className="p-6">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
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

									<div className="pt-4 border-t border-[#63d392]/10">
										<h3 className="text-lg font-medium text-white mb-4">
											Security
										</h3>
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
														<FormLabel className="text-white">
															New Password
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
										</div>
									</div>

									{user?.role === UserRole.ADMIN && (
										<div className="pt-4 border-t border-[#63d392]/10">
											<h3 className="text-lg font-medium text-white mb-4">
												Admin Settings
											</h3>
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
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									)}

									<FormError message={error} />
									<FormSuccess message={success} />

									<div className="flex justify-end pt-4">
										<Button
											disabled={isPending}
											type="submit"
											className="bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e] font-medium px-6"
										>
											Save Changes
										</Button>
									</div>
								</form>
							</Form>
						</div>
					</div>

					{/* Optional: Add decorative elements */}
					<div className="absolute top-20 right-10 w-64 h-64 bg-[#63d392]/5 rounded-full blur-3xl -z-10"></div>
					<div className="absolute bottom-20 left-10 w-80 h-80 bg-[#156469]/10 rounded-full blur-3xl -z-10"></div>
				</motion.div>
			</div>
		</div>
	);
}

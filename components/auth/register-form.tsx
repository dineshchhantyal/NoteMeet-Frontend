'use client';

import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '../form-success';
import { register } from '@/actions/register';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterForm = () => {
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		setError('');
		setSuccess('');

		startTransition(() => {
			register(values).then((data) => {
				setError(data.error);
				setSuccess(data.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel={
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-[#63d392] to-[#156469] bg-clip-text text-transparent">
						Create Account
					</h2>
					<p className="text-sm text-gray-400 mt-1">
						Join NoteMeet and transform your meetings
					</p>
				</motion.div>
			}
			backButtonLabel="Already have an account?"
			backButtonRef="/auth/login"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<motion.div
						className="space-y-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-gray-200 font-medium">
										Full Name
									</FormLabel>
									<div className="relative">
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder="John Smith"
												className="pl-10 bg-[#156469]/40 border-[#63d392]/30 text-white focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50 placeholder:text-gray-400"
											/>
										</FormControl>
										<User className="absolute left-3 top-2.5 h-5 w-5 text-[#63d392]/70" />
									</div>
									<FormMessage className="text-red-300" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-gray-200 font-medium">
										Email Address
									</FormLabel>
									<div className="relative">
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder="you@example.com"
												type="email"
												className="pl-10 bg-[#156469]/40 border-[#63d392]/30 text-white focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50 placeholder:text-gray-400"
											/>
										</FormControl>
										<Mail className="absolute left-3 top-2.5 h-5 w-5 text-[#63d392]/70" />
									</div>
									<FormMessage className="text-red-300" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-gray-200 font-medium">
										Password
									</FormLabel>
									<div className="relative">
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder="••••••••••"
												type="password"
												className="pl-10 bg-[#156469]/40 border-[#63d392]/30 text-white focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50 placeholder:text-gray-400"
											/>
										</FormControl>
										<Lock className="absolute left-3 top-2.5 h-5 w-5 text-[#63d392]/70" />
									</div>
									<p className="text-xs text-gray-400 mt-1">
										Password must be at least 8 characters long
									</p>
									<FormMessage className="text-red-300" />
								</FormItem>
							)}
						/>
					</motion.div>

					{error ? (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<FormError message={error} />
						</motion.div>
					) : null}

					{success ? (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<FormSuccess message={success} />
						</motion.div>
					) : null}

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<Button
							disabled={isPending}
							type="submit"
							className="w-full bg-gradient-to-r from-[#63d392] to-[#4eb97b] hover:from-[#4eb97b] hover:to-[#63d392] text-[#0a4a4e] font-medium py-6 transition-all duration-300 shadow-md"
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating account...
								</>
							) : (
								<>
									Create Account
									<ArrowRight className="ml-2 h-4 w-4" />
								</>
							)}
						</Button>

						<p className="text-xs text-center text-gray-400 mt-4">
							By creating an account, you agree to our
							<Button
								variant="link"
								className="p-0 h-auto mx-1 text-xs text-[#63d392] hover:text-[#63d392]/80"
							>
								Terms of Service
							</Button>
							and
							<Button
								variant="link"
								className="p-0 h-auto mx-1 text-xs text-[#63d392] hover:text-[#63d392]/80"
							>
								Privacy Policy
							</Button>
						</p>
					</motion.div>
				</form>
			</Form>
		</CardWrapper>
	);
};

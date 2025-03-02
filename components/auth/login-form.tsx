'use client';

import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schemas';
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
import { FormSuccess } from '@/components/form-success';
import { login } from '@/actions/login';
import Link from 'next/link';
import { Mail, Lock, KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginForm = () => {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');
	const urlError =
		searchParams.get('error') === 'OAuthAccountNotLinked'
			? 'Email already in use with different provider!'
			: '';

	const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError('');
		setSuccess('');

		startTransition(() => {
			login(values, callbackUrl)
				.then((data) => {
					if (data?.error) {
						form.reset();
						setError(data.error);
					}

					if (data?.success) {
						form.reset();
						setSuccess(data.success);
					}

					if (data?.twoFactor) {
						setShowTwoFactor(true);
					}
				})
				.catch(() => setError('Something went wrong'));
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
						Welcome Back
					</h2>
					<p className="text-sm text-gray-400 mt-1">
						Sign in to continue to NoteMeet
					</p>
				</motion.div>
			}
			backButtonLabel="Don't have an account?"
			backButtonRef="/auth/register"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						{showTwoFactor ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3 }}
							>
								<FormField
									control={form.control}
									name="code"
									render={({ field }) => (
										<FormItem className="space-y-2">
											<FormLabel className="text-gray-200 font-medium">
												Two Factor Authentication Code
											</FormLabel>
											<div className="relative">
												<FormControl>
													<Input
														{...field}
														disabled={isPending}
														placeholder="••••••"
														className="pl-10 bg-[#156469]/40 border-[#63d392]/30 text-white focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50 placeholder:text-gray-400"
													/>
												</FormControl>
												<KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-[#63d392]/70" />
											</div>
											<FormMessage className="text-red-300" />
											<p className="text-xs text-gray-400 mt-1">
												Please enter the authentication code from your
												authenticator app
											</p>
										</FormItem>
									)}
								/>
							</motion.div>
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
								className="space-y-4"
							>
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
											<div className="flex justify-between">
												<FormLabel className="text-gray-200 font-medium">
													Password
												</FormLabel>
												<Button
													size="sm"
													variant="link"
													className="px-0 text-[#63d392] hover:text-[#63d392]/80 font-normal text-xs h-auto -mt-1"
													asChild
												>
													<Link href="/auth/reset">Forgot password?</Link>
												</Button>
											</div>
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
											<FormMessage className="text-red-300" />
										</FormItem>
									)}
								/>
							</motion.div>
						)}
					</div>

					{error || urlError ? (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<FormError message={error || urlError} />
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

					<Button
						disabled={isPending}
						type="submit"
						className="w-full bg-gradient-to-r from-[#63d392] to-[#4eb97b] hover:from-[#4eb97b] hover:to-[#63d392] text-[#0a4a4e] font-medium py-6 transition-all duration-300 shadow-md"
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{showTwoFactor ? 'Verifying...' : 'Signing in...'}
							</>
						) : (
							<>
								{showTwoFactor ? 'Confirm Code' : 'Sign In'}
								<ArrowRight className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};

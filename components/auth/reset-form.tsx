'use client';

import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetSchema } from '@/schemas';
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
import { reset } from '@/actions/reset';
import { Mail, KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResetForm = () => {
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
		setError('');
		setSuccess('');

		startTransition(() => {
			reset(values).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
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
						Reset Password
					</h2>
					<p className="text-sm text-gray-400 mt-1">
						We&apos;ll send you a link to reset your password
					</p>
				</motion.div>
			}
			backButtonLabel="Back to login"
			backButtonRef="/auth/login"
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-4"
			>
				<div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#156469]/40 border border-[#63d392]/30">
					<KeyRound className="w-8 h-8 text-[#63d392]" />
				</div>
			</motion.div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<motion.div
						className="space-y-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
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

					<Button
						disabled={isPending}
						type="submit"
						className="w-full bg-gradient-to-r from-[#63d392] to-[#4eb97b] hover:from-[#4eb97b] hover:to-[#63d392] text-[#0a4a4e] font-medium py-6 transition-all duration-300 shadow-md"
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending link...
							</>
						) : (
							<>
								Send Reset Link
								<ArrowRight className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};

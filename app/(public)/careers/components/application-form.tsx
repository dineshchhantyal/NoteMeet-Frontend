'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import jobs from './jobs';
import { JobApplicationSchema } from '@/schemas/job-application';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { z } from 'zod';
import {
	FormControl,
	FormField,
	FormLabel,
	FormItem,
	FormMessage,
	Form,
} from '@/components/ui/form';

export function ApplicationForm() {
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof JobApplicationSchema>>({
		resolver: zodResolver(JobApplicationSchema),
		defaultValues: {
			name: '',
			email: '',
			resume: undefined,
			coverLetter: '',
			position: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof JobApplicationSchema>) => {
		setError('');
		setSuccess('');
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('email', data.email);
		formData.append('position', data.position);
		formData.append('resume', data.resume);
		formData.append('coverLetter', data.coverLetter || '');

		startTransition(() => {
			fetch('/api/job-application', {
				method: 'POST',
				body: formData,
			})
				.then((res) => res.json())
				.then((data) => {
					if (data?.error) {
						setError(data.error);
					}

					if (data?.success) {
						setSuccess(data.success);
					}
				})
				.catch((e) => setError(e.message));
		});
	};

	return (
		<section className="mb-16 bg-card p-8 shadow-lg rounded-lg text-gray-800">
			<h2 className="text-2xl font-semibold mb-8">Apply Now</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="name">Full Name</FormLabel>
									<FormControl>
										<Input id="name" {...field} required />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							disabled={isPending}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="email">Email</FormLabel>
									<FormControl>
										<Input id="email" type="email" {...field} required />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							disabled={isPending}
						/>
					</div>

					<div>
						<FormField
							control={form.control}
							name="position"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Position</FormLabel>
									<Select
										{...field}
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a position" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{jobs.map((job) => (
												<SelectItem key={job.title} value={job.title}>
													{job.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
							disabled={isPending}
						/>
					</div>

					<div>
						<FormField
							control={form.control}
							name="resume"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="resume">Resume</FormLabel>
									<FormControl>
										<Input
											id="resume"
											type="file"
											accept=".pdf,.doc,.docx"
											onChange={(e) => {
												if (e.target.files) {
													field.onChange(e.target.files[0]);
												}
											}}
											required
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							disabled={isPending}
						/>
					</div>

					<div>
						<FormField
							control={form.control}
							name="coverLetter"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="cover-letter">Cover Letter</FormLabel>
									<FormControl>
										<Textarea id="cover-letter" {...field} rows={5} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							disabled={isPending}
						/>
					</div>

					<FormError message={error} />
					<FormSuccess message={success} />

					<Button type="submit" disabled={isPending} variant={'outline'}>
						{isPending ? 'Submitting...' : 'Submit Application'}
					</Button>
				</form>
			</Form>
		</section>
	);
}

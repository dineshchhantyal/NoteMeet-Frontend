'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { createJobApplication } from '@/actions/job-application';

export function ApplicationForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
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

	const {
		register,
		handleSubmit: handleFormSubmit,
		formState: { errors },
	} = form;

	const handleSubmit = async (data: z.infer<typeof JobApplicationSchema>) => {
		setError('');
		setSuccess('');

		startTransition(() => {
			createJobApplication(data).then((data) => {
				if (data?.error) {
					setError(data.error);
				}

				if (data?.success) {
					setSuccess(data.success);
				}
			});
		});
	};

	return (
		<section className="mb-16">
			<h2 className="text-2xl font-semibold mb-8">Apply Now</h2>
			<form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<Label htmlFor="name">Full Name</Label>
						<Input id="name" {...register('name')} required />
						{errors.name && <FormError message={errors.name.message} />}
					</div>
					<div>
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" {...register('email')} required />
						{errors.email && <FormError message={errors.email.message} />}
					</div>
				</div>

				<div>
					<Label htmlFor="position">Position</Label>
					<Select {...register('position')} required>
						<SelectTrigger>
							<SelectValue placeholder="Select a position" />
						</SelectTrigger>
						<SelectContent>
							{jobs.map((job) => (
								<SelectItem key={job.title} value={job.title}>
									{job.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.position && <FormError message={errors.position.message} />}
				</div>

				<div>
					<Label htmlFor="resume">Resume</Label>
					<Input
						id="resume"
						type="file"
						accept=".pdf,.doc,.docx"
						{...register('resume')}
						required
					/>
					{errors.resume && <FormError message={errors.resume.message} />}
				</div>

				<div>
					<Label htmlFor="cover-letter">Cover Letter</Label>
					<Textarea id="cover-letter" {...register('coverLetter')} rows={5} />
					{errors.coverLetter && (
						<FormError message={errors.coverLetter.message} />
					)}
				</div>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Submit Application'}
				</Button>
			</form>
		</section>
	);
}

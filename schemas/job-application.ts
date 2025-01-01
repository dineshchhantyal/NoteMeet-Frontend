import { z } from 'zod';
import jobs from '@/app/(public)/careers/components/jobs';

export const JobApplicationSchema = z.object({
	name: z.string().min(1, {
		message: 'Name is required',
	}),
	email: z.string().email({
		message: 'Email is required',
	}),
	resume: z.instanceof(File, {
		message: 'Resume is required',
	}),
	coverLetter: z.string().optional(),
	position: z.enum(jobs.map((job) => job.title) as [string, ...string[]]),
});

export enum JobApplicationStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
}

export interface JobApplicationInterface {
	id: number;
	name: string;
	email: string;
	resume: string;
	coverLetter?: string;
	position: string;
	status: JobApplicationStatus;
	isVerified: boolean;
	isRead: boolean;
	modifiedBy?: string;
	createdAt: Date;
	updatedAt: Date;
}

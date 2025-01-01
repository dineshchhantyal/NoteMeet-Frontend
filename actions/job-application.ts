'use server';

import { db } from '@/lib/db';
import { JobApplicationSchema } from '@/schemas/job-application';
import { z } from 'zod';
export const createJobApplication = async (
	data: z.infer<typeof JobApplicationSchema>,
) => {
	const validatedFields = JobApplicationSchema.safeParse(data);

	if (!validatedFields.success) {
		return { error: 'Invalid fields!' };
	}

	const { name, email, resume, coverLetter, position } = validatedFields.data;

	if (resume.length === 0) {
		return { error: 'Resume is required!' };
	}

	// TODO: Upload resume to S3

	try {
		await db.jobApplication.create({
			data: {
				name,
				email,
				resume,
				coverLetter: coverLetter || '',
				position,
			},
		});

		return { success: 'Application submitted successfully!' };
	} catch {
		return { error: 'Failed to submit application!' };
	}
};

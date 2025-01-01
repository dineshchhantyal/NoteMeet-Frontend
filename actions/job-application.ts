'use server';

import { db } from '@/lib/db';
import { S3BucketType } from '@/lib/s3';
import { uploadS3Object } from '@/lib/s3';
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

	if (resume.size === 0) {
		return { error: 'Resume is required!' };
	}

	// TODO: Upload resume to S3

	const resumeKey = `resumes/${name}-${email}-${position}-${Date.now()}.pdf`;
	await uploadS3Object(
		resumeKey,
		S3BucketType.MAIN_BUCKET,
		Buffer.from(await resume.arrayBuffer()),
	);

	try {
		await db.jobApplication.create({
			data: {
				name,
				email,
				resume: resumeKey,
				coverLetter: coverLetter || '',
				position,
			},
		});

		return { success: 'Application submitted successfully!' };
	} catch {
		return { error: 'Failed to submit application!' };
	}
};

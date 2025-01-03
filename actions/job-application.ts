import { db } from '@/lib/db';
import { deleteS3Object, S3BucketType } from '@/lib/s3';
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

	const resumeKey = `resumes/${name}-${email}-${position}-${Date.now()}.pdf`;
	await uploadS3Object(
		resumeKey,
		S3BucketType.MAIN_BUCKET,
		Buffer.from(await resume.arrayBuffer()),
	);

	try {
		const jobApplication = await db.jobApplication.create({
			data: {
				name,
				email,
				resume: resumeKey,
				coverLetter: coverLetter || '',
				position,
			},
		});

		return { success: 'Application submitted successfully!', jobApplication };
	} catch (error) {
		console.error(error);
		await deleteS3Object(resumeKey, S3BucketType.MAIN_BUCKET);
		return { error: 'Failed to submit application!' };
	}
};

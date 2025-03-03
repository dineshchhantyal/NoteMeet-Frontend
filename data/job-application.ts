'use server';

import { currentRole, currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generetePresigedGetUrl } from '@/lib/presigned-url';
import { S3BucketType } from '@/lib/s3';
import {
	JobApplicationInterface,
	JobApplicationStatus,
} from '@/schemas/job-application';
import { UserRole } from '@prisma/client';

export const getAdminJobApplications = async () => {
	try {
		await checkAdmin();
		const jobApplications = await db?.jobApplication.findMany();

		return jobApplications;
	} catch (error) {
		console.error('Error fetching job applications:', error);
		return [];
	}
};

export const getAdminJobApplicationById = async (id: number) => {
	try {
		const user = await checkAdmin();

		const jobApplication = await db?.jobApplication.update({
			where: { id },
			data: {
				isRead: true,
				modifiedBy: user.id,
			},
		});

		if (jobApplication) {
			const { url } = await generetePresigedGetUrl({
				key: jobApplication.resume,
				expiresIn: 60 * 60 * 2,
				bucketType: S3BucketType.MAIN_BUCKET,
				contentType: 'application/pdf',
				download: false,
			});

			jobApplication.resume = url;
		}

		return jobApplication;
	} catch (error) {
		console.error('Error fetching job application:', error);
		return null;
	}
};

export const updateAdminJobApplicationStatus = async (
	id: number,
	status: JobApplicationStatus,
) => {
	try {
		const user = await checkAdmin();
		const jobApplication = await db?.jobApplication.update({
			where: { id },
			data: {
				status,
				updatedAt: new Date(),
				modifiedBy: user.id,
			},
		});

		return jobApplication;
	} catch (error) {
		console.error('Error updating job application:', error);
		return null;
	}
};

export const deleteAdminJobApplication = async (id: number) => {
	try {
		await checkAdmin();
		const jobApplication = await db?.jobApplication.delete({ where: { id } });

		return jobApplication;
	} catch (error) {
		console.error('Error deleting job application:', error);
		return null;
	}
};

export const deleteAdminManyJobApplications = async (ids: number[]) => {
	try {
		await checkAdmin();
		const jobApplications = await db?.jobApplication.deleteMany({
			where: { id: { in: ids } },
		});

		return jobApplications;
	} catch (error) {
		console.error('Error deleting job applications:', error);
		return null;
	}
};

const checkAdmin = async () => {
	const user = await currentUser();

	if (!user || user.role !== UserRole.ADMIN) {
		throw new Error('Unauthorized');
	}

	return user;
};

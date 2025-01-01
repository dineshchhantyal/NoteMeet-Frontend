'use server';

import { currentRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { JobApplicationStatus } from '@/schemas/job-application';
import { UserRole } from '@prisma/client';

export const getAdminJobApplications = async () => {
	try {
		await checkAdmin();
		const jobApplications = await db.jobApplication.findMany();

		return jobApplications;
	} catch (error) {
		console.error('Error fetching job applications:', error);
		return [];
	}
};

export const getAdminJobApplicationById = async (id: number) => {
	try {
		await checkAdmin();
		const jobApplication = await db.jobApplication.findUnique({
			where: { id },
		});

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
		await checkAdmin();
		const jobApplication = await db.jobApplication.update({
			where: { id },
			data: { status },
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
		const jobApplication = await db.jobApplication.delete({ where: { id } });

		return jobApplication;
	} catch (error) {
		console.error('Error deleting job application:', error);
		return null;
	}
};

export const deleteAdminManyJobApplications = async (ids: number[]) => {
	try {
		await checkAdmin();
		const jobApplications = await db.jobApplication.deleteMany({
			where: { id: { in: ids } },
		});

		return jobApplications;
	} catch (error) {
		console.error('Error deleting job applications:', error);
		return null;
	}
};

const checkAdmin = async () => {
	const role = await currentRole();

	if (!role || role !== UserRole.ADMIN) {
		throw new Error('Unauthorized');
	}
};

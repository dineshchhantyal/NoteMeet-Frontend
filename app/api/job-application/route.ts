import { createJobApplication } from '@/actions/job-application'; // Import the existing function
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const jobApplicationData = {
		name: formData.get('name') as string,
		email: formData.get('email') as string,
		resume: formData.get('resume') as File,
		position: formData.get('position') as string,
		coverLetter: formData.get('coverLetter') as string | undefined,
	};

	const result = await createJobApplication(jobApplicationData);

	if (result.error) {
		return NextResponse.json(
			{ error: result.error, data: result.jobApplication },
			{ status: 400 },
		);
	}

	return NextResponse.json({ success: result.success }, { status: 200 });
}

import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import {
	generateImage,
	GenerateImageOptions,
} from '@/lib/ai/dalleImageGenerator';

export async function POST(req: NextRequest) {
	try {
		// Verify authentication
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Parse request body
		const body = await req.json();

		// Validate prompt
		if (!body.prompt) {
			return NextResponse.json(
				{ error: 'Prompt is required' },
				{ status: 400 },
			);
		}

		// Prepare options for image generation
		const options: GenerateImageOptions = {
			prompt: body.prompt,
			size: body.size || '1024x1024',
			quality: body.quality || 'standard',
			style: body.style || 'vivid',
			n: body.n || 1,
			user: user.id, // Use user ID for tracking
			meetingId: body.meetingId, // Include for S3 organization
		};

		// Generate image and store in S3
		const images = await generateImage(options);

		// Return the result with preference for S3 URLs
		return NextResponse.json({
			success: true,
			images: images.map((img) => ({
				url: img.s3Url || img.url, // Prefer S3 URL
				originalUrl: img.url,
				s3Key: img.s3Key,
				revised_prompt: img.revised_prompt,
			})),
		});
	} catch (error) {
		console.error('Error generating image:', error);
		return NextResponse.json(
			{ error: 'Failed to generate image', message: (error as Error).message },
			{ status: 500 },
		);
	}
}

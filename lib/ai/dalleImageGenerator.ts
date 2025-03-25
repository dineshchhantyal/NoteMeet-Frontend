import OpenAI from 'openai';
import { fetch } from 'next/dist/compiled/@edge-runtime/primitives';
import { uploadS3Object, S3BucketType, listS3Objects } from '@/lib/s3';
import { generetePresigedGetUrl } from '@/lib/presigned-url';
import { v4 as uuidv4 } from 'uuid';

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// S3 configuration
const S3_IMAGE_PATH = 'images/dalle/';
// URL expiration time for presigned URLs (7 days)
const PRESIGNED_URL_EXPIRY = 60 * 60 * 24 * 7;

export type ImageSize =
	| '256x256'
	| '512x512'
	| '1024x1024'
	| '1792x1024'
	| '1024x1792';
export type ImageQuality = 'standard' | 'hd';
export type ImageStyle = 'vivid' | 'natural';

export interface GenerateImageOptions {
	prompt: string;
	size?: ImageSize;
	quality?: ImageQuality;
	style?: ImageStyle;
	n?: number; // Number of images to generate (1-10)
	user?: string; // Unique identifier for the end-user
	model?: string; // Model to use, default is "dall-e-3"
	meetingId?: string; // Optional meeting ID for organization
}

export interface GeneratedImage {
	url: string;
	s3Url?: string;
	s3Key?: string;
	b64_json?: string;
	revised_prompt?: string;
}

/**
 * Upload a generated image to S3 storage and generate a presigned URL
 * @param imageUrl The OpenAI URL of the generated image
 * @param meetingId Optional meeting ID for organization
 * @returns Object with presigned S3 URL and key
 */
async function uploadImageToS3(
	imageUrl: string,
	meetingId?: string,
): Promise<{ s3Url: string; s3Key: string }> {
	try {
		// Generate a unique filename
		const filename = `${uuidv4()}.png`;

		// Organize by meeting if meetingId is provided
		const s3Path = meetingId
			? `${S3_IMAGE_PATH}${meetingId}/${filename}`
			: `${S3_IMAGE_PATH}${filename}`;

		// Download the image from OpenAI URL
		const imageResponse = await fetch(imageUrl);
		const arrayBuffer = await imageResponse.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to S3
		await uploadS3Object(s3Path, S3BucketType.MAIN_BUCKET, buffer);

		// Generate a presigned URL for secure access
		const presignedUrlResult = await generetePresigedGetUrl({
			key: s3Path,
			expiresIn: PRESIGNED_URL_EXPIRY,
			bucketType: S3BucketType.MAIN_BUCKET,
			contentType: 'image/png',
		});

		return { s3Url: presignedUrlResult.url, s3Key: s3Path };
	} catch (error) {
		console.error('Error uploading image to S3:', error);
		throw new Error(
			`Failed to upload image to S3: ${(error as Error).message}`,
		);
	}
}

/**
 * Generate images using DALL-E API and store in S3
 * @param options Options for image generation
 * @returns Generated image data with S3 URLs
 */
export async function generateImage(
	options: GenerateImageOptions,
): Promise<GeneratedImage[]> {
	try {
		const {
			prompt,
			size = '1024x1024',
			quality = 'standard',
			style = 'vivid',
			n = 1,
			user,
			model = 'dall-e-3',
			meetingId,
		} = options;

		// Enhanced prompt with meeting context and style guidance
		const enhancedPrompt = `Create a professional visual representation for a business meeting note: ${prompt}.
    The image should be clean, minimalist, and suitable for a professional presentation.`;

		// Call OpenAI API to generate images
		const response = await openai.images.generate({
			model,
			prompt: enhancedPrompt,
			n,
			size,
			quality,
			style,
			user,
			response_format: 'url',
		});

		// Map response to our GeneratedImage type with OpenAI URLs
		const generatedImages = response.data.map((image) => ({
			url: image.url as string,
			revised_prompt: image.revised_prompt,
		}));

		// Upload all images to S3 in parallel
		const s3UploadPromises = generatedImages.map(async (image) => {
			try {
				const { s3Url, s3Key } = await uploadImageToS3(image.url, meetingId);
				return {
					...image,
					s3Url,
					s3Key,
				};
			} catch (error) {
				console.error('Error processing image for S3:', error);
				// Return original image if S3 upload fails
				return image;
			}
		});

		// Wait for all uploads to complete
		return await Promise.all(s3UploadPromises);
	} catch (error) {
		console.error('Error generating image with DALL-E:', error);
		throw new Error(`Failed to generate image: ${(error as Error).message}`);
	}
}

/**
 * Generate and optimize a meeting summary image
 * @param meetingId Meeting ID
 * @param meetingTitle Title of the meeting
 * @param keyPoints Array of key points from the meeting
 * @returns URL of the generated image (S3 URL if upload successful)
 */
export async function generateMeetingSummaryImage(
	meetingId: string,
	meetingTitle: string,
	keyPoints: string[],
): Promise<string> {
	// Construct an optimized prompt from the meeting content
	const keyPointsText = keyPoints.slice(0, 3).join(', '); // Limit to top 3 points for clarity

	const prompt = `Create a professional visual representation for a business meeting titled "${meetingTitle}"
    covering these key points: ${keyPointsText}. Use a style that's modern, clean, and corporate.`;

	try {
		const images = await generateImage({
			prompt,
			size: '1024x1024',
			quality: 'standard',
			style: 'natural', // More appropriate for business content
			n: 1,
			meetingId, // Pass meetingId for S3 organization
		});

		if (images.length > 0) {
			// Prefer S3 URL if available
			return images[0].s3Url || images[0].url;
		}
		throw new Error('No image was generated');
	} catch (error) {
		console.error('Error generating meeting summary image:', error);
		throw error;
	}
}

/**
 * Create image variation using DALL-E and store in S3
 * @param imageUrl URL of the image to create variations of
 * @param meetingId Optional meeting ID for organization
 * @returns Generated image variations with S3 URLs
 */
export async function createImageVariation(
	imageUrl: string,
	meetingId?: string,
): Promise<GeneratedImage[]> {
	try {
		// Download the image
		const imageResponse = await fetch(imageUrl);
		const imageArrayBuffer = await imageResponse.arrayBuffer();

		// Convert to File which implements the required Uploadable interface
		const file = new File([imageArrayBuffer], 'image.png', {
			type: 'image/png',
			lastModified: Date.now(),
		});

		// Create the variation using the file which satisfies Uploadable
		const response = await openai.images.createVariation({
			image: file,
			n: 1,
			size: '1024x1024',
			response_format: 'url',
		});

		// Map response to our GeneratedImage type with OpenAI URLs
		const generatedImages = response.data.map((image) => ({
			url: image.url as string,
		}));

		// Upload all images to S3 in parallel
		const s3UploadPromises = generatedImages.map(async (image) => {
			try {
				const { s3Url, s3Key } = await uploadImageToS3(image.url, meetingId);
				return {
					...image,
					s3Url,
					s3Key,
				};
			} catch (error) {
				console.error('Error processing image variation for S3:', error);
				// Return original image if S3 upload fails
				return image;
			}
		});

		// Wait for all uploads to complete
		return await Promise.all(s3UploadPromises);
	} catch (error) {
		console.error('Error creating image variation with DALL-E:', error);
		throw new Error(
			`Failed to create image variation: ${(error as Error).message}`,
		);
	}
}

/**
 * Generate image based on meeting content and store in S3
 * @param meetingId Meeting ID to generate image for
 * @param description Additional description for the image
 * @returns URL of the generated image (S3 URL if upload successful)
 */
export async function generateMeetingImage(
	meetingId: string,
	description: string = '',
): Promise<string> {
	try {
		const prompt = `Create a professional visual for a business meeting: ${description}.
      Use a modern, clean design with soft gradient colors. Include business-appropriate
      imagery such as people in a conference room, charts, or abstract representations
      of collaboration. Keep the style minimalist and corporate-friendly.`;

		const images = await generateImage({
			prompt,
			size: '1024x1024',
			quality: 'standard',
			style: 'natural',
			n: 1,
			meetingId, // Pass meetingId for S3 organization
		});

		if (images.length > 0) {
			// Prefer S3 URL if available
			return images[0].s3Url || images[0].url;
		}
		throw new Error('Failed to generate meeting image');
	} catch (error) {
		console.error('Error generating meeting image:', error);
		throw error;
	}
}

/**
 * Create an API route compatible handler for image generation
 * This is designed to be used in a Next.js API route
 */
export async function generateImageAPIHandler(req: Request): Promise<Response> {
	try {
		const body = await req.json();

		// Basic validation
		if (!body.prompt) {
			return new Response(JSON.stringify({ error: 'Prompt is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const options: GenerateImageOptions = {
			prompt: body.prompt,
			size: body.size || '1024x1024',
			quality: body.quality || 'standard',
			style: body.style || 'vivid',
			n: body.n || 1,
			meetingId: body.meetingId,
		};

		const images = await generateImage(options);

		return new Response(
			JSON.stringify({
				success: true,
				images: images.map((img) => ({
					url: img.s3Url || img.url, // s3Url is now a presigned URL
					originalUrl: img.url,
					s3Key: img.s3Key,
					revised_prompt: img.revised_prompt,
				})),
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } },
		);
	} catch (error) {
		console.error('Error in image generation API handler:', error);
		return new Response(
			JSON.stringify({
				error: 'Failed to generate image',
				message: (error as Error).message,
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } },
		);
	}
}

/**
 * List previously generated images for a meeting with presigned URLs
 * @param meetingId Meeting ID to list images for
 * @returns Array of image URLs and metadata
 */
export async function listMeetingImages(meetingId: string): Promise<{
	images: Array<{ url: string; key: string; generatedAt: string }>;
}> {
	try {
		if (!meetingId) {
			throw new Error('Meeting ID is required');
		}

		// The folder path where meeting images are stored
		const prefix = `${S3_IMAGE_PATH}${meetingId}/`;

		// List objects in the meeting's image folder
		const objects = await listS3Objects(S3BucketType.MAIN_BUCKET, prefix);

		if (!objects || objects.length === 0) {
			return { images: [] };
		}

		// Generate presigned URLs for each image
		const imagePromises = objects.map(
			async (obj: { Key?: string; LastModified?: Date }) => {
				const key = obj.Key || '';
				try {
					// Generate a presigned URL for secure access
					const presignedUrlResult = await generetePresigedGetUrl({
						key: key,
						expiresIn: PRESIGNED_URL_EXPIRY,
						bucketType: S3BucketType.MAIN_BUCKET,
						contentType: 'image/png',
					});

					return {
						key,
						url: presignedUrlResult.url,
						generatedAt:
							obj.LastModified?.toISOString() || new Date().toISOString(),
						expiresAt: presignedUrlResult.expiresAt.toISOString(),
					};
				} catch (error) {
					console.error(`Error generating presigned URL for ${key}:`, error);
					// Skip this image if we can't generate a presigned URL
					return null;
				}
			},
		);

		// Wait for all presigned URL generations to complete
		const imagesWithNulls = await Promise.all(imagePromises);

		// Filter out null values (failed URL generations)
		const images = imagesWithNulls.filter((img) => img !== null) as Array<{
			url: string;
			key: string;
			generatedAt: string;
			expiresAt: string;
		}>;

		return {
			images: images.map((img) => {
				const { expiresAt, ...imageData } = img;
				console.log('expiresAt', expiresAt);
				return imageData;
			}),
		};
	} catch (error) {
		console.error('Error listing meeting images:', error);
		return { images: [] };
	}
}

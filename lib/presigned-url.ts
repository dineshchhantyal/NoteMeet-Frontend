import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Define bucket configurations type
type S3BucketConfig = {
	region: string;
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	bucketName: string;
};

// S3 credentials configuration
const s3Configs: Record<string, S3BucketConfig> = {
	RAW_RECORDINGS_BUCKET: {
		region: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_REGION!,
		credentials: {
			accessKeyId: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_ACCESS_KEY!,
			secretAccessKey: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_SECRET_KEY!,
		},
		bucketName: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_NAME!,
	},
	// Add more bucket configurations as needed, also update S3BucketType enum
};

export enum S3BucketType {
	RAW_RECORDINGS_BUCKET = 'RAW_RECORDINGS_BUCKET',
}

interface PresignedUrlParams {
	key: string;
	expiresIn: number; // in seconds
	bucketType: S3BucketType;
}

interface PresignedUrlResult {
	url: string;
	expiresAt: Date;
}

/**
 * Generates a presigned URL for S3 object upload
 * @param params PresignedUrlParams
 * @returns Promise<PresignedUrlResult>
 * @throws Error if bucket configuration is invalid
 */
export async function generatePresignedUrl({
	key,
	expiresIn,
	bucketType,
}: PresignedUrlParams): Promise<PresignedUrlResult> {
	if (!s3Configs[bucketType]) {
		throw new Error(`Invalid bucket type: ${bucketType}`);
	}

	const config = s3Configs[bucketType];

	try {
		const client = new S3Client({
			region: config.region,
			credentials: config.credentials,
		});

		const command = new PutObjectCommand({
			Bucket: config.bucketName,
			Key: key,
		});

		const url = await getSignedUrl(client, command, { expiresIn });
		const expiresAt = new Date(Date.now() + expiresIn * 1000);

		return {
			url,
			expiresAt,
		};
	} catch (error) {
		throw new Error(
			`Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
}

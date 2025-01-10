import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';

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
export const s3Configs: Record<string, S3BucketConfig> = {
	RAW_RECORDINGS_BUCKET: {
		region: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_REGION!,
		credentials: {
			accessKeyId: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_ACCESS_KEY!,
			secretAccessKey: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_SECRET_KEY!,
		},
		bucketName: process.env.AWS_S3_RAW_RECORDINGS_BUCKET_NAME!,
	},
	MAIN_BUCKET: {
		region: process.env.AWS_S3_MAIN_BUCKET_REGION!,
		credentials: {
			accessKeyId: process.env.AWS_S3_MAIN_BUCKET_ACCESS_KEY!,
			secretAccessKey: process.env.AWS_S3_MAIN_BUCKET_SECRET_KEY!,
		},
		bucketName: process.env.AWS_S3_MAIN_BUCKET_NAME!,
	},
	// Add more bucket configurations as needed, also update S3BucketType enum
};

export enum S3BucketType {
	RAW_RECORDINGS_BUCKET = 'RAW_RECORDINGS_BUCKET',
	MAIN_BUCKET = 'MAIN_BUCKET',
}

export const deleteS3Object = async (key: string, bucketType: S3BucketType) => {
	if (!s3Configs[bucketType]) {
		throw new Error(`Invalid bucket type: ${bucketType}`);
	}

	const config = s3Configs[bucketType];

	try {
		const client = new S3Client({
			region: config.region,
			credentials: config.credentials,
		});

		const command = new DeleteObjectCommand({
			Bucket: config.bucketName,
			Key: key,
		});

		await client.send(command);
	} catch (error) {
		throw new Error(
			`Failed to delete S3 object: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
};

export const uploadS3Object = async (
	key: string,
	bucketType: S3BucketType,
	body: Buffer,
) => {
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
			Body: body,
		});

		await client.send(command);
	} catch (error) {
		throw new Error(
			`Failed to upload S3 object: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
};

export const getObject = async (key: string, bucketType: S3BucketType) => {
	if (!s3Configs[bucketType]) {
		throw new Error(`Invalid bucket type: ${bucketType}`);
	}

	const config = s3Configs[bucketType];

	try {
		const client = new S3Client({
			region: config.region,
			credentials: config.credentials,
		});

		const command = new GetObjectCommand({
			Bucket: config.bucketName,
			Key: key,
		});

		const response = await client.send(command);

		return response.Body?.transformToString();
	} catch (error) {
		throw new Error(
			`Failed to get S3 object: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
};

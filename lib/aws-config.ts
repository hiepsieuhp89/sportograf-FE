import { S3Client } from '@aws-sdk/client-s3';

// AWS Configuration
export const s3Config = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
  bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'my-v0-project',
};

// Initialize S3 Client
export const s3Client = new S3Client(s3Config); 
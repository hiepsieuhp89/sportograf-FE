import { S3Client } from '@aws-sdk/client-s3';

// Validate required environment variables
const requiredEnvVars = {
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(`Missing required AWS environment variables: ${missingVars.join(', ')}`);
}

// AWS Configuration
export const s3Config = {
  region: requiredEnvVars.region || 'us-east-1',
  credentials: {
    accessKeyId: requiredEnvVars.accessKeyId || '',
    secretAccessKey: requiredEnvVars.secretAccessKey || '',
  },
  bucketName: requiredEnvVars.bucketName || '',
};

// Initialize S3 Client with retry options
export const s3Client = new S3Client({
  ...s3Config,
  maxAttempts: 3, // Retry failed requests up to 3 times
  retryMode: 'adaptive', // Use adaptive retry delays
}); 
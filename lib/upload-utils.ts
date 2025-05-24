import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, s3Config } from './aws-config';

/**
 * Uploads a file to AWS S3 and returns the URL
 * @param file File to upload
 * @param path Path where the file should be stored (e.g. 'photographers/profile-images/')
 * @returns Promise<string> The URL of the uploaded file
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Create a unique file name
    const fileName = `${path}${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    
    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: fileName,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Return the public URL
    return `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}; 
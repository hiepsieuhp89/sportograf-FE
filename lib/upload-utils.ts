import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, s3Config } from './aws-config'

/**
 * Uploads a file to AWS S3 and returns the URL
 * @param file File to upload
 * @param path Path where the file should be stored (e.g. 'photographers/profile-images/')
 * @returns Promise<string> The URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    // Create unique file name to prevent overwriting
    const uniqueFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const fullPath = `${path}/${uniqueFileName}`

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: fullPath,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    })

    await s3Client.send(command)

    // Construct the URL
    // Format: https://<bucket-name>.s3.<region>.amazonaws.com/<path>
    const fileUrl = `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${fullPath}`
    
    return fileUrl
  } catch (error) {
    console.error("Error uploading file to S3:", error)
    throw new Error("Failed to upload file to S3")
  }
} 
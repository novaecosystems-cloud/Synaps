import { admin } from './firebase-admin';

export const bucket = admin.storage().bucket();

export async function generateV4UploadSignedUrl(gcsPath: string, mimeType: string) {
  const options = {
    version: 'v4' as const,
    action: 'write' as const,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: mimeType,
  };

  const [url] = await bucket.file(gcsPath).getSignedUrl(options);
  return url;
}

export async function generateV4ReadSignedUrl(gcsPath: string) {
  const options = {
    version: 'v4' as const,
    action: 'read' as const,
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  };

  const [url] = await bucket.file(gcsPath).getSignedUrl(options);
  return url;
}

export async function deleteGcsFile(gcsPath: string) {
  try {
    await bucket.file(gcsPath).delete();
    return true;
  } catch (error) {
    console.error(`Failed to delete GCS file at ${gcsPath}:`, error);
    return false;
  }
}

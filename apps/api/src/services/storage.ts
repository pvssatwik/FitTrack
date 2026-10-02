import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config';

// Cloudflare R2 (S3-compatible). Browser uploads directly via a short-lived URL, so large
// archives never pass through the API (avoids Railway request limits).
const s3 = new S3Client({
  region: config.S3_REGION,
  endpoint: config.S3_ENDPOINT,
  credentials: config.S3_ACCESS_KEY_ID
    ? { accessKeyId: config.S3_ACCESS_KEY_ID, secretAccessKey: config.S3_SECRET_ACCESS_KEY! }
    : undefined,
});

export function presignUpload(key: string, contentType: string, expiresIn = 600) {
  return getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: config.S3_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn },
  );
}

export function presignDownload(key: string, expiresIn = 600) {
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: config.S3_BUCKET, Key: key }), { expiresIn });
}

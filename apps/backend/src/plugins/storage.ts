import type { Buffer } from "node:buffer"
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"

interface UploadImageArgs {
  image: Buffer
  bookmarkId: string
  userId: string
}

if (!process.env.BUCKET_ACCESS_KEY || !process.env.BUCKET_SECRET_KEY || !process.env.BUCKET_URL) {
  throw new Error("Object store credentials missing!")
}

export const client = new S3Client({
  region: "auto",
  endpoint: process.env.BUCKET_URL,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_KEY,
  },
})

const bucket = process.env.BUCKET_NAME ?? "briefkasten-dev"

// Grant anonymous read on the bucket's objects. Screenshots are served via the
// public BUCKET_PUBLIC_URL, so the proxy fetches them unauthenticated. RustFS/MinIO
// ignore per-object public-read ACLs and require a bucket policy for this. Best-effort:
// some providers (e.g. R2) manage public access out-of-band and reject PutBucketPolicy.
const applyPublicReadPolicy = async () => {
  const policy = JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  })

  try {
    await client.send(new PutBucketPolicyCommand({ Bucket: bucket, Policy: policy }))
  } catch (err) {
    console.warn(
      `Could not set public-read policy on "${bucket}" (provider may manage public access separately, e.g. R2):`,
      err
    )
  }
}

/**
 * Ensure the object-storage bucket exists and is publicly readable. Idempotent: a
 * HeadBucket check skips creation when it already exists (e.g. the managed prod bucket
 * on R2), and only creates it when missing (local RustFS dev bootstrap). The public-read
 * policy is (re)applied on every startup. Never throws - storage provisioning must not
 * block server startup.
 */
export const ensureBucket = async () => {
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
  } catch {
    try {
      await client.send(new CreateBucketCommand({ Bucket: bucket }))
      console.log(`Created object storage bucket "${bucket}"`)
    } catch (err) {
      console.warn(`Could not ensure object storage bucket "${bucket}":`, err)
    }
  }

  await applyPublicReadPolicy()
}

export const uploadImage = async ({ image, bookmarkId, userId }: UploadImageArgs) => {
  const imagePath = `${userId}/${bookmarkId}.png`
  const putCommand = new PutObjectCommand({
    ACL: "public-read",
    Bucket: bucket,
    Key: imagePath,
    Metadata: {
      userId,
      bookmarkId,
    },
    Body: image,
    ContentType: "image/png",
    ContentLength: image.length,
  })

  await client.send(putCommand)

  // i.e. https://dev-img.briefkastenhq.com/cls57rev90000iw28cg9fl2nr/clx0abc123def456.png
  return `${process.env.BUCKET_PUBLIC_URL}/${imagePath}`
}

import type { Buffer } from "node:buffer"
import {
  CreateBucketCommand,
  HeadBucketCommand,
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

/**
 * Ensure the object-storage bucket exists. Idempotent: a HeadBucket check
 * skips creation when it already exists (e.g. the managed prod bucket on R2),
 * and only creates it when missing (local RustFS dev bootstrap). Never throws -
 * storage provisioning must not block server startup.
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

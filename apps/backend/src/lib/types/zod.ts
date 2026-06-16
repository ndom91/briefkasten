/**
 * Central import point for Prisma model types.
 *
 * The backend validates with hand-written zod schemas (see src/routes/*\/schema.ts),
 * so only the Prisma Client types are re-exported here. The prisma-zod-generator
 * output under prisma/generated is not consumed by the backend.
 */

// Re-export TypeScript types from Prisma Client for convenience
export type {
  Account,
  Bookmark,
  Category,
  Feed,
  FeedEntry,
  FeedEntryMedia,
  Session,
  Tag,
  TagsOnBookmarks,
  TwoFactor,
  User,
  Verification,
} from "../../prisma-client/client.js"

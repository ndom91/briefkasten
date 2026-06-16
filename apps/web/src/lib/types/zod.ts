/**
 * Re-export all Zod schemas from generated Prisma Zod schemas
 * This file provides a central import point for all Zod schemas
 */

// Re-export all schemas from generated schemas
export * from "../../../prisma/generated/schemas"

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

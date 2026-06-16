import { z } from "zod"

export const ScrollerTypes = {
  BOOKMARKS: "BOOKMARKS",
  FEEDS: "FEEDS",
} as const

const bookmarkFlatTagsSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  url: z.string(),
  image: z.string().optional(),
  imageBlur: z.string().optional(),
  desc: z.string().optional(),
  categoryId: z.string().optional(),
  metadata: z.record(z.string(), z.string()),
  archived: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  category: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      userId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .optional(),

  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      userId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
})

export type BookmarkFlatTags = z.infer<typeof bookmarkFlatTagsSchema>

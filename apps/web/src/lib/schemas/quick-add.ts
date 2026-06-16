import { z } from "zod"

export const formSchema = z.object({
  title: z.string({ error: "A title is required" }).min(2).max(100),
  url: z.url({ error: "A URL is required" }).max(100),
  description: z.string().max(500).optional().default(""),
  categoryId: z.string().max(50).optional().default(""),
  tags: z.array(
    z.object({
      id: z.cuid(),
      name: z.string(),
      userId: z.string().min(2).max(50),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
})

export type FormSchema = z.infer<typeof formSchema>

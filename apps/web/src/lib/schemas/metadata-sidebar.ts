import { z } from "zod"

export const formSchema = z.object({
  id: z.string().cuid(),
  title: z.string({ message: "A title is required" }).min(2),
  url: z.string({ message: "A URL is required" }).url(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  category: z.string().cuid().optional(),
  // category: z.object({
  //   id: z.string().cuid(),
  //   name: z.string(),
  //   description: z.string().optional(),
  //   userId: z.string().min(2).max(50),
  //   createdAt: z.date(),
  //   updatedAt: z.date(),
  // }),
  tags: z.array(
    z.object({
      id: z.string().cuid(),
      name: z.string(),
      userId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
})

export type FormSchema = typeof formSchema

import { fail } from "@sveltejs/kit"
import { getUserId, requireUser } from "$/lib/auth"
import { db } from "$lib/prisma"
import { CategoryCreateInputObjectSchema } from "$lib/types/zod.js"
import { Prisma } from "../../../prisma-client/client.js"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
  const { userId, session } = requireUser(event, { redirectToLogin: true })

  const response = await db.category.findMany({
    where: { userId },
  })

  return {
    session,
    categories: response,
  }
}

export const actions: Actions = {
  createCategory: async (event) => {
    const userId = getUserId(event.locals)
    if (!userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const formData = Object.fromEntries(await event.request.formData())
    const { name, description } = formData as {
      name: string
      description: string
    }

    try {
      CategoryCreateInputObjectSchema.parse(formData)

      await db.category.create({
        data: {
          name,
          description,
          userId,
        },
      })

      return { message: "Category Created", type: "success", form: formData }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        console.error("There is a unique constraint violation, category could not be created")
      } else {
        console.error(error)
      }
      // const { fieldErrors: errors } = error.flatten();

      return fail(500, {
        message: "Error",
        type: "error",
        error,
        data: { name, description },
      })
    }
  },
  deleteCategory: async (event) => {
    try {
      const userId = getUserId(event.locals)
      if (!userId) {
        return fail(401, { type: "error", error: "Unauthenticated" })
      }
      const formData = await event.request.formData()

      const categoryId = formData.get("id")
      if (!categoryId) {
        return fail(401, { type: "error", error: "Requires category ID" })
      }

      await db.category.delete({
        where: {
          id: String(categoryId),
          userId,
        },
      })

      return { message: "Category Deleted", type: "success" }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }

      return fail(500, {
        message: "Error",
        type: "error",
        error,
      })
    }
  },
}

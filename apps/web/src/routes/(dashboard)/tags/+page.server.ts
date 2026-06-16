import { fail } from "@sveltejs/kit"
import { Prisma } from "$/prisma-client/client.js"
import { getUserId, requireUser } from "$/lib/auth"
import { db } from "$lib/prisma"
import { TagCreateOneSchema } from "$lib/types/zod.js"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
  const { userId } = requireUser(event, { redirectToLogin: true })

  const response = await db.tag.findMany({
    where: { userId },
  })

  return {
    tags: response,
  }
}

export const actions: Actions = {
  createTag: async (event) => {
    const userId = getUserId(event.locals)
    if (!userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const formData = await event.request.formData()
    const dataEntries = Object.fromEntries(formData.entries())

    try {
      const parsedData = TagCreateOneSchema.parse(dataEntries)

      await db.tag.create({
        data: {
          name: parsedData.data.name,
          userId,
        },
      })

      return { message: "Tag Created", type: "success", form: dataEntries }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        console.error("There is a unique constraint violation, tag could not be created")
      } else {
        console.error(error)
      }

      return fail(500, {
        message: "Error",
        type: "error",
        error,
        data: dataEntries,
      })
    }
  },
  deleteTag: async (event) => {
    try {
      const userId = getUserId(event.locals)
      if (!userId) {
        return fail(401, { type: "error", error: "Unauthenticated" })
      }
      const formData = await event.request.formData()

      const tagId = formData.get("id")
      if (!tagId) {
        return fail(401, { type: "error", error: "Requires tag ID" })
      }

      await db.tag.delete({
        where: {
          id: String(tagId),
          userId,
        },
      })

      return { message: "Tag Deleted", type: "success" }
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

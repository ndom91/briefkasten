"use server"

import { z } from "zod"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

const schema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid Name",
    })
    .max(190),
  description: z
    .string({
      invalid_type_error: "Invalid Description",
    })
    .max(190),
})

const createCategory = async (userId, formData) => {
  const headersList = headers()
  const referer = headersList.get("referer")

  const host = new URL(referer).host
  const protocol = new URL(referer).protocol

  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  })

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const addResponse = await fetch(`${protocol}${host}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...validatedFields,
        userId,
      }),
    })
    if (addResponse.ok) {
      revalidatePath("/categories")
      return addResponse.json()
    }
  } catch (error) {
    console.error(error)
    return {
      message: "Error saving new category",
    }
  }
}

const deleteCategory = async (userId, id) => {
  const headersList = headers()
  const referer = headersList.get("referer")

  const host = new URL(referer).host
  const protocol = new URL(referer).protocol

  try {
    const deleteResponse = await fetch(`${protocol}${host}/api/categories`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        userId,
      }),
    })
    if (deleteResponse.ok) {
      revalidatePath("/categories")
    }
  } catch (error) {
    console.error(error)
  }
}

const saveCategoryEdit = async ({ name, description, id, userId }) => {
  const headersList = headers()
  const referer = headersList.get("referer")

  const host = new URL(referer).host
  const protocol = new URL(referer).protocol

  try {
    if (name.length > 190 || description.length > 190) {
      // toast(toastTypes.WARNING, "Category or name too long")
      return
    }
    const editRes = await fetch(`${protocol}${host}/api/categories`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        userId,
        name,
        description,
      }),
    })
    console.log("EDIT RES", editRes.ok)
    console.log("EDIT STATUS", editRes.status)
    if (editRes.ok) {
      return editRes.json()
      // updateCategory(id, {
      //   name: categoryName,
      //   description: categoryDesc,
      // })
      // toggleEditMode()
      // toast(toastTypes.SUCCESS, `Successfully edited "${name}"`)
    } else {
      return { errors: ["Could not save updated category!"] }
    }
  } catch (error) {
    console.error(error)
    return { message: error }
    // toast(toastTypes.ERROR, `Error editing "${name}"`)
  }
}

export { createCategory, deleteCategory, saveCategoryEdit }

"use server"

import { z } from "zod"

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
    const addRes = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...validatedFields,
        userId,
      }),
    })
    if (addRes.ok) {
      return addRes.json()
    }
  } catch (error) {
    console.error(error)
    return {
      message: "Error saving new category",
    }
  }
}

export { createCategory }

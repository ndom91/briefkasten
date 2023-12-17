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
    // if (categoryName.length > 190 || categoryDesc.length > 190) {
    //   toast(toastTypes.WARNING, "Category or name too long")
    //   return
    // }
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
      const addData = await addRes.json()
      // addCategory({ ...addData.data, desc: addData.data.description })
      // setCategoryName("")
      // setCategoryDesc("")
      // toast(toastTypes.SUCCESS, `Successfully saved "${categoryName}"`)
    }
  } catch (error) {
    console.error(error)
    // toast(toastTypes.ERROR, `Error saving ${categoryName}`)
  }
}

export { createCategory }

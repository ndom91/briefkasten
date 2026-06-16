import type { ActionResult } from "@sveltejs/kit"
import { toast } from "svelte-sonner"
import { dev } from "$app/environment"
import { applyAction } from "$app/forms"
import { invalidateAll } from "$app/navigation"

export const handleActionResults = (callback?: (data: any | unknown) => any) => {
  return function form_enhance() {
    return async ({
      result,
      formElement,
    }: {
      formElement: HTMLFormElement
      result: ActionResult<{ message: string }>
    }) => {
      dev && console.log(result)
      if (result.type === "success") {
        toast.success(result?.data?.message ?? "Success")
        formElement.reset()
      } else if (result.type === "error") {
        toast.error(`Error: ${result.error.message}`)
        dev && console.log(result)
      } else {
        toast.error("Something went wrong. Please try again.")
        dev && console.log(result)
      }
      await invalidateAll()
      await applyAction(result)
      if (callback && "data" in result && result?.data) {
        callback(result.data)
      }
    }
  }
}

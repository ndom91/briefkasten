import { type Readable, readable } from "svelte/store"
import { browser } from "$app/environment"

const defaultDocument = browser ? document : undefined

function getCurrentDocumentVisibility(document = defaultDocument): DocumentVisibilityState {
  if (!document) {
    return "visible"
  }

  return document.visibilityState
}

export function documentVisibilityStore(): Readable<DocumentVisibilityState> {
  const visibility = readable(getCurrentDocumentVisibility(defaultDocument), (set) => {
    function handler() {
      set(getCurrentDocumentVisibility())
    }

    if (document) {
      document.addEventListener("visibilitychange", handler)

      return () => {
        document.removeEventListener("visibilitychange", handler)
      }
    }
  })

  return visibility
}

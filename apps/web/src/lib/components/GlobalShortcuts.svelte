<script lang="ts">
import { goto } from "$app/navigation"
import KeyboardShortcutsHelp from "$lib/components/KeyboardShortcutsHelp.svelte"
import { isEditableTarget } from "$lib/utils/keyboard"

let element = $state<HTMLDialogElement | undefined>()

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.repeat || isEditableTarget(e.target)) {
    return
  }
  if (e.key === "Escape" && element) {
    e.preventDefault()
    element.close()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "/") {
    e.preventDefault()
    element?.showModal()
  }
  if (e.shiftKey && e.key === "!") {
    e.preventDefault()
    goto("/")
  }
  if (e.shiftKey && e.key === "@") {
    e.preventDefault()
    goto("/bookmarks")
  }
  if (e.shiftKey && e.key === "#") {
    e.preventDefault()
    goto("/feeds")
  }
  if (e.shiftKey && e.key === "$") {
    e.preventDefault()
    goto("/archives")
  }
  if (e.shiftKey && e.key === "%") {
    e.preventDefault()
    goto("/categories")
  }
  if (e.shiftKey && e.key === "^") {
    e.preventDefault()
    goto("/tags")
  }
  if (e.shiftKey && e.key === "&") {
    e.preventDefault()
    goto("/settings")
  }
}
</script>

<svelte:window onkeydown={handleKeyDown} />

<KeyboardShortcutsHelp bind:dialogElement={element} />

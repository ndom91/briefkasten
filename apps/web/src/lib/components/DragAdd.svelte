<script lang="ts">
import { toast } from "svelte-sonner"
import { z } from "zod"
import { cn } from "$/lib/utils"
import ConfirmAddDialog from "$lib/components/ConfirmAddDialog.svelte"
import { isEditableTarget } from "$lib/utils/keyboard"

const parseData = (text: string | undefined): string | undefined => {
  try {
    const rawUrl = z.string().url().parse(text)
    return rawUrl
  } catch (error) {
    toast.error("Invalid URL")
  }
}

let isDragOver = $state(false)
let showConfirmAddDialog: HTMLDialogElement | undefined = $state()
let url = $state("")

const handleDragEnter = (e: DragEvent) => {
  if (isEditableTarget(e.target)) {
    return
  }

  e.preventDefault()
  e.stopPropagation()

  if (e.relatedTarget) {
    return
  }
  isDragOver = true
}

const handleDrop = (e: DragEvent) => {
  if (isEditableTarget(e.target)) {
    return
  }

  e.preventDefault()
  e.stopPropagation()
  isDragOver = false

  const text = e.dataTransfer?.getData("text/plain")
  const parsedUrl = parseData(text)
  if (parsedUrl) {
    const parsedHostname = new URL(parsedUrl).hostname

    // Ignore invalid URLs and URLs from the same domain
    if (!parsedHostname) {
      return
    }
    if (parsedHostname === location.hostname) {
      return
    }

    url = parsedUrl
    showConfirmAddDialog?.showModal()
  }
}

const handlePaste = (e: ClipboardEvent) => {
  if (isEditableTarget(e.target)) {
    return
  }
  const text = e.clipboardData?.getData("text/plain")
  const parsedUrl = parseData(text)
  if (parsedUrl) {
    url = parsedUrl
    showConfirmAddDialog?.showModal()
  }
}

// Allow closing dropover backdrop with ESC
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.repeat || isEditableTarget(e.target)) {
    return
  }
  if (e.key === "Escape" && showConfirmAddDialog) {
    e.preventDefault()
    showConfirmAddDialog.close()
  }
}

const handleDragOver = (e: DragEvent) => {
  if (isEditableTarget(e.target)) {
    return
  }

  e.preventDefault()
}

// Hide drop backdrop after 4s
$effect(() => {
  if (isDragOver) {
    setTimeout(() => {
      isDragOver = false
    }, 4000)
  }
})
</script>

<svelte:window onkeydown={handleKeyDown} />

<svelte:body
  onpaste={handlePaste}
  ondragenter={handleDragEnter}
  ondragover={handleDragOver}
/>

<ConfirmAddDialog {url} bind:dialogElement={showConfirmAddDialog} />

<div
  role="region"
  aria-hidden="true"
  class={cn(
    "grid fixed inset-0 z-50 place-items-center bg-black transition duration-500 bg-opacity-0 backdrop-blur-sm p-8",
    isDragOver ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
  )}
>
  <div
    role="region"
    aria-hidden="true"
    class="m-12 grid h-full w-full place-items-center rounded-lg border-4 border-dashed border-black border-opacity-75 p-12 dark:border-white"
    ondragover={(e) => e.preventDefault()}
    ondrop={handleDrop}
  >
    <span class="text-3xl">Drop Here</span>
  </div>
</div>

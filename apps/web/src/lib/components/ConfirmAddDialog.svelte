<script lang="ts">
import { toast } from "svelte-sonner"
import { invalidate } from "$app/navigation"
import Dialog from "$lib/components/Dialog.svelte"
import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
import { BookmarksService } from "$lib/state/bookmarks.svelte"
import { getContext } from "$lib/utils/context"

const bookmarksService = getContext(BookmarksService)

let {
  dialogElement = $bindable(),
  url,
}: {
  dialogElement: HTMLDialogElement | undefined
  url: string
} = $props()

let loading = $state(false)

const handleConfirm = async (): Promise<void> => {
  try {
    loading = true
    const res = await fetch("/api/v1/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          url,
        },
      ]),
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    const { data } = (await res.json()) as { data?: LoadBookmarkFlatTags[] }
    if (data?.length) {
      bookmarksService.add(data)
    }

    await invalidate("app:bookmarks")
    toast.success(`Added "${url}"`)
  } catch (error) {
    console.error(error)
    toast.error(String(error))
  } finally {
    loading = false
    dialogElement?.close()
  }
}
</script>

<Dialog id="confirm-add" bind:element={dialogElement} confirmAction={handleConfirm}>
  {#snippet header()}
    <div class="flex justify-between">
      <h2 class="text-2xl font-bold">Create</h2>
    </div>
  {/snippet}
  {#snippet confirmLabel()}
    Add
    {#if loading}
      <LoadingIndicator size="sm" class="ml-2" />
    {/if}
  {/snippet}
  <div>
    <div>Are you sure you want to add this URL?</div>
    <div class="mt-2 line-clamp-2 break-all font-bold">{url}</div>
  </div>
</Dialog>

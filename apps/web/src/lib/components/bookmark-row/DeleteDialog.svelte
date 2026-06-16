<script lang="ts">
import { cn } from "$/lib/utils"
import { enhance } from "$app/forms"
import Dialog from "$lib/components/Dialog.svelte"
import { buttonVariants } from "$lib/components/ui/button"
import { BookmarksService } from "$lib/state/bookmarks.svelte"
import { getContext } from "$lib/utils/context"
import { handleActionResults } from "$lib/utils/form-action"

const bookmarksService = getContext(BookmarksService)

let {
  dialogElement = $bindable(),
  bookmarkId,
  onDeleted,
}: {
  dialogElement: HTMLDialogElement | undefined
  bookmarkId: string
  onDeleted?: (bookmarkId: string) => void
} = $props()

const bookmark = $derived(bookmarksService.find(bookmarkId))
</script>

<Dialog footer={false} id="delete-bookmark" bind:element={dialogElement}>
  <div>
    <h3 class="mb-4 text-lg font-bold">Delete</h3>
    <div>
      Are you sure you want to delete <b class="break-all">{bookmark?.url}</b>? <br /><br />This
      action cannot be undone. This will permanently delete your bookmark.
    </div>
  </div>
  <div class="flex flex-col gap-4 sm:flex-row sm:justify-end">
    <button
      onclick={() => dialogElement?.close()}
      class={cn(buttonVariants({ variant: "secondary" }), "w-full sm:w-auto")}
    >
      Cancel
    </button>
    <form
      action="/bookmarks?/deleteBookmark"
      method="post"
      use:enhance={handleActionResults(() => {
        dialogElement?.close()
        if (onDeleted) {
          onDeleted(bookmarkId)
        } else {
          bookmarksService.remove(bookmarkId)
        }
      })}
    >
      <input type="hidden" name="bookmarkId" value={bookmarkId} />
      <button
        class={cn(buttonVariants({ variant: "destructive" }), "w-full sm:w-auto")}
        type="submit"
      >
        Continue
      </button>
    </form>
  </div>
</Dialog>

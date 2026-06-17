<script lang="ts">
import { page } from "$app/state"
import { useInterface } from "$lib/state/ui.svelte"
import { cn } from "$lib/utils"
import { isEditableTarget } from "$lib/utils/keyboard"
import BookmarkContent from "./BookmarkContent.svelte"
import FeedContent from "./FeedContent.svelte"

const ui = useInterface()
let metadataSidebarElement = $state<HTMLElement>()!

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.repeat || isEditableTarget(event.target)) {
    return
  }
  if (event.code === "BracketRight") {
    event.preventDefault()
    ui.toggleMetadataSidebar()
  }
}

const bookmarkPage = $derived(
  page.url.pathname === "/bookmarks" || page.url.pathname === "/archives"
)
const feedPage = $derived(page.url.pathname === "/feeds")

const mutate = () => {
  if (ui.metadataSidebarOpen) {
    metadataSidebarElement.style.width = "18rem"
  } else {
    metadataSidebarElement.style.width = "0rem"
  }
}

$effect(() => {
  // Hack to get effect to run on sidebar toggle
  ui.metadataSidebarOpen
  mutate()
})
</script>

<svelte:window onkeydown={handleKeyDown} />

<aside
  bind:this={metadataSidebarElement}
  class={cn(
    "space-between relative flex h-screen shrink-0 flex-col border-l bg-neutral-50 transition-all dark:border-l-zinc-800 dark:bg-neutral-900",
  )}
>
  {#if ui.metadataSidebarOpen}
    {#if bookmarkPage}
      <BookmarkContent />
    {:else if feedPage}
      <FeedContent />
    {/if}
  {/if}
</aside>

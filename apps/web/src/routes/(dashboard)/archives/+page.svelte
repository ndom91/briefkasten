<script lang="ts">
import { onDestroy } from "svelte"
import { watch } from "runed"
import { InfiniteLoader, LoaderState } from "svelte-infinite"
import { toast } from "svelte-sonner"
import { page } from "$app/state"
import { BookmarkRow } from "$lib/components/bookmark-row"
import EmptyState from "$lib/components/EmptyState.svelte"
import { Navbar } from "$lib/components/navbar"
import { BookmarksService } from "$lib/state/bookmarks.svelte"
import { useInterface } from "$lib/state/ui.svelte"
import { isEditableTarget } from "$lib/utils/keyboard"
import { Logger, loggerLevels } from "$lib/utils/logger"

const ui = useInterface()
const bookmarksService = new BookmarksService(page.data.bookmarks?.data ?? [])
const loaderState = new LoaderState()
const isSearching = $derived(ui.searchQuery.trim().length > 0)

const rootElement = $state<HTMLElement>()

const limitLoadCount = 20
const logger = new Logger({ level: loggerLevels.DEBUG })

if (page.data.error) {
  logger.error(String(page.data.error))
}

const fetchSearchResults = async ({
  limit = limitLoadCount,
  skip = 0,
}: {
  limit?: number
  skip?: number
}) => {
  try {
    const searchParams = new URLSearchParams({
      archived: "true",
      skip: String(skip),
      limit: String(limit),
    })

    if (ui.searchQuery) {
      searchParams.set("q", ui.searchQuery)
    }

    const searchResponse = await fetch(`/api/v1/bookmarks?${searchParams}`)
    const { data, count } = await searchResponse.json()
    return {
      data,
      count,
    }
  } catch (error) {
    console.error(String(error))
    toast.error(String(error))
  }
}

// Load more items on infinite scroll
const loadMore = async () => {
  try {
    const limit = limitLoadCount
    const skip = bookmarksService.bookmarks.length

    const searchResults = await fetchSearchResults({ limit, skip })
    if (!searchResults?.data) {
      return
    }

    if (searchResults.data.length) {
      bookmarksService.append(searchResults.data)
    }

    if (bookmarksService.bookmarks.length >= searchResults.count) {
      loaderState.complete()
    } else {
      loaderState.loaded()
    }
  } catch (error) {
    console.error(String(error))

    loaderState.error()
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (isEditableTarget(e.target)) {
    return
  }
  if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "j" || e.key === "k") {
    e.preventDefault()
    const currentActiveElement = e.target as HTMLElement
    const currentActiveElementIndex = bookmarksService.bookmarks.findIndex(
      (item) => item.id === currentActiveElement.dataset.id
    )
    const nextIndex =
      e.key === "ArrowDown" || e.key === "j"
        ? currentActiveElementIndex + 1
        : currentActiveElementIndex - 1
    const nextElement = document.querySelector(
      `[data-id="${bookmarksService.bookmarks[nextIndex]?.id}"]`
    ) as HTMLElement

    if (nextElement) {
      nextElement.focus()
    }
  }
  if (e.key === "o") {
    e.preventDefault()
    const currentActiveElement = e.target as HTMLElement
    const currentActiveElementIndex = bookmarksService.bookmarks.findIndex(
      (item) => item.id === currentActiveElement.dataset.id
    )
    const targetLink = bookmarksService.bookmarks[currentActiveElementIndex]?.url
    if (!targetLink) {
      toast.error("No item selected")
      return
    }
    window.open(targetLink, "_target")
  }
}

// Handle search input changes
// Reset and execute first search for new query
watch.pre(
  () => ui.searchQuery,
  () => {
    loaderState.reset()
    bookmarksService.clear()
    void loadMore()
  }
)

// Reset state on unmount
onDestroy(() => {
  if (ui.searchQuery) {
    ui.searchQuery = ""
  }
})

const clearSearch = () => {
  ui.searchQuery = ""
}
</script>

<svelte:head>
  <title>Briefkasten | Archives</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

<Navbar />
<main
  class="align-start flex max-h-[calc(100vh-4rem)] w-full min-w-0 flex-col justify-start gap-2 overflow-y-scroll outline-none"
>
  {#if bookmarksService.bookmarks?.length}
    <div class="h-full">
      <InfiniteLoader {loaderState} triggerLoad={loadMore} intersectionOptions={{ root: rootElement }}>
        {#each bookmarksService.bookmarks as item (item.id)}
          <BookmarkRow bookmark={item} onDelete={(bookmarkId) => bookmarksService.remove(bookmarkId)} />
        {/each}
        {#snippet noData()}
          {#if bookmarksService.bookmarks.length >= 10}
            <div class="text-2xl">No more data</div>
          {/if}
        {/snippet}
      </InfiniteLoader>
    </div>
  {:else if isSearching}
    <EmptyState showArrow={false} />
    <div class="text-muted-foreground mx-auto flex w-full max-w-md flex-col items-center gap-3 text-center">
      <p>No archived bookmarks found for "{ui.searchQuery}".</p>
      <button
        type="button"
        class="text-foreground rounded-md border px-3 py-2 text-sm hover:bg-muted"
        onclick={clearSearch}
      >
        Clear search
      </button>
    </div>
  {:else}
    <EmptyState showArrow={false} />
    <div class="text-muted-foreground w-full text-center">
      Try archiving a <a class="underline underline-offset-4" href="/bookmarks">bookmark</a>
    </div>
  {/if}
</main>

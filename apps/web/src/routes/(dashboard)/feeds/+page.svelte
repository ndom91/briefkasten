<script lang="ts">
import { watch } from "runed"
import { onDestroy } from "svelte"
import { InfiniteLoader, LoaderState } from "svelte-infinite"
import { toast } from "svelte-sonner"
import { invalidateAll } from "$app/navigation"
import { page } from "$app/stores"
import Blob from "$lib/assets/blob1.png"
import EmptyState from "$lib/components/EmptyState.svelte"
import { FeedRow } from "$lib/components/feed-row"
import { Navbar } from "$lib/components/navbar"
import { FeedEntriesService } from "$lib/state/feedEntries.svelte"
import { useInterface } from "$lib/state/ui.svelte"
import { getContext } from "$lib/utils/context"
import { documentVisibilityStore } from "$lib/utils/documentVisibility"
import { isEditableTarget } from "$lib/utils/keyboard"
import FilterBar from "./FilterBar.svelte"
import { handleSummarizeText, registerSummarizationWorker } from "./summarization.svelte"
import { handleGenerateSpeech, registerTtsWorker } from "./tts.svelte"

const feedEntriesService = getContext(FeedEntriesService)

let innerWidth = $state(1000)
let innerHeight = $state(800)

const ui = useInterface()

// Log error from page server loading
if ($page.data.error) {
  console.error($page.data.error)
}

const loaderState = new LoaderState()
let rootElement = $state<HTMLElement>()
const isSearching = $derived(ui.searchQuery.trim().length > 0)
const limitLoadCount = 20

registerTtsWorker()
registerSummarizationWorker()

// Reload feed when coming back to tab
const visibility = documentVisibilityStore()
let prevVisibility: DocumentVisibilityState = "visible"

// Page visibility auto refresh
$effect(() => {
  if (prevVisibility === "hidden" && $visibility === "visible") {
    void invalidateAll()
  }
  prevVisibility = $visibility
})

const fetchSearchResults = async ({
  limit = limitLoadCount,
  skip = 0,
}: {
  limit?: number
  skip?: number
}) => {
  try {
    const searchParams = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    })

    if (ui.searchQuery) {
      searchParams.set("q", ui.searchQuery)
    }

    const searchResponse = await fetch(`/api/v1/feeds?${searchParams}`)
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
    const skip = feedEntriesService.feedEntries.length

    const searchResults = await fetchSearchResults({ limit, skip })
    if (!searchResults?.data) {
      return
    }

    if (searchResults.data.length) {
      feedEntriesService.add(searchResults.data)
    }

    if (feedEntriesService.feedEntries.length >= searchResults.count) {
      loaderState.complete()
    } else {
      loaderState.loaded()
    }
  } catch (error) {
    console.error(String(error))

    loaderState.error()
  }
}

// Handle search input changes
// Reset fields and load first results from api
watch.pre(
  () => ui.searchQuery,
  () => {
    if (!loaderState.isFirstLoad) {
      loaderState.reset()
      feedEntriesService.clear()
      void loadMore()
    }
  }
)

// Handle keyboard navigation of items
const handleKeyDown = (e: KeyboardEvent) => {
  if (isEditableTarget(e.target)) {
    return
  }
  if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "j" || e.key === "k") {
    e.preventDefault()
    const currentActiveElement = e.target as HTMLElement
    const currentActiveElementIndex = feedEntriesService.feedEntries.findIndex(
      (item: LoadFeedEntry) => item.id === currentActiveElement.dataset.id
    )
    const nextIndex =
      e.key === "ArrowDown" || e.key === "j"
        ? currentActiveElementIndex + 1
        : currentActiveElementIndex - 1
    const nextElement = document.querySelector(
      `[data-id="${feedEntriesService.feedEntries[nextIndex]?.id}"]`
    ) as HTMLDivElement

    if (nextElement) {
      nextElement.focus()
    }
  }
  if (e.key === "o") {
    e.preventDefault()
    const currentActiveElement = e.target as HTMLElement
    const currentActiveElementIndex = feedEntriesService.feedEntries.findIndex(
      (item: LoadFeedEntry) => item.id === currentActiveElement.dataset.id
    )
    const targetLink = feedEntriesService.feedEntries[currentActiveElementIndex]?.link
    if (!targetLink) {
      toast.error("No item selected")
      return
    }
    window.open(targetLink, "_target")
  }
}

// Reset state on unmount
onDestroy(() => {
  if (ui.textToSpeechAudioBlob) {
    ui.textToSpeechAudioBlob = ""
  }

  if (ui.searchQuery) {
    ui.searchQuery = ""
  }
})

const clearSearch = () => {
  ui.searchQuery = ""
}
</script>

<svelte:head>
  <title>Briefkasten | Feeds</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<svelte:window onkeydown={handleKeyDown} bind:innerHeight bind:innerWidth />

<Navbar showSearch={true} showQuickAdd={false} showSidebar={false} />
<main
  class="align-start flex max-h-[calc(100vh-80px)] w-full flex-col justify-start gap-2 overflow-y-scroll outline-none"
  bind:this={rootElement}
>
  {#if feedEntriesService.feedEntries.length}
    <FilterBar />
    <InfiniteLoader {loaderState} triggerLoad={loadMore} intersectionOptions={{ root: rootElement }}>
      {#each feedEntriesService.feedEntries as feedEntry (feedEntry.id)}
        <FeedRow
          {feedEntry}
          {handleSummarizeText}
          {handleGenerateSpeech}
          onUpdate={(updatedFeedEntry) => feedEntriesService.update(updatedFeedEntry)}
        />
      {/each}
      {#snippet noData()}
        {#if feedEntriesService.feedEntries.length >= 10}
          <div class="text-2xl">No more data</div>
        {/if}
      {/snippet}
    </InfiniteLoader>
  {:else if isSearching}
    <EmptyState showArrow={false}>
      {#snippet illustration()}
        <img src={Blob} alt="Empty State Blob" class="m-16 w-full max-w-md grayscale dark:invert" />
      {/snippet}
    </EmptyState>
    <div class="text-muted-foreground mx-auto flex w-full max-w-md flex-col items-center gap-3 text-center">
      <p>No feed entries found for "{ui.searchQuery}".</p>
      <button
        type="button"
        class="text-foreground rounded-md border px-3 py-2 text-sm hover:bg-muted"
        onclick={clearSearch}
      >
        Clear search
      </button>
    </div>
  {:else}
    <EmptyState showArrow={false}>
      {#snippet illustration()}
        <img src={Blob} alt="Empty State Blob" class="m-16 w-full max-w-md grayscale dark:invert" />
      {/snippet}
    </EmptyState>
    <p class="text-muted-foreground mx-auto w-1/2 text-center">
      Get started by adding a feed in the
      <a class="underline underline-offset-2" href="/settings"> settings </a>
    </p>
  {/if}
</main>

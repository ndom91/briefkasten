<script lang="ts">
import { onMount, type Snippet, setContext, untrack } from "svelte"
import { browser, dev } from "$app/environment"
import { page } from "$app/state"
import { CommandBar } from "$lib/components/command-bar"
import DragAdd from "$lib/components/DragAdd.svelte"
import { MetadataSidebar } from "$lib/components/metadata-sidebar"
import Sidebar from "$lib/components/NavigationSidebar.svelte"
import { BookmarksService } from "$lib/state/bookmarks.svelte"
import { FeedEntriesService } from "$lib/state/feedEntries.svelte"
import { FeedsService } from "$lib/state/feeds.svelte"
import { defaultAISettings, useInterface } from "$lib/state/ui.svelte"

const { children }: { children: Snippet } = $props()

const DISABLED_PATHS = ["/feeds", "/categories", "/tags", "/settings", "/"]
const metadataEnabled = $derived(() => !DISABLED_PATHS.includes(page.url.pathname))

const feedsService = new FeedsService(page.data.feeds.data)
const feedEntriesService = new FeedEntriesService(page.data.feedEntries.data)
const bookmarksService = new BookmarksService(page.data.bookmarks.data)

setContext(FeedsService, feedsService)
setContext(FeedEntriesService, feedEntriesService)
setContext(BookmarksService, bookmarksService)

$effect(() => {
  const bookmarks = page.data.bookmarks?.data ?? []
  const feedEntries = page.data.feedEntries?.data ?? []
  const feeds = page.data.feeds?.data ?? []

  untrack(() => {
    bookmarksService.mergePage(bookmarks)
    feedEntriesService.mergePage(feedEntries)
    feedsService.replace(feeds)
  })
})

const ui = useInterface()

// Set current user preferences to store
ui.aiFeaturesPreferences = page.data.session?.user?.settings?.ai ?? defaultAISettings
ui.userSettings = page.data.session?.user?.settings?.personal ?? {}

onMount(() => {
  if (browser && "serviceWorker" in navigator) {
    void navigator.serviceWorker.register("/service-worker.js", {
      type: dev ? "module" : "classic",
    })
  }
})
</script>

<div class="flex h-screen max-w-full">
  <CommandBar />
  <Sidebar />
  <div class="flex w-full min-w-0 flex-col">
    {@render children()}
  </div>
  {#if metadataEnabled()}
    <MetadataSidebar />
  {/if}
</div>

<DragAdd />

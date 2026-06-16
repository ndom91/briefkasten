<script lang="ts">
import { onMount } from "svelte"
import { toast } from "svelte-sonner"
import { goto } from "$app/navigation"
import { page } from "$app/stores"
import { HomeScroller } from "$lib/components/home-scroller"
import { Navbar } from "$lib/components/navbar"
import { BookmarksService } from "$lib/state/bookmarks.svelte"
import { FeedEntriesService } from "$lib/state/feedEntries.svelte"
import { ScrollerTypes } from "$lib/types"
import { getContext } from "$lib/utils/context"

onMount(async () => {
  // Share Target Redirect
  const sharedStatus = $page.url.searchParams.get("shared")
  if (sharedStatus === "true") {
    toast.success("Bookmark Added")
    await goto("/", { replaceState: true })
  } else if (sharedStatus === "auth-required") {
    toast.error("Sign in to save shared bookmarks")
    await goto("/", { replaceState: true })
  } else if (sharedStatus === "missing-url") {
    toast.error("Shared item did not include a URL")
    await goto("/", { replaceState: true })
  } else if (sharedStatus) {
    toast.error("Could not add shared bookmark")
    await goto("/", { replaceState: true })
  }
})

const bookmarkService = getContext(BookmarksService)
const feedEntriesService = getContext(FeedEntriesService)

// $effect(() => {
//   bookmarkService.bookmarks = $page.data.bookmarks.data
// })
</script>

<svelte:head>
  <title>Briefkasten</title>
  <meta name="description" content="RSS Feeds, Bookmarks, and more!" />
</svelte:head>

<Navbar showSearch={false} showQuickAdd={false} showSidebar={false} />
<main
  id="content"
  tabindex="-1"
  class="align-start flex flex-col justify-start gap-6 overflow-y-scroll py-4 focus:outline-none"
>
  <HomeScroller
    items={bookmarkService.bookmarks}
    count={bookmarkService.bookmarks.length}
    type={ScrollerTypes.BOOKMARKS}
  />
  <HomeScroller
    items={feedEntriesService.feedEntries}
    count={feedEntriesService.feedEntries.length}
    type={ScrollerTypes.FEEDS}
  />
</main>

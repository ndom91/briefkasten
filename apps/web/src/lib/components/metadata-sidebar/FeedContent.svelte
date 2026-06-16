<script lang="ts">
import { page } from "$app/state"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import { Badge } from "$lib/components/ui/badge"
import { Button } from "$lib/components/ui/button"
import { Checkbox } from "$lib/components/ui/checkbox"
import { FeedEntriesService } from "$lib/state/feedEntries.svelte"
import { useInterface } from "$lib/state/ui.svelte"
import type { Feed } from "$lib/types/zod.js"
import { getContext } from "$lib/utils/context"

const ui = useInterface()
const feedEntriesService = getContext(FeedEntriesService)

type FeedWithCount = Feed & { visible: boolean; _count: { feedEntries: number } }

const { data: feeds } = page.data.feeds as {
  data: FeedWithCount[]
}

const handleMarkAllRead = async (feed: FeedWithCount) => {
  const response = await fetch("/api/v1/feeds/mark-all-read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      feedId: feed.id,
    }),
  })
  if (response.ok) {
    for (const feedEntry of feedEntriesService.feedEntries.filter(
      (feedEntry) => feedEntry.feedId === feed.id
    )) {
      feedEntriesService.update({ ...feedEntry, unread: false })
    }
    feed._count.feedEntries = 0
  }
}
</script>

<div class="flex h-full items-center justify-start gap-4">
  <div class="flex h-full flex-col gap-4 p-6">
    <div class="flex items-center justify-between">
      <h2>Filters</h2>
    </div>
    <div class="grid grid-cols-[30px_1fr] justify-start gap-y-4">
      <div class="flex items-start justify-center pt-1">
        <Checkbox id="unread-only" bind:checked={ui.showUnreadOnly} />
      </div>
      <label for="unread-only" class="flex flex-col items-start gap-2">Unread Only</label>
    </div>
    <div class="grid grid-cols-[30px_1fr] justify-start gap-y-4">
      {#each feeds as feed}
        <div class="flex items-start justify-center pt-1">
          <Checkbox id={new URL(feed.url).host} bind:checked={feed.visible} />
        </div>
        <div class="flex flex-col items-start gap-2">
          <label for={new URL(feed.url).host} class="flex items-center justify-start gap-2">
            <span> {new URL(feed.url).host} </span>
            <img
              src={`${PUBLIC_WORKER_URL}/img/_/https://favicon.controld.com/${new URL(feed.url).hostname}`}
              alt="URL Favicon"
              class="size-6 rounded-full"
            />
          </label>
          <div class="line-clamp-2 dark:text-neutral-600">
            {feed.description}
          </div>
          <div class="flex items-center justify-start gap-2">
            <Badge variant="outline" title="Unread" class="h-8 px-2 py-0">
              <svg
                class="size-4 mr-2"
                data-slot="icon"
                fill="none"
                stroke-width="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
                ></path>
              </svg>
              {feed._count.feedEntries ?? 0}
            </Badge>
            <Button
              onclick={() => handleMarkAllRead(feed)}
              class="h-8 rounded-full px-2 py-0 text-xs"
            >
              <svg
                class="size-4 mr-2"
                data-slot="icon"
                fill="none"
                stroke-width="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                ></path>
              </svg>
              Mark All Read
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<script lang="ts">
import { format } from "@formkit/tempo"
import { tick } from "svelte"
import { toast } from "svelte-sonner"
import { enhance } from "$app/forms"
import { invalidateAll } from "$app/navigation"
import { page } from "$app/state"
import { Button, buttonVariants } from "$lib/components/ui/button"
import * as Card from "$lib/components/ui/card"
import * as Table from "$lib/components/ui/table"
import type { Feed } from "$lib/types/zod.js"
import { handleActionResults } from "$lib/utils/form-action"
import DeleteDialog from "./DeleteDialog.svelte"
import DataTableActions from "./feed-data-table-actions.svelte"

type FeedWithCount = Feed & {
  _count: {
    feedEntries: number
  }
}

type SortColumn = "name" | "url" | "count" | "lastFetched" | "createdAt" | null
type SortDirection = "asc" | "desc" | null

let isDeleteDialogOpen = $state(false)
let targetFeed = $state<Feed>()
let feeds = $state<FeedWithCount[]>(page.data.feeds?.data ?? [])
let sortColumn = $state<SortColumn>(null)
let sortDirection = $state<SortDirection>(null)

$effect(() => {
  if (page.data?.feeds?.data) {
    feeds = page.data.feeds.data
  }
})

const sortedFeeds = $derived(() => {
  if (!sortColumn || !sortDirection) {
    return feeds
  }

  return [...feeds].sort((a, b) => {
    let aVal: string | number | Date | null
    let bVal: string | number | Date | null

    if (sortColumn === "count") {
      aVal = a._count.feedEntries
      bVal = b._count.feedEntries
    } else if (sortColumn) {
      aVal = a[sortColumn]
      bVal = b[sortColumn]
    } else {
      return 0
    }

    if (aVal == null && bVal == null) return 0
    if (aVal == null) return sortDirection === "asc" ? 1 : -1
    if (bVal == null) return sortDirection === "asc" ? -1 : 1

    let comparison = 0
    if (sortColumn === "lastFetched" || sortColumn === "createdAt") {
      comparison = new Date(aVal).getTime() - new Date(bVal).getTime()
    } else if (sortColumn === "count") {
      comparison = Number(aVal) - Number(bVal)
    } else {
      comparison = String(aVal).localeCompare(String(bVal))
    }

    return sortDirection === "asc" ? comparison : -comparison
  })
})

const toggleSort = (column: SortColumn) => {
  if (sortColumn === column) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc"
  } else {
    sortColumn = column
    sortDirection = "asc"
  }
}

const handleToggleDeleteDialog = (feedId: string) => {
  targetFeed = feeds.find((feed: Feed) => feed.id === feedId)
  isDeleteDialogOpen = !isDeleteDialogOpen
}

const checkQueueResults = () => {
  void tick().then(() =>
    toast.promise(invalidateAll, {
      loading: "Loading..",
      success: "Feed queue refreshed",
      error: "Error adding feed, please try again",
    })
  )
}
</script>

<DeleteDialog form={page.form} bind:open={isDeleteDialogOpen} feed={targetFeed!} />
<div class="flex flex-col gap-2 justify-start items-start">
  <Card.Root class="w-full rounded-md shadow-none bg-transparent">
    <Card.Header class="bg-neutral-100 dark:bg-neutral-800 rounded-t-md">
      <Card.Title>Manage Feeds</Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <Table.Root>
        <Table.Header>
          <Table.Row class="hover:bg-transparent!">
            <Table.Head class="hidden lg:table-cell">
              <div class="text-left">ID</div>
            </Table.Head>
            <Table.Head>
              <Button class="text-left" variant="ghost" onclick={() => toggleSort("name")}>
                Name
                <svg
                  class="ml-2 fill-neutral-800 size-4 dark:fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  ><rect width="256" height="256" fill="none" /><polyline
                    points="80 176 128 224 176 176"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  /><polyline
                    points="80 80 128 32 176 80"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  /></svg
                >
              </Button>
            </Table.Head>
            <Table.Head>
              <div class="text-left">URL</div>
            </Table.Head>
            <Table.Head>
              <Button class="text-left" variant="ghost" onclick={() => toggleSort("count")}>
                Entries
                <svg
                  class="ml-2 fill-neutral-800 size-4 dark:fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  ><rect width="256" height="256" fill="none" /><polyline
                    points="80 176 128 224 176 176"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  /><polyline
                    points="80 80 128 32 176 80"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  /></svg
                >
              </Button>
            </Table.Head>
            <Table.Head>
              <div class="text-left">Last Fetched</div>
            </Table.Head>
            <Table.Head>
              <Button class="text-left" variant="ghost" onclick={() => toggleSort("createdAt")}>
                Created
                <svg
                  class="ml-2 fill-neutral-800 size-4 dark:fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  ><rect width="256" height="256" fill="none" /><polyline
                    points="80 176 128 224 176 176"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  /><polyline
                    points="80 80 128 32 176 80"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  /></svg
                >
              </Button>
            </Table.Head>
            <Table.Head>
              <div class="text-left"></div>
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each sortedFeeds() as feed (feed.id)}
            <Table.Row class="bg-transparent hover:dark:bg-neutral-900/20">
              <Table.Cell
                class="hidden lg:block lg:w-48 text-neutral-400 truncate lg:max-w-48 dark:text-neutral-600"
              >
                {feed.id}
              </Table.Cell>
              <Table.Cell class="max-w-48 truncate" title={feed.name}>
                {feed.name}
              </Table.Cell>
              <Table.Cell class="max-w-48 truncate" title={feed.url}>
                {feed.url}
              </Table.Cell>
              <Table.Cell class="text-center max-w-4">
                {feed._count.feedEntries}
              </Table.Cell>
              <Table.Cell class="max-w-48 truncate" title={feed.lastFetched ? String(feed.lastFetched) : ""}>
                {feed.lastFetched ? format(feed.lastFetched, { date: "medium", time: "medium" }) : "Never"}
              </Table.Cell>
              <Table.Cell>
                {format(feed.createdAt, "medium")}
              </Table.Cell>
              <Table.Cell class="w-32 max-w-32">
                <DataTableActions id={feed.id} toggleDeleteDialog={handleToggleDeleteDialog} />
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full shadow-none bg-transparent">
    <Card.Header class="bg-neutral-100 dark:bg-neutral-800 rounded-t-md">
      <Card.Title>Add Feed</Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <form
        action="/settings?/addFeed"
        method="post"
        use:enhance={handleActionResults(checkQueueResults)}
        class="flex gap-2"
      >
        <input
          type="text"
          name="feedUrl"
          placeholder="RSS Feed URL"
          class="flex py-2 px-3 w-96 h-10 text-sm bg-transparent rounded-md border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
        />
        <button class={buttonVariants({ variant: "default" })} type="submit"> Add </button>
      </form>
    </Card.Content>
  </Card.Root>
</div>

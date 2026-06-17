<script lang="ts">
import { format } from "@formkit/tempo"
import { invalidateAll } from "$app/navigation"
import { page } from "$app/state"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import { Image } from "$lib/components/image"
import MediaQuery from "$lib/components/MediaQuery.svelte"
import { Badge } from "$lib/components/ui/badge"
import { useInterface } from "$lib/state/ui.svelte"
import type { Category } from "$lib/types/zod.js"
import BookmarkActions from "./BookmarkActions.svelte"
import DeleteDialog from "./DeleteDialog.svelte"
import MobileBookmarkActions from "./MobileBookmarkActions.svelte"

type CategoryVisible = Category & { visible: boolean }

let deleteElement = $state<HTMLDialogElement>()

const ui = useInterface()

const {
  bookmark = $bindable(),
  onDelete,
  onArchived,
}: {
  bookmark: LoadBookmarkFlatTags
  onDelete?: (bookmarkId: string) => void
  onArchived?: (bookmarkId: string) => void
} = $props()

let isOptionsOpen = $state(false)
const archiveActionLabel = $derived(bookmark.archived ? "Restore" : "Archive")

const handleMetadataSidebarOpen = () => {
  ui.setMetadataSidebarData({
    bookmark,
    categories: page.data.categories,
    tags: page.data.tags,
  })
  ui.toggleMetadataSidebar(true)
  ui.toggleMetadataSidebarEditMode(false)
}

const handleArchive = async () => {
  const nextArchived = !bookmark.archived
  const response = await fetch(`/api/v1/bookmarks`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: bookmark.id,
      update: { archived: nextArchived },
    }),
  })
  if (response.ok) {
    onArchived?.(bookmark.id)
  }
  await invalidateAll()
}

const categories = $state(page.data.categories)
let isBookmarkCategoryHidden = $state(false)

const imageUrl = $derived.by(() => {
  if (bookmark.image) {
    return `${PUBLIC_WORKER_URL}/img/s_260x144,pos_top/${bookmark.id}`
  } else {
    return `${PUBLIC_WORKER_URL}/img/_/https://picsum.photos/seed/${btoa(bookmark.url).substring(bookmark.url.length - 32, bookmark.url.length)}/256/144.webp?bookmarkId=${bookmark.id}`
  }
})

$effect(() => {
  isBookmarkCategoryHidden = !!categories
    .filter((cat: CategoryVisible) => cat.visible === false)
    .find((cat: CategoryVisible) => cat.id === bookmark?.category?.id)
})
</script>

<div
  tabindex={0}
  data-id={bookmark.id}
  role="row"
  class="bookmark-row relative mx-2 flex min-w-0 max-w-full gap-4 rounded-lg rounded-l-none border-l-4 border-transparent p-4 outline-none transition-all duration-500 ease-(--ease-spring-3) focus:border-zinc-500 focus:bg-neutral-100 dark:focus:bg-neutral-800/40 md:mx-4 starting:-translate-y-2 starting:opacity-0;"
  class:hidden={isBookmarkCategoryHidden}
  onpointerleave={() => (isOptionsOpen = false)}
  onpointerenter={() => (isOptionsOpen = true)}
>
  <DeleteDialog bind:dialogElement={deleteElement} bookmarkId={bookmark.id} onDeleted={onDelete} />
  <Image
    thumbhash={bookmark.imageBlur ?? ""}
    src={imageUrl}
    alt={`${new URL(bookmark.url).hostname} Screenshot`}
    class={ui.userSettings?.compact ? "hidden" : ""}
  />
  <div class="relative flex w-full flex-col gap-2 truncate">
    <span class="truncate pr-10 text-xl font-semibold md:pr-0" title={bookmark.title}>
      {bookmark.title}
    </span>
    <p class="line-clamp-2 hidden pr-10 sm:[display:-webkit-box] md:pr-0">{bookmark.desc}</p>
    <div class="text-muted flex items-center justify-start gap-2 pr-10 text-sm md:pr-0">
      <img
        src={`${PUBLIC_WORKER_URL}/img/_/https://favicon.controld.com/${new URL(bookmark.url).hostname}`}
        alt="URL Favicon"
        class="size-4 rounded-full"
      />
      <a target="_blank" href={bookmark.url} class="truncate text-neutral-500">
        {bookmark.url}
      </a>
    </div>
    <span class="flex flex-wrap gap-2 pr-10 md:pr-0">
      <Badge variant="default">
        {format(bookmark.createdAt instanceof Date ? bookmark.createdAt : new Date(), {
          date: "medium",
          time: "short",
        })}
      </Badge>
      {#if bookmark.category?.name}
        <Badge variant="secondary">
          {bookmark.category.name}
        </Badge>
      {/if}
      {#if bookmark.tags?.length}
        <span class="flex flex-wrap gap-2">
          {#each bookmark.tags as tag (tag.name)}
            <Badge variant="outline">
              {tag.name}
            </Badge>
          {/each}
        </span>
      {/if}
    </span>
    <MediaQuery query="(max-width: 767px)">
      {#snippet children(matches)}
        {#if matches}
          <MobileBookmarkActions
            url={bookmark.url ?? ""}
            {handleMetadataSidebarOpen}
            handleDeleteDialogOpen={() => deleteElement?.showModal()}
            {handleArchive}
            {archiveActionLabel}
          />
        {:else}
          <BookmarkActions
            url={bookmark.url ?? ""}
            {handleMetadataSidebarOpen}
            handleDeleteDialogOpen={() => deleteElement?.showModal()}
            {isOptionsOpen}
            {handleArchive}
            {archiveActionLabel}
          />
        {/if}
      {/snippet}
    </MediaQuery>
  </div>
</div>

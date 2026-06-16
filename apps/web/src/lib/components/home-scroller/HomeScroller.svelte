<script lang="ts">
import Bell from "$lib/assets/bell.png"
import Browser from "$lib/assets/browser.png"
import { ScrollerTypes } from "$lib/types"
import { capitalize } from "$lib/utils/text"
import BookmarkPreviewCard from "./BookmarkPreviewCard.svelte"
import FeedItemPreviewCard from "./FeedItemPreviewCard.svelte"

type Props = {
  type: keyof typeof ScrollerTypes
  items: LoadBookmarkFlatTags[] | LoadFeedEntry[]
  count: number
}

const { type, items, count }: Props = $props()

let element = $state<HTMLElement | undefined>()
let previousFirstItemId = $state<string | undefined>()
let hasInitialFirstItemId = $state(false)

$effect(() => {
  const firstItemId = items[0]?.id
  if (!hasInitialFirstItemId) {
    previousFirstItemId = firstItemId
    hasInitialFirstItemId = true
    return
  }

  if (!firstItemId || firstItemId === previousFirstItemId) {
    return
  }

  previousFirstItemId = firstItemId
  element?.scrollTo({ left: 0, behavior: "smooth" })
})
</script>

<section
  class="relative mx-4 flex max-w-full flex-col overflow-hidden rounded-xl border border-neutral-200/70 bg-neutral-100/80 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/80"
>
  <div class="z-10 mx-4 mt-3 flex grow items-center justify-between gap-4">
    <h2 class="text-xl font-medium tracking-tight text-neutral-900 text-balance dark:text-neutral-100">
      {type === ScrollerTypes.FEEDS ? `Unread Feed Items (${count})` : capitalize(type)}
    </h2>
    {#if items.length}
      <a
        class="flex shrink-0 items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200/70 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:focus-visible:ring-neutral-700"
        data-sveltekit-preload-data="hover"
        href={`/${type.toLowerCase()}`}
      >
        <svg
          class="size-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
        >
          <rect width="256" height="256" fill="none" />
          <line
            x1="40"
            y1="64"
            x2="216"
            y2="64"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
          <line
            x1="40"
            y1="128"
            x2="112"
            y2="128"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
          <line
            x1="40"
            y1="192"
            x2="128"
            y2="192"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
          <circle
            cx="184"
            cy="144"
            r="32"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
          <line
            x1="206.63"
            y1="166.63"
            x2="232"
            y2="192"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
        </svg>
        <span class="truncate">See more</span>
      </a>
    {/if}
  </div>
  <div
    bind:this={element}
    class="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-scroll overscroll-x-contain scroll-smooth px-4 py-4 after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:h-full after:w-24 after:rounded-r-xl after:shadow-[inset_-100px_0px_65px_-65px_#ddd] dark:after:shadow-[inset_-100px_0px_45px_-65px_#141414]"
  >
    {#each items as item (item.id)}
      {#if type === ScrollerTypes.BOOKMARKS}
        <BookmarkPreviewCard {item} />
      {:else if type === ScrollerTypes.FEEDS}
        <FeedItemPreviewCard {item} />
      {/if}
    {:else}
      <div class="grid h-48 w-full place-items-center">
        {#if type === ScrollerTypes.BOOKMARKS}
          <div class="z-10">
            Go to the <a href="/bookmarks" class="underline underline-offset-4">bookmarks</a> page to
            find multiple ways to add new bookmarks
          </div>
          <img
            src={Browser}
            alt="Empty State Browser"
            class="pointer-events-none absolute -bottom-20 -right-4 w-72 max-w-md rotate-18 opacity-20 grayscale dark:invert"
          />
        {:else if type === ScrollerTypes.FEEDS}
          <div class="z-10">
            Go to <a href="/settings?tab=feeds" class="underline underline-offset-4">settings</a> to
            add a new RSS feed to follow
          </div>
          <img
            src={Bell}
            alt="Empty State Browser"
            class="pointer-events-none absolute -bottom-16 -right-4 w-64 max-w-md rotate-10 opacity-20 grayscale dark:invert"
          />
        {/if}
      </div>
    {/each}
  </div>
</section>

<script lang="ts">
import { format } from "@formkit/tempo"
import dompurify from "isomorphic-dompurify"
import { watch } from "runed"
import { page } from "$app/state"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import MediaQuery from "$lib/components/MediaQuery.svelte"
import { Badge } from "$lib/components/ui/badge"
import { useInterface } from "$lib/state/ui.svelte"
import type { Feed, FeedEntry, FeedEntryMedia } from "$lib/types/zod.js"
import { cn } from "$lib/utils"
import { isEditableTarget } from "$lib/utils/keyboard"
import FeedActions from "./FeedActions.svelte"
import MobileFeedActions from "./MobileFeedActions.svelte"

const ui = useInterface()

let {
  feedEntry,
  handleGenerateSpeech,
  handleSummarizeText,
  onUpdate,
}: {
  feedEntry: FeedEntry & {
    feedMedia: FeedEntryMedia[]
    feed: Feed
  }
  handleGenerateSpeech: (text: string) => Promise<void>
  handleSummarizeText: (text: string) => void
  onUpdate?: (feedEntry: FeedEntry & { feedMedia: FeedEntryMedia[]; feed: Feed }) => void
} = $props()

let showFeedActions = $state(false)
let card = $state<HTMLElement>()
let cardOpen = $state(false)
let feedBodyElement = $state<HTMLElement>()

const imageUrl = $derived.by(() => {
  if (feedEntry.feedMedia?.[0]?.href) {
    return `${PUBLIC_WORKER_URL}/img/s_160x96/${feedEntry.feedMedia?.[0]?.href}`
  } else {
    return `${PUBLIC_WORKER_URL}/img/_/https://picsum.photos/seed/${btoa(feedEntry.link).substring(feedEntry.link.length - 32, feedEntry.link.length)}/160/96.webp`
  }
})

const handleMarkAsUnread = async (target: boolean | null = null) => {
  const nextFeedEntry = {
    ...feedEntry,
    unread: target ?? !feedEntry.unread,
  }
  feedEntry = nextFeedEntry

  const response = await fetch("/api/v1/feeds", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedEntry: nextFeedEntry }),
  })
  if (response.ok) {
    const { data } = await response.json()
    feedEntry = data
    onUpdate?.(data)
  }
}

const handleToggleCardOpen = async () => {
  cardOpen = !cardOpen

  if (feedEntry.unread === true) {
    await handleMarkAsUnread(false)
  }
}

const handleKeyDown = async (e: KeyboardEvent) => {
  if (e.repeat || isEditableTarget(e.target)) {
    return
  }
  if (e.key === "\\" && e.target === card) {
    e.preventDefault()
    await handleToggleCardOpen()
  }
  if (e.key === "u" && e.target === card) {
    e.preventDefault()
    await handleMarkAsUnread()
  }
}

const handleSetTextToSpeechContent = async () => {
  ui.textToSpeechAudioBlob = ""
  // Hack to quickly get text content from HTML String
  const tmp = document.createElement("div")
  tmp.innerHTML = feedEntry.content ?? ""
  await handleGenerateSpeech(tmp.textContent)
}

const handleStartTextSummarization = () => {
  handleSummarizeText(feedEntry.content ?? "")
}

const mutate = () => {
  return new Promise<void>((resolve) => {
    if (!feedBodyElement) {
      resolve()
      return
    }

    if (cardOpen) {
      feedBodyElement.style.opacity = "1.0"
      feedBodyElement.style.height = "fit-content"
      feedBodyElement.style.transform = "scaleY(100%)"
    } else {
      feedBodyElement.style.opacity = "0"
      feedBodyElement.style.height = "0px"
      feedBodyElement.style.transform = "scaleY(0)"
    }
    resolve()
  })
}

watch.pre(
  () => cardOpen,
  () => {
    mutate()
  }
)

const isFeedVisible = $derived(
  page.data.feeds.data?.find((feed: Feed) => feed.id === feedEntry?.feedId)?.visible
)

const hideUnread = $derived.by(() => {
  if (ui.showUnreadOnly) {
    return !feedEntry.unread
  }
  return false
})

const feedCategories = $derived.by(() => {
  if (Array.isArray(feedEntry.categories)) {
    return feedEntry.categories
  }

  return String(feedEntry.categories).replaceAll(" ", "").split(",")
})
</script>

<svelte:window onkeydown={handleKeyDown} />

<div
  data-id={feedEntry.id}
  role="row"
  bind:this={card}
  tabindex="0"
  class={cn(
    "relative mx-2 grid grid-cols-1 gap-4 rounded-lg rounded-l-none border-l-4 border-transparent p-4 outline-none transition-all duration-300 focus:border-neutral-500 focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-800/40 md:mx-4 md:grid-cols-[10rem_1fr]",
    !isFeedVisible && "hidden",
    hideUnread && "hidden",
  )}
  onpointerleave={() => (showFeedActions = false)}
  onpointerenter={() => (showFeedActions = true)}
>
  <div
    class={cn(
      "absolute transition-(--ease-in-out-3) top-2 left-2 bg-emerald-400 rounded-full size-4",
      feedEntry.unread ? "opacity-100" : "opacity-0",
    )}
  ></div>
  <img
    src={imageUrl}
    alt="Feed Item Hero"
    class="hidden h-24 w-48 rounded-md border border-neutral-100 object-cover object-center dark:border-neutral-800 md:block"
  />
  <div class="flex w-full flex-col justify-between pr-6 md:pr-0">
    <span
      class="line-clamp-2 min-h-[28px] w-auto pr-4 text-xl font-semibold md:line-clamp-1 md:pr-0"
      title={feedEntry.title}
    >
      {feedEntry.title}
    </span>
    <div
      bind:this={feedBodyElement}
      class={cn(
        "prose prose-img:!w-full dark:prose-blockquote:text-neutral-200 prose-img:!h-auto prose-img:max-w-screen-md prose-img:object-contain prose-video:aspect-video prose-video:max-w-screen-sm dark:prose-headings:text-neutral-100 dark:prose-a:text-neutral-200 dark:prose-strong:text-neutral-100 h-0 max-w-(--breakpoint-lg) origin-top opacity-0 transition-all dark:text-neutral-100",
        cardOpen ? "h-fit" : "h-0",
      )}
    >
      <!-- eslint-disable-next-line -->
      {@html dompurify.sanitize(feedEntry.content ?? "", {
        USE_PROFILES: { html: true },
        ALLOW_DATA_ATTR: false,
        KEEP_CONTENT: false,
        ALLOW_ARIA_ATTR: false,
        FORBID_ATTR: ["style"],
        FORBID_TAGS: ["style"],
      })}
    </div>
    <div class="text-muted mt-2 flex items-center justify-start gap-2 text-sm">
      {#if feedEntry.link}
        <img
          src={`${PUBLIC_WORKER_URL}/img/_/https://favicon.controld.com/${new URL(feedEntry.link).hostname}`}
          alt="URL Favicon"
          class="size-4 rounded-full"
        />
        <a
          target="_blank"
          href={feedEntry.link}
          onclick={() => handleMarkAsUnread()}
          class="line-clamp-1 text-clip text-neutral-500"
        >
          {feedEntry.link}
        </a>
      {/if}
    </div>
    <span class="mt-3 flex flex-wrap gap-2">
      <Badge variant="secondary">
        {format(feedEntry.createdAt instanceof Date ? feedEntry.createdAt : new Date(), {
          date: "medium",
          time: "short",
        })}
      </Badge>
      {#if feedCategories}
        {#each feedCategories as category (category)}
          <Badge variant="outline">
            {category}
          </Badge>
        {/each}
      {/if}
    </span>
  </div>
  <MediaQuery query="(max-width: 767px)">
    {#snippet children(matches)}
      {#if matches}
        <MobileFeedActions
          url={feedEntry.link ?? ""}
          {handleToggleCardOpen}
          {handleMarkAsUnread}
          {handleSetTextToSpeechContent}
          {handleStartTextSummarization}
        />
      {:else}
        <FeedActions
          url={feedEntry.link ?? ""}
          isOptionsOpen={showFeedActions}
          {handleToggleCardOpen}
          {handleMarkAsUnread}
          {handleSetTextToSpeechContent}
          {handleStartTextSummarization}
        />
      {/if}
    {/snippet}
  </MediaQuery>
</div>

<script lang="ts">
import { format } from "@formkit/tempo"
import { invalidateAll } from "$app/navigation"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import { Button } from "$lib/components/ui/button"
import * as Tooltip from "$lib/components/ui/tooltip"

const { item }: { item: LoadFeedEntry } = $props()

const handleMarkAsRead = async () => {
  const feedEntry = {
    ...item,
    unread: false,
  }
  await fetch("/api/v1/feeds", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedEntry }),
  })
  await invalidateAll()
}

const imageUrl = $derived.by(() => {
  if (item.feedMedia?.[0]?.href) {
    return `${PUBLIC_WORKER_URL}/img/s_256x144/${item.feedMedia[0].href}`
  } else {
    return `${PUBLIC_WORKER_URL}/img/_/https://picsum.photos/seed/${btoa(item.link).substring(item.link.length - 32, item.link.length)}/256/144.webp`
  }
})
</script>

<div
  data-dashboard-card="feed"
  class="group relative flex w-72 shrink-0 snap-start flex-col gap-3 rounded-lg border border-neutral-200/80 bg-white/80 p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/80 dark:hover:border-neutral-700"
>
  <Tooltip.Root>
    <Tooltip.Trigger class="outline-none">
      {#snippet child({ props })}
      <Button
        {...props}
        aria-label="Mark feed item as read"
        class="absolute right-4 top-4 rounded-full border border-neutral-200/80 bg-white/90 p-2 opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-950/90 dark:focus-visible:ring-neutral-700"
        variant="ghost"
        size="icon"
        onclick={handleMarkAsRead}
      >
        <svg
          class="size-5 text-neutral-900 group-hover:animate-(--animation-shake-z) dark:text-neutral-100"
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
            d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z"
          ></path>
        </svg>
      </Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>Mark as Read</p>
    </Tooltip.Content>
  </Tooltip.Root>
  <img
    src={imageUrl}
    alt={item.title}
    width="256"
    height="144"
    decoding="async"
    class="aspect-video w-64 rounded-sm bg-neutral-200 object-cover object-center dark:bg-neutral-800"
  />
  <div class="flex w-64 min-w-0 flex-col gap-1 overflow-hidden">
    <div class="flex items-center justify-between gap-3">
      <img
        src={`${PUBLIC_WORKER_URL}/img/_/https://favicon.controld.com/${new URL(item.link).hostname}`}
        alt=""
        width="20"
        height="20"
        loading="lazy"
        decoding="async"
        class="size-5 rounded-full"
      />
      <span class="shrink-0 text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
        {format(item.published instanceof Date ? item.published : new Date(), {
          date: "medium",
          time: "short",
        })}
      </span>
    </div>
    <a
      href={item.link}
      target="_blank"
      rel="noreferrer"
      class="line-clamp-2 rounded-sm font-medium leading-snug text-neutral-950 transition-colors hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:text-neutral-100 dark:hover:text-neutral-300 dark:focus-visible:ring-neutral-700"
      title={item.title}
    >
      {item.title}
    </a>
  </div>
</div>

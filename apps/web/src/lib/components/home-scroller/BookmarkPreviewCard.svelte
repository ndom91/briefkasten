<script lang="ts">
import { format } from "@formkit/tempo"
import { PUBLIC_WORKER_URL } from "$env/static/public"

const { item }: { item: LoadBookmarkFlatTags } = $props()

const imageUrl = $derived.by(() => {
  if (item.image) {
    return `${PUBLIC_WORKER_URL}/img/s_256x144/${item.id}`
  }

  return `${PUBLIC_WORKER_URL}/img/_/https://picsum.photos/seed/${btoa(item.url).substring(item.url.length - 32, item.url.length)}/256/144.webp?bookmarkId=${item.id}`
})

const createdDate = $derived(
  format(item.createdAt instanceof Date ? item.createdAt : new Date(), {
    date: "medium",
    time: "short",
  })
)
</script>

<div
  data-dashboard-card="bookmark"
  class="flex h-fit w-72 shrink-0 snap-start flex-col gap-3 rounded-lg border border-neutral-200/80 bg-white/80 p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/80 dark:hover:border-neutral-700"
>
  <a
    href={item.url}
    target="_blank"
    rel="noreferrer"
    class="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-700 dark:focus-visible:ring-offset-neutral-900"
  >
    <img
      src={imageUrl}
      alt={item.title}
      width="256"
      height="144"
      decoding="async"
      class="aspect-video w-64 rounded-sm bg-neutral-200 object-cover object-top dark:bg-neutral-800"
    />
  </a>
  <div class="flex w-64 min-w-0 flex-col gap-1">
    <div class="flex items-center justify-between gap-3">
      <img
        src={`${PUBLIC_WORKER_URL}/img/_/https://favicon.controld.com/${new URL(item.url).hostname}`}
        alt=""
        width="20"
        height="20"
        loading="lazy"
        decoding="async"
        class="size-5 rounded-full"
      />
      <span class="shrink-0 text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
        {createdDate}
      </span>
    </div>
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      class="rounded-sm font-medium leading-snug text-neutral-950 transition-colors hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:text-neutral-100 dark:hover:text-neutral-300 dark:focus-visible:ring-neutral-700"
    >
      <span class="line-clamp-2" title={item.title}>{item.title} - {item.desc}</span>
    </a>
  </div>
</div>

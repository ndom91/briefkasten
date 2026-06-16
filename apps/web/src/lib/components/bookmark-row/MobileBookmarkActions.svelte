<script lang="ts">
import { fade } from "svelte/transition"
import { Separator } from "$lib/components/ui/separator"

// TODO: Refactor a bit when popover anchor API is more widely available
let open = $state(false)

type Props = {
  url: string
  handleMetadataSidebarOpen: () => void
  handleDeleteDialogOpen: () => void
  handleArchive: () => void
  archiveActionLabel?: string
}

const {
  url,
  handleMetadataSidebarOpen,
  handleDeleteDialogOpen,
  handleArchive,
  archiveActionLabel = "Archive",
}: Props = $props()

const id = crypto.randomUUID()

const togglePopover = (e: MouseEvent) => {
  e.stopPropagation()
  open = !open
}

let actionMenuWrapperElement = $state<HTMLElement>()

const handleClickOutside = (e: MouseEvent) => {
  if (actionMenuWrapperElement && !actionMenuWrapperElement.contains(e.target as Node)) {
    open = false
  }
}
</script>

<svelte:window on:click={handleClickOutside} />

<div
  class="flex absolute -top-3 -right-1 flex-col justify-start mt-2"
  bind:this={actionMenuWrapperElement}
>
  <a aria-label="Open URL" href={url} target="_blank" class="flex justify-center p-3">
    <svg
      class="size-5 text-neutral-900 dark:text-neutral-100"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <rect width="256" height="256" fill="none" /><polyline
        points="216 104 215.99 40.01 152 40"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><line
        x1="136"
        y1="120"
        x2="216"
        y2="40"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><path
        d="M184,136v72a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h72"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /></svg
    >
  </a>
  <button
    aria-label="Toggle Popover"
    class="flex justify-center p-3"
    popovertarget={`bookmark-menu-${id}`}
    style={`anchor-name: --a-${id}`}
    onclick={togglePopover}
  >
    <svg
      class="size-6"
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
        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
      ></path>
    </svg>
  </button>
  {#if open}
    <div
      id={`feed-menu-${id}`}
      class="right-2 z-100 p-3 space-y-3 w-max rounded-md border transition top-[5.5rem] border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900"
      in:fade={{ duration: 200 }}
      out:fade={{ duration: 150 }}
      style={`
      position: absolute;
      //margin-block-start: 0;
      //margin-inline-end: 0;
      //right: anchor(--a-${id} right);
      //top: anchor(--a-${id} bottom);
    `}
    >
      <button class="grid items-center grid-cols-[28px_1fr]" onclick={handleMetadataSidebarOpen}>
        <svg
          class="size-5 text-neutral-900 dark:text-neutral-100"
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
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
          ></path>
        </svg>
        <span class="font-light">Edit</span>
      </button>
      <button class="grid items-center grid-cols-[28px_1fr]" onclick={handleArchive}>
        <svg
          class="size-5 text-neutral-900 dark:text-neutral-100"
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
            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          ></path>
        </svg>
        <span class="font-light">{archiveActionLabel}</span>
      </button>
      <Separator />
      <button class="grid items-center grid-cols-[28px_1fr]" onclick={handleDeleteDialogOpen}>
        <svg
          class="text-red-700 size-5"
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
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          ></path>
        </svg>
        <span class="font-light">Delete</span>
      </button>
    </div>
  {/if}
</div>

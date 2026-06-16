<script lang="ts">
import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
import { Button } from "$lib/components/ui/button"
import * as Tooltip from "$lib/components/ui/tooltip"
import { cn } from "$lib/utils"

type Props = {
  isOptionsOpen: boolean
  url: string
  handleMetadataSidebarOpen: () => void
  handleDeleteDialogOpen: () => void
  handleArchive: () => void
  archiveActionLabel?: string
}

const {
  isOptionsOpen,
  url,
  handleMetadataSidebarOpen,
  handleDeleteDialogOpen,
  handleArchive,
  archiveActionLabel = "Archive",
}: Props = $props()
</script>

<div
  class={cn(
    "absolute right-4 top-10 flex rounded-xl bg-neutral-200/30 p-2 text-white delay-100 duration-300 ease-in-out dark:bg-neutral-900/50 backdrop-blur-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] border dark:border-gray-600/20 border-gray-400/30",
    isOptionsOpen ? "opacity-100" : "opacity-0",
  )}
>
  <Tooltip.Root>
    <Tooltip.Trigger class="outline-none">
      {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" href={url} target="_blank">
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
      </Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>
        Open Link
        <KeyboardIndicator key="o" class="ml-2" />
      </p>
    </Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger class="outline-none">
      {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        onclick={handleMetadataSidebarOpen}
      >
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
      </Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>Edit</p>
    </Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger class="outline-none">
      {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" onclick={handleArchive}>
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
      </Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>{archiveActionLabel}</p>
    </Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger class="outline-none">
      {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        onclick={handleDeleteDialogOpen}
      >
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
      </Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>Delete</p>
    </Tooltip.Content>
  </Tooltip.Root>
</div>

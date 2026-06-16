<script lang="ts">
import { fade } from "svelte/transition"
import { page } from "$app/state"
import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
import { useInterface } from "$lib/state/ui.svelte"

const ui = useInterface()

// TODO: Refactor a bit when popover anchor API is more widely available
let open = $state(false)

const enableSummary = page.data.session?.user?.settings?.ai?.summarization.enabled ?? false
const enableTTS = ui.aiFeaturesPreferences.tts.enabled

const {
  url,
  handleToggleCardOpen,
  handleMarkAsUnread,
  handleSetTextToSpeechContent,
  handleStartTextSummarization,
}: {
  url: string
  handleToggleCardOpen: () => void
  handleMarkAsUnread: (target?: boolean) => void
  handleSetTextToSpeechContent: () => void
  handleStartTextSummarization: () => void
} = $props()

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
  class="absolute right-0 top-0 mt-2 flex h-full flex-col justify-start"
  bind:this={actionMenuWrapperElement}
>
  <button aria-label="Toggle Card" class="flex justify-center p-3" onclick={handleToggleCardOpen}>
    <svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="none" /><path
        d="M128,88a32,32,0,0,1,32-32h64a8,8,0,0,1,8,8V192a8,8,0,0,1-8,8H160a32,32,0,0,0-32,32"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><path
        d="M24,192a8,8,0,0,0,8,8H96a32,32,0,0,1,32,32V88A32,32,0,0,0,96,56H32a8,8,0,0,0-8,8Z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><line
        x1="160"
        y1="96"
        x2="200"
        y2="96"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><line
        x1="160"
        y1="128"
        x2="200"
        y2="128"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><line
        x1="160"
        y1="160"
        x2="200"
        y2="160"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /></svg
    >
  </button>
  <button
    aria-label="Toggle Popover"
    class="flex justify-center p-3"
    popovertarget={`feed-menu-${id}`}
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
    <!-- popover="auto" -->
    <div
      id={`feed-menu-${id}`}
      class="right-2 top-[5.5rem] z-30 w-max space-y-3 rounded-md border border-neutral-200 bg-neutral-200 p-3 transition dark:border-neutral-800 dark:bg-neutral-900"
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
      <a href={url} target="_blank" class="grid grid-cols-[28px_1fr] items-center">
        <svg class="size-[1.15rem]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
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
        <span class="font-light">Open</span>
      </a>
      <button class="grid grid-cols-[28px_1fr] items-center" onclick={() => handleMarkAsUnread()}>
        <svg
          class="size-[1.15rem]"
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
        <span class="font-light">Toggle Unread</span>
      </button>
      {#if enableSummary}
        <button
          class="grid grid-cols-[28px_1fr] items-center"
          onclick={handleStartTextSummarization}
        >
          {#if ui.summarizationLoading}
            <LoadingIndicator class="dark:text-white" />
          {:else}
            <svg class="size-[1.15rem]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <rect width="256" height="256" fill="none" /><line
                x1="112"
                y1="112"
                x2="176"
                y2="112"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /><line
                x1="112"
                y1="144"
                x2="176"
                y2="144"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /><rect
                x="40"
                y="40"
                width="176"
                height="176"
                rx="8"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /><line
                x1="80"
                y1="40"
                x2="80"
                y2="216"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /></svg
            >
          {/if}
          <span>Summarize</span>
        </button>
      {/if}
      {#if enableTTS}
        <button
          class="grid grid-cols-[28px_1fr] items-center"
          onclick={handleSetTextToSpeechContent}
        >
          {#if ui.textToSpeechLoading}
            <LoadingIndicator class="dark:text-white" />
          {:else}
            <svg class="size-[1.2rem]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <rect width="256" height="256" fill="none" /><path
                d="M80,168H32a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H80l72-56V224Z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /><line
                x1="192"
                y1="104"
                x2="192"
                y2="152"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /><line
                x1="224"
                y1="88"
                x2="224"
                y2="168"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /></svg
            >
          {/if}
          <span>Listen</span>
        </button>
      {/if}
    </div>
  {/if}
</div>

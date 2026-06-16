<script lang="ts">
import { page } from "$app/state"
import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
import { Button } from "$lib/components/ui/button"
import * as Tooltip from "$lib/components/ui/tooltip"
import { useInterface } from "$lib/state/ui.svelte"
import { cn } from "$lib/utils"

const ui = useInterface()

const enableSummary = page.data.session?.user?.settings?.ai?.summarization.enabled ?? false
const enableTTS = ui.aiFeaturesPreferences.tts.enabled

const {
  isOptionsOpen,
  url,
  handleToggleCardOpen,
  handleMarkAsUnread,
  handleSetTextToSpeechContent,
  handleStartTextSummarization,
}: {
  isOptionsOpen: boolean
  url: string
  handleToggleCardOpen: () => void
  handleMarkAsUnread: (targetState?: boolean) => void
  handleSetTextToSpeechContent: () => void
  handleStartTextSummarization: () => void
} = $props()
</script>

<div
  class={cn(
    "absolute right-4 top-10 flex rounded-xl border border-gray-400/30 bg-neutral-200/30 p-2 text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-[6px] delay-100 duration-300 ease-in-out dark:border-gray-600/20 dark:bg-neutral-900/50",
    isOptionsOpen ? "opacity-100" : "opacity-0",
  )}
>
  <Tooltip.Root>
    <Tooltip.Trigger class="outline-none">
      {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        onclick={handleToggleCardOpen}
      >
        <svg
          class="size-5 text-neutral-900 dark:text-neutral-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
        >
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
      </Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>
        Read Inline
        <KeyboardIndicator key="&bsol;" class="ml-2" />
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
        onclick={() => handleMarkAsUnread()}
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
            d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z"
          ></path>
        </svg>
      </Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      <p>
        Toggle Unread
        <KeyboardIndicator key="u" class="ml-2" />
      </p>
    </Tooltip.Content>
  </Tooltip.Root>
  {#if enableSummary}
    <Tooltip.Root>
      <Tooltip.Trigger class="outline-none">
        {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          size="icon"
          disabled={ui.summarizationLoading}
          onclick={handleStartTextSummarization}
        >
          {#if ui.summarizationLoading}
            <LoadingIndicator class="dark:text-white" />
          {:else}
            <svg
              class="size-5 text-neutral-900 dark:text-neutral-100"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
            >
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
        </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <p>Summarize Article</p>
      </Tooltip.Content>
    </Tooltip.Root>
  {/if}
  {#if enableTTS}
    <Tooltip.Root>
      <Tooltip.Trigger class="outline-none">
        {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          size="icon"
          disabled={ui.textToSpeechLoading}
          onclick={handleSetTextToSpeechContent}
        >
          {#if ui.textToSpeechLoading}
            <LoadingIndicator class="dark:text-white" />
          {:else}
            <svg
              class="size-5 text-neutral-900 dark:text-neutral-100"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
            >
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
        </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <p>Listen to Article</p>
      </Tooltip.Content>
    </Tooltip.Root>
  {/if}
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
        Open
        <KeyboardIndicator key="o" class="ml-2" />
      </p>
    </Tooltip.Content>
  </Tooltip.Root>
</div>

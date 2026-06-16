<script lang="ts">
import { ModeWatcher } from "mode-watcher"
import { useDebounce } from "runed"
import { invalidate } from "$app/navigation"
import { AudioPlayer } from "$lib/components/audio-player"
import KeyboardIndicator from "$lib/components/KeyboardIndicator.svelte"
import { Breadcrumbs, QuickAddForm } from "$lib/components/navbar"
import { Button } from "$lib/components/ui/button"
import * as Popover from "$lib/components/ui/popover"
import * as Tooltip from "$lib/components/ui/tooltip"
import { useInterface } from "$lib/state/ui.svelte"
import { cn } from "$lib/utils"
import { isEditableTarget } from "$lib/utils/keyboard"

const { showSearch = true, showQuickAdd = true, showSidebar = true } = $props()
const ui = useInterface()
let searchInputEl = $state<HTMLInputElement>()

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.repeat || isEditableTarget(event.target)) {
    return
  }

  if (event.altKey && event.key === "n") {
    event.preventDefault()
    ui.toggleQuickAdd()
  }
  if (event.key === "/") {
    event.preventDefault()
    searchInputEl?.focus()
  }
}

const handleSearchInput = async (event: KeyboardEvent) => {
  const query = (event.target as HTMLInputElement).value
  // Reset when deleting query
  if (ui.searchQuery !== "" && query === "") {
    await invalidate("app:feeds")
    await invalidate("app:bookmarks")
  }
  ui.searchQuery = query
}
</script>

<svelte:window onkeydown={handleKeyDown} />
<nav
  class="border-input mx-auto flex h-16 w-full items-center justify-between border-b bg-neutral-50/90 px-4 py-3 backdrop-blur-sm dark:border-b-zinc-800 dark:bg-neutral-950/80"
>
  <ModeWatcher />
  <Breadcrumbs />
  <div class="flex items-center justify-end gap-2 md:gap-4">
    {#if ui.textToSpeechAudioBlob && ui.aiFeaturesPreferences.tts.enabled}
      <AudioPlayer src={ui.textToSpeechAudioBlob} />
    {/if}
    {#if showSearch}
      <div
        class="relative rounded-lg transition-[box-shadow] duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-800"
      >
        <input
          type="text"
          id="search"
          name="search"
          bind:this={searchInputEl}
          value={ui.searchQuery}
          onkeyup={useDebounce(handleSearchInput, 500)}
          spellcheck="false"
          aria-label="Search"
          class="border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-lg border bg-neutral-100 px-3 py-2 pl-10 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-900/80 md:pr-10"
        />
        <svg
          class="size-4 absolute left-3 top-3"
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
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          ></path>
        </svg>
        <KeyboardIndicator key="/" class="absolute right-3 top-2 hidden text-xs md:block" />
      </div>
    {/if}
    {#if showQuickAdd}
      <Popover.Root bind:open={ui.quickAddOpen}>
        <Popover.Trigger>
          {#snippet child({ props })}
            <div
              class="rounded-full transition-[box-shadow] duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-800"
            >
              <Button
                {...props}
                aria-label="Quick add bookmark"
                title="Quick add bookmark"
                variant="outline"
                class={cn(
                  ui.quickAddOpen ? "ring-2 ring-zinc-400" : "",
                  "p-0 rounded-full size-11 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900",
                )}
              >
                <svg
                  class="size-5 pointer-events-none"
                  data-slot="icon"
                  aria-label="Quick Add"
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
                    d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                  ></path>
                </svg>
              </Button>
            </div>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content sideOffset={30} class="w-[calc(100%-16px)] sm:w-auto">
          <QuickAddForm />
        </Popover.Content>
      </Popover.Root>
    {/if}
    {#if showSidebar}
      <div
        class="rounded-full transition-[box-shadow] duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-800"
      >
        <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
            <Button
              {...props}
              variant="outline"
              aria-label="Toggle metadata sidebar"
              aria-pressed={ui.metadataSidebarOpen}
              class={cn(
                ui.metadataSidebarOpen ? "ring-2 ring-zinc-400" : "",
                "p-0 rounded-full size-11 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900",
              )}
              onclick={() => ui.toggleMetadataSidebar()}
            >
              {#if ui.metadataSidebarOpen}
                <svg
                  class="size-5"
                  data-slot="icon"
                  fill="none"
                  aria-label="Metadata Sidebar"
                  stroke-width="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  ></path>
                </svg>
              {:else}
                <svg
                  class="size-5"
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
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  ></path>
                </svg>
              {/if}
            </Button>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p class="flex items-center justify-center">
              Toggle Sidebar <KeyboardIndicator key="]" class="ml-2 text-xs" />
            </p>
          </Tooltip.Content>
        </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    {/if}
  </div>
</nav>

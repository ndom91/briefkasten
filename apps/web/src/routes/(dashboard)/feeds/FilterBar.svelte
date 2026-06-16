<script lang="ts">
import { page } from "$app/state"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import DateRangePicker from "$lib/components/date-range/DateRangePicker.svelte"
import { Button } from "$lib/components/ui/button"
import { Checkbox } from "$lib/components/ui/checkbox"
import * as Command from "$lib/components/ui/command"
import { Label } from "$lib/components/ui/label"
import * as Popover from "$lib/components/ui/popover"
import { useInterface } from "$lib/state/ui.svelte"

const ui = useInterface()
let open = $state(false)

const feeds = $state(page.data.feeds.data)
// $inspect({ feeds })
</script>

<section
  class="flex flex-wrap items-center justify-start gap-4 border-l-4 border-l-transparent p-4 md:px-8"
>
  <div
    class="border-input flex h-10 items-center justify-center gap-2 rounded-md border bg-neutral-100 px-2 dark:bg-neutral-900"
  >
    <div class="mx-2 flex items-center justify-center gap-2">
      <Checkbox id="unread" bind:checked={ui.showUnreadOnly} />
      <Label class="hover:cursor-pointer" for="unread">Unread Only</Label>
    </div>
  </div>
  <Popover.Root bind:open>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          class="min-w-[150px] justify-between bg-neutral-100 dark:bg-neutral-900 md:w-[200px] "
        >
          Feeds
          <svg
            class="ml-2 h-4 w-4 shrink-0 opacity-50"
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
              d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            ></path>
          </svg>
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-[calc(100vw-2.2rem)] p-0 md:w-[200px]">
      <Command.Root>
        <Command.Input placeholder="Search.." />
        <Command.Empty>No results</Command.Empty>
        <Command.Group>
          {#each feeds as feed}
            <Command.Item class="flex" value={feed.name}>
              <Checkbox id={feed.id} bind:checked={feed.visible} />
              <label
                class="flex w-fit max-w-full grow items-center truncate hover:cursor-pointer"
                for={feed.id}
              >
                <span class="mx-2 grow truncate">{feed.name}</span>
                <img
                  src={`${PUBLIC_WORKER_URL}/img/_/https://favicon.controld.com/${new URL(feed.url).hostname}`}
                  alt="URL Favicon"
                  class="size-5 m-2 rounded-full"
                />
              </label>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
  <DateRangePicker />
</section>

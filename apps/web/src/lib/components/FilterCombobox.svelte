<script lang="ts">
import { tick } from "svelte"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import { Button } from "$lib/components/ui/button"
import { Checkbox } from "$lib/components/ui/checkbox"
import * as Command from "$lib/components/ui/command"
import * as Popover from "$lib/components/ui/popover"

const {
  data: inputData,
  placeholder = "Select an item..",
}: {
  data: LoadFeed[]
  placeholder?: string
} = $props()

let open = $state(false)
let triggerElement: HTMLButtonElement | undefined = $state()

// We want to refocus the trigger button when the user selects
// an item from the list so users can continue navigating the
// rest of the form with the keyboard.
function closeAndFocusTrigger() {
  open = false
  tick().then(() => {
    triggerElement?.focus()
  })
}
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        bind:ref={triggerElement}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        class="w-[300px] justify-between"
      >
        {placeholder}
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
  <Popover.Content class="w-[300px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search.." />
      <Command.Empty>No results</Command.Empty>
      <Command.Group>
        {#each inputData as item}
          <Command.Item
            value={item.name}
            onSelect={() => {
              closeAndFocusTrigger()
            }}
          >
            <Checkbox id={item.id} bind:checked={item.visible} />
            <img
              src={`${PUBLIC_WORKER_URL}/img/_/https://favicon.controld.com/${new URL(item.url).hostname}`}
              alt="URL Favicon"
              class="size-4 m-2 rounded-full"
            />
            <span class="truncate">{item.name}</span>
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>

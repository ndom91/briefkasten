<script lang="ts">
import { page } from "$app/state"
import { Button } from "$lib/components/ui/button"
import { Checkbox } from "$lib/components/ui/checkbox"
import * as Command from "$lib/components/ui/command"
import * as Popover from "$lib/components/ui/popover"

let open = $state(false)

const categories = $state(page.data.categories)
// $inspect({ categories })
</script>

<section class="p-4 border-l-4 md:px-8 border-l-transparent">
  <Popover.Root bind:open>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          class="justify-between w-[200px] bg-neutral-100 dark:bg-neutral-900"
        >
          Categories
          <svg
            class="ml-2 w-4 h-4 opacity-50 shrink-0"
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
    <Popover.Content class="p-0 w-[200px]">
      <Command.Root>
        <Command.Input placeholder="Search.." />
        <Command.Empty>No results</Command.Empty>
        <Command.Group>
          {#each categories as item}
            <Command.Item value={item.name}>
              <Checkbox id={item.id} bind:checked={item.visible} />
              <label
                for={item.id}
                class="flex hover:cursor-pointer grow truncate items-center"
              >
                <span class="ml-2 truncate">{item.name}</span>
              </label>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</section>

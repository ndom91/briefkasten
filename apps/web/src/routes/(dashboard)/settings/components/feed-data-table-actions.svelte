<script lang="ts">
import { Button } from "$lib/components/ui/button"
import * as Tooltip from "$lib/components/ui/tooltip"

const {
  id,
  toggleDeleteDialog,
}: {
  id: string
  toggleDeleteDialog: (id: string) => void
} = $props()

const handleEdit = async () => {
  // TODO: implement feed edit
  console.log("Edit", id)
}
</script>

<div class="flex gap-2">
  <Tooltip.Root>
    <Tooltip.Trigger class="outline-none">
      {#snippet child({ props })}
        <Button {...props} onclick={handleEdit} variant="ghost" size="icon">
          <svg
            class="pointer-events-none size-5 text-neutral-600 dark:text-neutral-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
          ><rect width="256" height="256" fill="none" /><path
            d="M92.69,216H48a8,8,0,0,1-8-8V163.31a8,8,0,0,1,2.34-5.65L165.66,34.34a8,8,0,0,1,11.31,0L221.66,79a8,8,0,0,1,0,11.31L98.34,213.66A8,8,0,0,1,92.69,216Z"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><line
            x1="136"
            y1="64"
            x2="192"
            y2="120"
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
    <Tooltip.Content side="right" sideOffset={8}>
      <p>Edit</p>
    </Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger class="outline-none">
      {#snippet child({ props })}
        <Button
          {...props}
          onclick={() => toggleDeleteDialog(id)}
          variant="ghost"
          size="icon"
        >
          <svg
            class="text-red-600 pointer-events-none size-5 dark:text-red-400/50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
          ><rect width="256" height="256" fill="none" /><line
            x1="216"
            y1="56"
            x2="40"
            y2="56"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><line
            x1="104"
            y1="104"
            x2="104"
            y2="168"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><line
            x1="152"
            y1="104"
            x2="152"
            y2="168"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><path
            d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          /><path
            d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56"
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
    <Tooltip.Content side="right" sideOffset={8}>
      <p>Delete</p>
    </Tooltip.Content>
  </Tooltip.Root>
</div>

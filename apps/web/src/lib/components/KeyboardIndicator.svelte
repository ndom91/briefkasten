<script lang="ts">
import { cn } from "$lib/utils"

export let key: string = ""
let className = ""
export { className as class }
</script>

<kbd
  {...$$restProps}
  class={cn(
    "inline-block rounded-sm bg-neutral-300 p-1 px-2 text-neutral-800 dark:bg-neutral-600 dark:text-neutral-100 border-b-[3px]",
    className,
  )}
>
  {#if $$slots.default}
    <slot />
  {:else if key}
    {key}
  {/if}
</kbd>

<script lang="ts">
import type { Snippet } from "svelte"
import Arrow from "$lib/assets/arrow.svg?raw"
import EmptyIllustration from "$lib/assets/new.png"
import { cn } from "$lib/utils"

const {
  showArrow = true,
  illustration,
  class: className,
}: {
  showArrow?: boolean
  illustration?: Snippet
  class?: string
} = $props()
</script>

{#if showArrow}
  <div class="absolute right-28 top-28 hidden text-neutral-700 dark:text-neutral-100 lg:block">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html Arrow}
  </div>
{/if}
<div class={cn(className, "mx-auto flex w-full flex-col items-center md:w-1/2")}>
  {#if illustration}
    {@render illustration()}
  {:else}
    <img src={EmptyIllustration} alt="Empty" class="w-full max-w-xl grayscale dark:invert" />
  {/if}
  <p class="mb-4 px-8 text-center text-3xl font-light">Looks like there's nothing here!</p>
</div>

<script lang="ts">
import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left"
import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui"
import { type ButtonVariant, buttonVariants } from "$lib/components/ui/button/index.js"
import { cn } from "$lib/utils.js"

let {
  ref = $bindable(null),
  class: className,
  children,
  variant = "ghost",
  ...restProps
}: RangeCalendarPrimitive.PrevButtonProps & {
  variant?: ButtonVariant
} = $props()
</script>

{#snippet Fallback()}
	<ChevronLeftIcon class="size-4" />
{/snippet}

<RangeCalendarPrimitive.PrevButton
	bind:ref
	class={cn(
		buttonVariants({ variant }),
		"size-(--cell-size) select-none bg-transparent p-0 disabled:opacity-50 rtl:rotate-180",
		className
	)}
	children={children || Fallback}
	{...restProps}
/>

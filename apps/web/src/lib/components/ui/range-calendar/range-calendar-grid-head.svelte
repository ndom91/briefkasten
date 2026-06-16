<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui"
import { cn } from "$lib/utils"

let {
	class: className,
	children,
	...restProps
}: RangeCalendarPrimitive.GridHeadProps = $props()
</script>

<RangeCalendarPrimitive.GridHead class={cn(className)} {...restProps}>
	{@render children?.()}
</RangeCalendarPrimitive.GridHead>

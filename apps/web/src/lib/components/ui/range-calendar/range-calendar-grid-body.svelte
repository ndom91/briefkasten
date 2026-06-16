<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui"
import { cn } from "$lib/utils"

let {
	class: className,
	children,
	...restProps
}: RangeCalendarPrimitive.GridBodyProps = $props()
</script>

<RangeCalendarPrimitive.GridBody class={cn(className)} {...restProps}>
	{@render children?.()}
</RangeCalendarPrimitive.GridBody>

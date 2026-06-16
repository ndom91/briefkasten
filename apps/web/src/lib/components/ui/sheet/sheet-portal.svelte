<script lang="ts">
import { Dialog as SheetPrimitive } from "bits-ui"

let { children }: { children?: import("svelte").Snippet } = $props()
</script>

<SheetPrimitive.Portal>
	{@render children?.()}
</SheetPrimitive.Portal>

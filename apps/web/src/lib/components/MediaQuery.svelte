<script lang="ts">
import { onMount, type Snippet } from "svelte"

let mql: MediaQueryList | undefined
let mqlListener: EventListener | undefined
let mounted = $state(false)
let matches = $state(false)

const {
  query,
  children,
}: {
  query: string
  children: Snippet<[matches?: boolean]>
} = $props()

onMount(() => {
  mounted = true
  return () => {
    removeActiveListener()
  }
})

$effect(() => {
  if (mounted) {
    removeActiveListener()
    addNewListener(query)
  }
})

function addNewListener(query: string) {
  mql = window.matchMedia(query)
  mqlListener = (v) => (matches = (v as MediaQueryListEvent).matches)
  mql.addEventListener("change", mqlListener)
  matches = mql.matches
}

function removeActiveListener() {
  if (mql && mqlListener) {
    mql.removeEventListener("change", mqlListener)
  }
}
</script>

{@render children(matches)}

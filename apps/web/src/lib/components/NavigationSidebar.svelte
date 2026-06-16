<script lang="ts">
import { watch } from "runed"
import Logo from "$lib/assets/Logo.svelte"
import Drawer from "$lib/components/mobile/Drawer.svelte"
import SidebarContent from "$lib/components/SidebarContent.svelte"
import { Button } from "$lib/components/ui/button"
import { useInterface } from "$lib/state/ui.svelte"
import { cn } from "$lib/utils"
import { isEditableTarget } from "$lib/utils/keyboard"

const ui = useInterface()
let userSidebarElement = $state<HTMLElement>()

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.repeat || isEditableTarget(event.target)) {
    return
  }
  if (event.code === "BracketLeft") {
    ui.toggleUserSidebar()
  }
}

const mutate = () => {
  if (!userSidebarElement) return
  if (ui.userSidebarOpen) {
    userSidebarElement.style.minWidth = "210px"
  } else {
    userSidebarElement.style.minWidth = "72px"
  }
}

watch.pre(
  () => ui.userSidebarOpen,
  () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => mutate())
    } else {
      mutate()
    }
  }
)

let windowWidth: number = $state(1000)
</script>

<svelte:window onkeydown={handleKeyDown} bind:innerWidth={windowWidth} />

{#if windowWidth < 768}
  <Drawer />
{:else}
  <aside
    bind:this={userSidebarElement}
    class="flex flex-col justify-start border-r border-r-neutral-200/80 bg-neutral-50/95 shadow-[1px_0_0_rgba(0,0,0,0.02)] transition-[min-width] duration-200 dark:border-r-neutral-800/80 dark:bg-neutral-900/95"
  >
    <div class="m-3 flex items-center justify-center gap-3">
      <Button
        class="flex justify-start rounded-lg transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-700"
        size="icon"
        variant="link"
        aria-label="Toggle navigation sidebar"
        onclick={ui.toggleUserSidebar}
      >
        <Logo class="size-10!" />
      </Button>
      <span
        class={cn(
          "transition-all text-xl font-light mx-auto",
          ui.userSidebarOpen ? "opacity-100" : "hidden",
        )}
      >
        Briefkasten
      </span>
    </div>
    <SidebarContent />
  </aside>
{/if}

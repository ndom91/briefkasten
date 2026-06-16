<script lang="ts">
import { Drawer } from "vaul-svelte"
import Logo from "$lib/assets/Logo.svelte"
import SidebarContent from "$lib/components/SidebarContent.svelte"
import { Button } from "$lib/components/ui/button"
import { useInterface } from "$lib/state/ui.svelte"

const ui = useInterface()

let drawerOpen = $state(false)

const toggleDrawer = () => {
  drawerOpen = !drawerOpen
}
</script>

<Drawer.Root direction="left" bind:open={drawerOpen}>
  <button
    aria-label="Toggle Drawer"
    onclick={() => (drawerOpen = !drawerOpen)}
    class="size-12 fixed left-3 top-3 z-20 flex items-center justify-center"
  >
    <svg
      class="size-6"
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
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      ></path>
    </svg>
  </button>
  <Drawer.Portal>
    <Drawer.Overlay class="fixed inset-0 bg-black/40 transition" />
    <Drawer.Content
      class="fixed bottom-0 left-0 top-0 z-30 flex w-full max-w-[300px] rounded-r-xl bg-neutral-100 p-2 dark:bg-neutral-900"
    >
      <div class="flex h-full w-full flex-col">
        <div class="m-4 flex items-center justify-start">
          <Button
            class="flex justify-start transition focus:outline-none focus:ring-2 focus:dark:ring-neutral-700"
            size="icon"
            variant="link"
            onclick={ui.toggleUserSidebar}
          >
            <Logo class="size-10!" />
          </Button>
          <span class="mx-auto text-xl font-light opacity-100 transition-all"> Briefkasten </span>
        </div>
        <SidebarContent open={true} {toggleDrawer} />
      </div>
      <div class="mx-2 mb-8 h-12 w-1.5 shrink-0 self-center rounded-full bg-neutral-300"></div>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>

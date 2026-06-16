<script lang="ts">
import { goto } from "$app/navigation"
import { page } from "$app/state"
import { AvatarMenu } from "$lib/components/navbar"
import { Button } from "$lib/components/ui/button"
import * as Tooltip from "$lib/components/ui/tooltip"
import { useInterface } from "$lib/state/ui.svelte"
import { cn } from "$lib/utils"

const ui = useInterface()

const { open = false, toggleDrawer }: { open?: boolean; toggleDrawer?: () => void } = $props()

const toggleAndNavigate = async (target: string) => {
  toggleDrawer?.()
  await goto(target)
}

const activePath = $derived(page.url.pathname)
const navButtonClass =
  "group relative flex w-full items-center rounded-lg border border-transparent px-2 py-2 text-neutral-600 transition-[background-color,border-color,color,box-shadow] duration-200 hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:hover:text-neutral-50 dark:focus-visible:ring-neutral-700"
const activeNavButtonClass =
  "active border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
const navLabelClass = "truncate text-sm font-medium transition-[opacity,width,margin] duration-200"
</script>

<Tooltip.Provider>
<div class="grow p-3">
  <nav class="flex flex-col items-stretch gap-1.5" aria-label="Primary">
    <Tooltip.Root>
      <Tooltip.Trigger class="outline-none">
        {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          data-sveltekit-preload-data="hover"
          aria-label="Home"
          aria-current={activePath === "/" ? "page" : undefined}
          class={cn(
            navButtonClass,
            activePath === "/" && activeNavButtonClass,
          )}
          onclickcapture={() => toggleAndNavigate("/")}
        >
          <svg
            class="size-6"
            aria-label="home"
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
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            ></path>
          </svg>
          <span
            class={cn(
              navLabelClass,
              ui.userSidebarOpen || open
                ? "opacity-100 w-min ml-3"
                : "hidden",
            )}
          >
            Home
          </span>
        </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="right"
        sideOffset={8}
      >
        <p>Dashboard</p>
      </Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger class="outline-none">
        {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          data-sveltekit-preload-data="hover"
          aria-label="Bookmarks"
          aria-current={activePath === "/bookmarks" ? "page" : undefined}
          class={cn(
            navButtonClass,
            activePath === "/bookmarks" && activeNavButtonClass,
          )}
          onclickcapture={() => toggleAndNavigate("/bookmarks")}
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
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            ></path>
          </svg>
          <span
            class={cn(
              navLabelClass,
              ui.userSidebarOpen || open ? "opacity-100 ml-3" : "hidden",
            )}
          >
            Bookmarks
          </span>
        </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="right"
        sideOffset={8}
      >
        <p>Bookmarks</p>
      </Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger class="outline-none">
        {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          data-sveltekit-preload-data="hover"
          aria-label="RSS feeds"
          aria-current={activePath === "/feeds" ? "page" : undefined}
          class={cn(
            navButtonClass,
            activePath === "/feeds" && activeNavButtonClass,
          )}
          onclickcapture={() => toggleAndNavigate("/feeds")}
        >
          <svg
            class="size-6"
            aria-label="feeds"
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
              d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            ></path>
          </svg>
          <span
            class={cn(
              navLabelClass,
              ui.userSidebarOpen || open ? "opacity-100 ml-3" : "hidden",
            )}
          >
            Feeds
          </span>
        </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="right"
        sideOffset={8}
      >
        <p>RSS Feeds</p>
      </Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger class="outline-none">
        {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          data-sveltekit-preload-data="hover"
          aria-label="Archives"
          aria-current={activePath === "/archives" ? "page" : undefined}
          class={cn(
            navButtonClass,
            activePath === "/archives" && activeNavButtonClass,
          )}
          onclickcapture={() => toggleAndNavigate("/archives")}
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
              d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            ></path>
          </svg>
          <span
            class={cn(
              navLabelClass,
              ui.userSidebarOpen || open ? "opacity-100 ml-3" : "hidden",
            )}
          >
            Archive
          </span>
        </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="right"
        sideOffset={8}
      >
        <p>Archives</p>
      </Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger class="outline-none">
        {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          data-sveltekit-preload-data="hover"
          aria-label="Categories"
          aria-current={activePath === "/categories" ? "page" : undefined}
          class={cn(
            navButtonClass,
            activePath === "/categories" && activeNavButtonClass,
          )}
          onclickcapture={() => toggleAndNavigate("/categories")}
        >
          <svg
            class="size-6"
            data-slot="icon"
            aria-label="package"
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
              d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
            ></path>
          </svg>
          <span
            class={cn(
              navLabelClass,
              ui.userSidebarOpen || open ? "opacity-100 ml-3" : "hidden",
            )}
          >
            Categories
          </span>
        </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="right"
        sideOffset={8}
      >
        <p>Categories</p>
      </Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger class="outline-none">
        {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          data-sveltekit-preload-data="hover"
          aria-label="Tags"
          aria-current={activePath === "/tags" ? "page" : undefined}
          class={cn(
            navButtonClass,
            activePath === "/tags" && activeNavButtonClass,
          )}
          onclickcapture={() => toggleAndNavigate("/tags")}
        >
          <svg
            class="size-6"
            data-slot="icon"
            fill="none"
            aria-label="tag"
            stroke-width="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
            ></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"></path>
          </svg>
          <span
            class={cn(
              navLabelClass,
              ui.userSidebarOpen || open ? "opacity-100 ml-3" : "hidden",
            )}
          >
            Tags
          </span>
        </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="right"
        sideOffset={8}
      >
        <p>Tags</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </nav>
</div>
</Tooltip.Provider>
<div class="flex w-full flex-col items-start justify-center self-end border-t border-neutral-200/70 p-3 dark:border-neutral-800/80">
  <div class="flex w-full items-center justify-center gap-3 rounded-lg p-1">
    <AvatarMenu />
    <span
      class={cn(
        "min-w-0 truncate text-sm font-medium text-neutral-700 transition-[opacity] dark:text-neutral-300",
        ui.userSidebarOpen || open ? "opacity-100" : "hidden",
      )}
    >
      {page.data.session?.user?.name ?? ""}
    </span>
  </div>
</div>

<style>
@reference "tailwindcss";

:global(button.active) {
  @apply ring-2 ring-offset-transparent ring-neutral-400;
}
:global(html.dark button.active) {
  @apply ring-neutral-800;
}
</style>

<script lang="ts">
import type { Snippet } from "svelte"
import { Toaster } from "svelte-sonner"
import Shortcuts from "$lib/components/GlobalShortcuts.svelte"
import MediaQuery from "$lib/components/MediaQuery.svelte"
import Scripts from "$lib/components/Scripts.svelte"
import * as Tooltip from "$lib/components/ui/tooltip"
import "$lib/styles/global.css"

const { children }: { children: Snippet } = $props()
</script>

<svelte:head>
  <title>Briefkasten</title>
  <meta name="description" content="RSS Feeds, Bookmarks, and more!" />
</svelte:head>

<Scripts />

<Shortcuts />

<MediaQuery query="(max-width: 767px)">
  {#snippet children(matches)}
    {#if matches}
      <Toaster
        class="toaster group"
        position="top-left"
        toastOptions={{
          class:
            "border border-gray-200/70 bg-white/20 backdrop-blur-md dark:border-gray-400/10 dark:bg-neutral-700/20 dark:text-white",
        }}
      />
    {:else}
      <Toaster
        class="toaster group"
        toastOptions={{
          class:
            "border border-gray-200/70 bg-white/20 backdrop-blur-md dark:border-gray-400/10 dark:bg-neutral-700/20 dark:text-white",
        }}
      />
    {/if}
  {/snippet}
</MediaQuery>

<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>

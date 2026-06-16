<script lang="ts">
import { dev } from "$app/environment"
</script>

<svelte:head>
  {#if !dev}
    <script
      src="https://stats.ndo.dev/api/script.js"
      data-site-id="4"
      defer
      fetchpriority="low"
    ></script>
  {/if}
</svelte:head>

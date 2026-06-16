<script lang="ts">
import { page } from "$app/stores"

let crumbs: Array<{ label: string; href: string }> = []

$: {
  // Remove zero-length tokens.
  const tokens = $page.url.pathname.split("/").filter((t) => t !== "")

  let tokenPath = ""
  crumbs = tokens.map((t) => {
    tokenPath += `/${t}`
    t = t.charAt(0).toUpperCase() + t.slice(1)
    return { label: t, href: tokenPath }
  })

  crumbs.unshift({ label: "Home", href: "/" })
}
</script>

<div class="min-w-[50px]">
  <div class="hidden items-center font-light md:block">
    {#each crumbs as c, i}
      {#if i === crumbs.length - 1}
        <span class="p-1">
          {c.label}
        </span>
      {:else}
        <a
          class="p-1 rounded-sm outline-none focus:ring-2 focus:outline-none dark:focus:ring-zinc-500 focus:ring-zinc-200"
          href={c.href}>{c.label}</a
        >&nbsp;/&nbsp;
      {/if}
    {/each}
  </div>
</div>

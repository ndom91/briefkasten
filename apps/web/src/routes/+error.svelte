<script>
import { ModeWatcher } from "mode-watcher"
import { page } from "$app/stores"
import Logo from "$lib/assets/Logo.svelte"
import { Button } from "$lib/components/ui/button"
</script>

<ModeWatcher />
<div class="flex flex-col justify-center items-center w-full">
  <nav
    class="flex gap-4 justify-end items-center p-4 mx-auto w-full h-20 border-b border-b-zinc-100 dark:border-b-zinc-900"
  >
    <div class="flex gap-2 justify-start items-center mx-auto w-full max-w-7xl text-xl">
      <Logo class="mr-4 size-8 text-neutral-800 dark:text-neutral-50" />
      <span class="items-center text-red-400">
        {$page.status}
      </span>
      <span class="">Error</span>
    </div>
  </nav>
  <div class="flex flex-col gap-8 justify-center items-center px-4 mt-12 w-full max-w-(--breakpoint-md)">
    <img src="/img/confused-travolta.gif" alt="Lost Travolta" class="w-full" />
    <span class="text-xl font-normal text-center text-balance">
      Uh oh, something's gone wrong
      {#if $page.error?.message}
        - {$page.error?.message}
      {/if}
    </span>
    <Button variant="default" href="/" class="w-64">
      <svg
        class="mr-2 size-5"
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
      Go back Home
    </Button>
  </div>
</div>

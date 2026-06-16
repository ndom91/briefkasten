<script lang="ts">
import { goto } from "$app/navigation"
import { page } from "$app/state"
import { Navbar } from "$lib/components/navbar"
import * as Tabs from "$lib/components/ui/tabs"
import AboutSection from "./components/AboutSection.svelte"
import FeedsSection from "./components/FeedsSection.svelte"
import UserSection from "./components/UserSection.svelte"

const tab = $derived(page.url.searchParams.get("tab"))

const handleTabChange = (data: string | undefined) => {
  goto(`?tab=${data}`)
}
</script>

<svelte:head>
  <title>Briefkasten | Settings</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<Navbar showSearch={false} showQuickAdd={false} showSidebar={false} />
<main
  class="p-4 align-start flex max-h-[calc(100vh-80px)] w-full flex-col justify-start gap-8"
>
  <Tabs.Root
    value={tab ?? "user"}
    class="flex flex-col grow w-full max-w-screen-3xl"
    onValueChange={handleTabChange}
  >
    <div class="p-4">
      <Tabs.List
        class="*:w-full *:text-lg *:font-normal h-12 w-full bg-neutral-100 dark:bg-neutral-800"
      >
        <Tabs.Trigger class="data-[state=active]:shadow-none" value="user">User</Tabs.Trigger>
        <Tabs.Trigger class="data-[state=active]:shadow-none" value="feeds">Feeds</Tabs.Trigger>
        <Tabs.Trigger class="data-[state=active]:shadow-none" value="about">About</Tabs.Trigger>
      </Tabs.List>
    </div>
    <Tabs.Content value="user" class="overflow-y-scroll px-4 pr-2 max-h-[calc(100vh-168px)]">
      <UserSection />
    </Tabs.Content>
    <Tabs.Content value="feeds" class="overflow-y-scroll px-4 pr-2 max-h-[calc(100vh-168px)]">
      <FeedsSection />
    </Tabs.Content>
    <Tabs.Content value="about" class="overflow-y-scroll px-4 pr-2 max-h-[calc(100vh-168px)]">
      <AboutSection />
    </Tabs.Content>
  </Tabs.Root>
</main>

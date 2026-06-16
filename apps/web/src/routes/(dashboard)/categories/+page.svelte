<script lang="ts">
import { format } from "@formkit/tempo"
import { Label } from "$/lib/components/ui/label"
import { enhance } from "$app/forms"
import { Navbar } from "$lib/components/navbar"
import { Button } from "$lib/components/ui/button"
import { Input } from "$lib/components/ui/input"
import * as Table from "$lib/components/ui/table"
import { handleActionResults } from "$lib/utils/form-action"
import DataTableActions from "./data-table-actions.svelte"

type Category = {
  id: string
  name: string
  description: string | null
  createdAt: Date
}

type SortColumn = "name" | "description" | "createdAt" | null
type SortDirection = "asc" | "desc" | null

const { data } = $props()

let categories = $state<Category[]>(data.categories ?? [])
let sortColumn = $state<SortColumn>(null)
let sortDirection = $state<SortDirection>(null)

$effect(() => {
  if (data.categories) {
    categories = data.categories
  }
})

const sortedCategories = $derived(() => {
  if (!sortColumn || !sortDirection) {
    return categories
  }

  const col = sortColumn
  const dir = sortDirection

  return [...categories].sort((a, b) => {
    const aVal = a[col]
    const bVal = b[col]

    if (aVal == null && bVal == null) return 0
    if (aVal == null) return dir === "asc" ? 1 : -1
    if (bVal == null) return dir === "asc" ? -1 : 1

    let comparison = 0
    if (col === "createdAt") {
      comparison = new Date(aVal).getTime() - new Date(bVal).getTime()
    } else {
      comparison = String(aVal).localeCompare(String(bVal))
    }

    return dir === "asc" ? comparison : -comparison
  })
})

const toggleSort = (column: SortColumn) => {
  if (sortColumn === column) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc"
  } else {
    sortColumn = column
    sortDirection = "asc"
  }
}
</script>

<svelte:head>
  <title>Briefkasten | Categories</title>
  <meta name="description" content="RSS Feeds, Bookmarks and more!" />
</svelte:head>

<Navbar showSearch={false} showQuickAdd={false} showSidebar={false} />
<main
  class="p-4 outline-none align-start overflow-y-scroll flex max-h-[calc(100vh-80px)] w-full flex-col justify-start gap-8"
>
  <fieldset class="grid gap-6 rounded-lg border p-4">
    <legend class="-ml-1 px-2 font-light"> Create New </legend>
    <form
      method="post"
      action="?/createCategory"
      use:enhance={handleActionResults()}
      class="flex flex-col md:flex-row gap-4 justify-start items-center py-4"
    >
      <div class="grid gap-3 w-full md:w-56 place-items-baseline">
        <Label for="name">Name</Label>
        <Input class="" id="name" name="name" type="text" />
      </div>
      <div class="grid gap-3 w-full md:w-64 flex-1">
        <Label for="description">Description</Label>
        <Input class="" id="description" name="description" type="text" />
      </div>
      <Button variant="default" type="submit" class="w-full md:w-36 place-self-end">Save</Button>
    </form>
  </fieldset>
  <Table.Root>
    <Table.Header>
      <Table.Row class="hover:bg-transparent!">
        <Table.Head class="hidden lg:table-cell">
          <div class="text-left">ID</div>
        </Table.Head>
        <Table.Head>
          <Button class="text-left" variant="ghost" onclick={() => toggleSort("name")}>
            Name
            <svg
              class="ml-2 fill-neutral-800 size-4 dark:fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              ><rect width="256" height="256" fill="none" /><polyline
                points="80 176 128 224 176 176"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /><polyline
                points="80 80 128 32 176 80"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /></svg
            >
          </Button>
        </Table.Head>
        <Table.Head>
          <Button class="text-left" variant="ghost" onclick={() => toggleSort("description")}>
            Description
            <svg
              class="ml-2 fill-neutral-800 size-4 dark:fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              ><rect width="256" height="256" fill="none" /><polyline
                points="80 176 128 224 176 176"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /><polyline
                points="80 80 128 32 176 80"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /></svg
            >
          </Button>
        </Table.Head>
        <Table.Head>
          <Button class="text-left" variant="ghost" onclick={() => toggleSort("createdAt")}>
            Created
            <svg
              class="ml-2 fill-neutral-800 size-4 dark:fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              ><rect width="256" height="256" fill="none" /><polyline
                points="80 176 128 224 176 176"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /><polyline
                points="80 80 128 32 176 80"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              /></svg
            >
          </Button>
        </Table.Head>
        <Table.Head>
          <div class="text-left"></div>
        </Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each sortedCategories() as category (category.id)}
        <Table.Row class="hover:dark:bg-neutral-900/20">
          <Table.Cell
            class="hidden lg:block lg:w-48 text-neutral-400 truncate lg:max-w-48 dark:text-neutral-600"
          >
            {category.id}
          </Table.Cell>
          <Table.Cell class="w-80 max-w-xs">
            {category.name}
          </Table.Cell>
          <Table.Cell class="w-96 max-w-sm">
            {category.description ?? ""}
          </Table.Cell>
          <Table.Cell>
            {format(category.createdAt, "medium")}
          </Table.Cell>
          <Table.Cell class="w-32 text-right max-w-32">
            <DataTableActions id={category.id} />
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
    <Table.Footer class="bg-transparent dark:text-white text-muted-foreground">
      <span class="flex whitespace-pre text-xs">
        Showing <strong>1-{categories.length}</strong> of <strong>{categories.length}</strong> categories(s)
      </span>
    </Table.Footer>
  </Table.Root>
</main>

<script lang="ts" module>
export type Tag = {
  label: string
  value: string
}
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  // TODO: Refactor using reactive set/map
  import { Combobox } from "bits-ui"
  import { type FormPathLeaves, type SuperForm, formFieldProxy } from "sveltekit-superforms"
  import { Badge } from "$lib/components/ui/badge"
  import type { Tag as RawTag } from "$lib/types/zod.js"

  const {
    form,
    tags = [],
    disabled = false,
    field,
  }: {
    form: SuperForm<T>
    field: FormPathLeaves<T, string>
    disabled?: boolean
    tags: RawTag[]
  } = $props()

  let inputValue = $state("")
  const { form: formInstance } = form
  let selectedIds = $state<string[]>(
    ($formInstance.tags as RawTag[])?.map((tag) => tag.id) ?? [],
  )

  const tagValues = $derived(tags.map((tag: RawTag) => ({ value: tag.id, label: tag.name })))

  const filteredTags = $derived(
    inputValue
      ? tagValues.filter((tag) => tag.label.toLowerCase().includes(inputValue.toLowerCase()))
      : tagValues,
  )

  const selectedValues = $derived(
    selectedIds
      .map((id) => tagValues.find((tag) => tag.value === id))
      .filter((tag): tag is Tag => tag !== undefined),
  )

  const { value, errors } = formFieldProxy(form, field)

  $effect(() => {
    const mappedValues = selectedIds
      .map((id) => tags.find((tag) => tag.id === id))
      .filter((tag): tag is RawTag => tag !== undefined)
    $value = mappedValues as typeof $value
  })
</script>

<Combobox.Root
  type="multiple"
  {disabled}
  bind:value={selectedIds}
  items={filteredTags}
>
  <div class="relative">
    <svg
      class="absolute top-1/2 -translate-y-1/2 start-[0.6rem] size-5 text-foreground"
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

    <Combobox.Input
      class="inline-flex py-2 px-3 pl-10 w-full h-10 text-sm rounded-md border transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:bg-transparent disabled:opacity-50 truncate border-input enabled:bg-neutral-100 placeholder:text-foreground/50 dark:enabled:bg-neutral-950 focus:ring-foreground focus:ring-offset-background"
      placeholder="Select a tag"
      aria-label="Select a tag"
      aria-invalid={$errors ? "true" : undefined}
      oninput={(e) => (inputValue = e.currentTarget.value)}
    />
    <svg
      class="absolute top-1/2 -translate-y-1/2 end-[0.6rem] size-5 text-neutral-50/50"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <rect width="256" height="256" fill="none" />
      <polyline
        points="80 176 128 224 176 176"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="12"
      />
      <polyline
        points="80 80 128 32 176 80"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="12"
      />
    </svg>
  </div>
  <Combobox.Content
    class="p-2 w-full rounded-md border outline-none border-neutral-50 bg-background shadow-popover dark:border-neutral-700"
    sideOffset={8}
  >
    {#each filteredTags as tag (tag.value)}
      <Combobox.Item
        class="flex items-center py-1 pr-1.5 pl-4 w-full h-8 text-sm rounded-md transition-all duration-75 outline-none select-none data-[highlighted]:bg-popover"
        value={tag.value}
        label={tag.label}
      >
        {tag.label}
      </Combobox.Item>
    {:else}
      <span class="block py-2 px-5 text-sm text-muted-foreground"> No results found </span>
    {/each}
  </Combobox.Content>
</Combobox.Root>
{#if selectedValues.length}
  <div class="flex flex-wrap gap-2 mb-2">
    {#each selectedValues as tag (tag.value)}
      <Badge class="text-xs">
        {tag.label}
      </Badge>
    {/each}
  </div>
{/if}
{#if $errors}<span class="text-xs text-red-400">{$errors}</span>{/if}

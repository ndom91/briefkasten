<script lang="ts">
import { format } from "@formkit/tempo"
import { toast } from "svelte-sonner"
import SuperDebug, { defaults, superForm } from "sveltekit-superforms"
import { zod4Client } from "sveltekit-superforms/adapters"
import { dev } from "$app/environment"
import { page } from "$app/state"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
import TagInput from "$lib/components/TagInput.svelte"
import { Button, buttonVariants } from "$lib/components/ui/button"
import * as Command from "$lib/components/ui/command"
import { Label } from "$lib/components/ui/label"
import * as Popover from "$lib/components/ui/popover"
import * as Tooltip from "$lib/components/ui/tooltip"
import { BookmarksService } from "$lib/state/bookmarks.svelte"
import { useInterface } from "$lib/state/ui.svelte"
import { cn } from "$lib/utils"
import { getContext } from "$lib/utils/context"
import { countryMaps } from "$lib/utils/countries"
import { formSchema as metadataSchema } from "$schemas/metadata-sidebar"

const ui = useInterface()
const bookmarksService = getContext(BookmarksService)

const isEditMode = $derived(ui.metadataSidebarEditMode === true)

const defaultData = {
  id: ui.metadataSidebarData.bookmark?.id,
  url: ui.metadataSidebarData.bookmark?.url,
  title: ui.metadataSidebarData.bookmark?.title,
  description: ui.metadataSidebarData.bookmark?.desc,
  image: ui.metadataSidebarData.bookmark?.image,
  category: ui.metadataSidebarData.bookmark?.category?.id,
  tags: ui.metadataSidebarData.bookmark?.tags,
}

// @ts-expect-error TODO figure out wtf this default fn wants as arg
const superformInstance = superForm(defaults(defaultData, zod4Client(metadataSchema)), {
  resetForm: false,
  dataType: "json",
  validators: zod4Client(metadataSchema),
  onUpdated: async ({ form }) => {
    if (form.valid) {
      const actionMessage = form.message as
        | { bookmark?: LoadBookmarkFlatTags; text?: string }
        | undefined
      if (actionMessage?.bookmark) {
        bookmarksService.update(actionMessage.bookmark)
        ui.setMetadataSidebarData({
          ...ui.metadataSidebarData,
          bookmark: actionMessage.bookmark,
        })
        toast.success("Bookmark Updated")
        ui.toggleMetadataSidebarEditMode()
      }
    }
  },
  onError: ({ result }) => {
    if (result.type === "error") {
      toast.error(result.error.message)
    }
  },
})
const { form, errors, constraints, enhance, submitting, delayed } = superformInstance

let selectOpen = $state(false)

const faviconUrl = $derived.by(() => {
  let iconUrl = ""
  try {
    iconUrl = `${PUBLIC_WORKER_URL}/img/_/https://favicon.controld.com/${new URL($form.url as string).hostname}`
  } catch {
    iconUrl = "https://raw.githubusercontent.com/hustcc/placeholder.js/master/favicon.ico"
  }
  return iconUrl
})
</script>

<form
  method="POST"
  action="/bookmarks?/saveMetadata"
  use:enhance
  class="flex h-full items-center justify-start gap-4"
>
  <div class="flex h-full w-full flex-col gap-4 overflow-y-scroll p-6 pr-4">
    <div class="flex items-center justify-between">
      <h2>Metadata</h2>
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props })}
          <Button
            {...props}
            variant="outline"
            disabled={!ui.metadataSidebarData.bookmark}
            size="icon"
            onclick={() => ui.toggleMetadataSidebarEditMode()}
          >
            <svg
              class="size-5 pointer-events-none"
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              ></path>
            </svg>
          </Button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content side="left">
          <p>Toggle Edit Mode</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
    {#if !ui.metadataSidebarData.bookmark}
      <div class="mt-2 inline leading-relaxed">
        <div class="font-bold">No bookmark selected.</div>
        <span class="leading-loose">
          Please select a bookmark to view in detail and edit by clicking the
          <span
            title="Edit"
            class="size-6 mx-1 inline-block rounded-sm bg-neutral-200 p-1 align-text-bottom dark:bg-neutral-800"
          >
            <svg
              class="size-4 text-neutral-900 dark:text-neutral-200"
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              ></path>
            </svg>
          </span>
          button in the actions overlay when hovering over a bookmark.
        </span>
      </div>
    {:else}
      <div class="flex flex-col items-start gap-2">
        <Label for="title">Title</Label>
        <input
          type="text"
          id="title"
          readonly={!isEditMode}
          bind:value={$form.title}
          aria-invalid={$errors.title ? "true" : undefined}
          {...$constraints.title}
          class={cn(
            "border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            !isEditMode ? "text-muted cursor-default" : "bg-neutral-100 dark:bg-neutral-950",
          )}
        />
        {#if $errors.title}<span class="text-xs text-red-400">{$errors.title}</span>{/if}
      </div>
      <div class="flex flex-col gap-2">
        <Label for="url">URL</Label>
        <div class="relative">
          <input
            type="url"
            id="url"
            readonly={!isEditMode}
            bind:value={$form.url}
            aria-invalid={$errors.url ? "true" : undefined}
            {...$constraints.url}
            class={cn(
              "border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 pl-10 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              !isEditMode ? "text-muted cursor-default" : "bg-neutral-100 dark:bg-neutral-950",
            )}
          />
          <img class="size-4 absolute left-3 top-3" src={faviconUrl} alt="URL Favicon" />
        </div>
        {#if $errors.url}<span class="text-xs text-red-400">{$errors.title}</span>{/if}
      </div>
      <div class="grow-wrap flex flex-col gap-2">
        <Label for="description">Description</Label>
        <textarea
          rows="4"
          id="description"
          readonly={!isEditMode}
          bind:value={$form.description}
          aria-invalid={$errors.description ? "true" : undefined}
          {...$constraints.description}
          class={cn(
            "border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            !isEditMode ? "text-muted cursor-default" : "bg-neutral-100 dark:bg-neutral-950",
          )}
        ></textarea>
        {#if $errors.description}<span class="text-xs text-red-400">{$errors.title}</span>{/if}
      </div>
      <div class="flex flex-col gap-2">
        <Popover.Root bind:open={selectOpen}>
          <Label>Category</Label>
          <Popover.Trigger
            class={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-between bg-transparent",
              !$form.category && "text-muted-foreground",
              !isEditMode
                ? "text-muted pointer-events-none cursor-default"
                : "bg-neutral-100 dark:bg-neutral-950",
            )}
            role="combobox"
          >
            {ui.metadataSidebarData.categories?.find((c) => c.id === $form.category)?.name ??
              "Select category"}
            <svg
              class="ml-2 h-4 w-4 shrink-0 opacity-50"
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
                d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              ></path>
            </svg>
          </Popover.Trigger>
          <Popover.Content class="w-[230px] p-0">
            <Command.Root>
              <Command.Input autofocus placeholder="Search categories..." class="h-9" />
              <Command.Empty>No categories.</Command.Empty>
              <Command.Group>
                {#if ui.metadataSidebarData.categories?.length}
                  {#each ui.metadataSidebarData.categories as category}
                    <Command.Item
                      value={category.name}
                      class="w-full cursor-pointer justify-start gap-2"
                      onSelect={() => {
                        // Toggle selected on/off
                        $form.category = $form.category === category.id ? undefined : category.id
                      }}
                    >
                      <svg
                        class={cn("size-4", category.id !== $form.category && "text-transparent")}
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
                          d="m4.5 12.75 6 6 9-13.5"
                        ></path>
                      </svg>
                      <span>{category.name}</span>
                    </Command.Item>
                  {/each}
                {/if}
              </Command.Group>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
      <div class="flex flex-col gap-2">
        <Label for="category">Tags</Label>
        <TagInput
          form={superformInstance}
          tags={page.data.tags}
          field="tags"
          disabled={!isEditMode}
        />
      </div>
      {#if ui.metadataSidebarData.bookmark.image}
        <div
          class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")}
        ></div>
        <div class="mb-2 flex flex-col items-start gap-2">
          <h2>Cover Photo</h2>
          <img
            src={`${PUBLIC_WORKER_URL}/img/_/${ui.metadataSidebarData.bookmark.id}`}
            alt="Bookmark Screenshot"
            class="w-full max-w-sm rounded-md border-2 border-neutral-100 object-cover dark:border-neutral-800"
          />
        </div>
      {/if}
      <div
        class={cn("w-full rounded-full border-b-2 border-zinc-100 px-8 dark:border-zinc-800")}
      ></div>
      <div class="mb-2 flex grow flex-col items-start gap-2">
        <h2>Metadata</h2>
        <div class="flex w-full justify-between text-sm">
          <span class="font-bold">Language</span>
          <span>
            {ui.metadataSidebarData.bookmark.metadata?.lang
              ? // @ts-expect-error - fix up enum lookup
                countryMaps[ui.metadataSidebarData.bookmark.metadata?.lang.toUpperCase()]
              : "Unknown"}
          </span>
        </div>
        <div class="flex w-full justify-between text-sm">
          <span class="font-bold">Publisher</span>
          <span>
            {ui.metadataSidebarData.bookmark.metadata?.publisher}
          </span>
        </div>
        <div class="flex w-full justify-between text-sm">
          <span class="font-bold">Added</span>
          {#if ui.metadataSidebarData.bookmark.createdAt}
            <span>
              {format(ui.metadataSidebarData.bookmark.createdAt, "medium")}
            </span>
          {/if}
        </div>
      </div>
      {#if isEditMode}
        <div class="w-full">
          <Button
            type="submit"
            disabled={$submitting || $delayed}
            class="ring-offset-background focus:ring-foreground focus:ring-offset-background w-full transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {#if $submitting || $delayed}
              <LoadingIndicator class="mr-2" />
            {/if}
            Save
          </Button>
        </div>
      {/if}
      {#if dev}
        <div class="flex flex-col pt-4">
          <SuperDebug data={{ $form, $constraints, $errors }} collapsible={true} theme="vscode" />
        </div>
      {/if}
    {/if}
  </div>
</form>

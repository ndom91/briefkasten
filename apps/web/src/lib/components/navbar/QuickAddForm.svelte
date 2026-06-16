<script lang="ts">
import { toast } from "svelte-sonner"
import SuperDebug, { fieldProxy, superForm } from "sveltekit-superforms"
import { zod4Client } from "sveltekit-superforms/adapters"
import { dev } from "$app/environment"
import { page } from "$app/state"
import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
import TagInput from "$lib/components/TagInput.svelte"
import { Button } from "$lib/components/ui/button"
import { Label } from "$lib/components/ui/label"
import * as Select from "$lib/components/ui/select"
import { BookmarksService } from "$lib/state/bookmarks.svelte"
import { useInterface } from "$lib/state/ui.svelte"
import { cn } from "$lib/utils"
import { getContext } from "$lib/utils/context"
import { formSchema } from "$schemas/quick-add"

const ui = useInterface()
const bookmarksService = getContext(BookmarksService)

const form = superForm(page.data.quickAddForm, {
  dataType: "json",
  customValidity: true,
  validators: zod4Client(formSchema),
  onUpdated: ({ form }) => {
    if (form.valid) {
      const actionMessage = form.message as
        | { bookmark?: LoadBookmarkFlatTags; text?: string }
        | undefined
      if (actionMessage?.bookmark) {
        bookmarksService.add(actionMessage.bookmark)
        toast.success("Bookmark Added")
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
const { form: formData, errors, constraints, enhance, submitting, delayed } = form
const categoryProxy = fieldProxy(form, "categoryId", {})
</script>

<form
  id="quickAdd"
  method="POST"
  action="/bookmarks?/quickAdd"
  use:enhance
  class="flex flex-col gap-2"
>
  <div class="align-start flex flex-col gap-2">
    <Label class="flex items-end justify-between" for="title"
      >Title<small class="text-neutral-400 dark:text-neutral-600">required</small></Label
    >
    <input
      type="text"
      name="title"
      bind:value={$formData.title}
      aria-invalid={$errors.title ? "true" : undefined}
      {...$constraints.title}
      class={cn(
        "flex h-10 w-full rounded-md border border-input disabled:bg-transparent disabled:opacity-50 enabled:bg-neutral-100 placeholder:text-foreground/50 dark:enabled:bg-neutral-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed  focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-foreground focus:ring-offset-background transition-shadow duration-200",
        $errors.title ? "border-red-300" : "",
      )}
    />
    {#if $errors.title}<span class="text-xs text-red-400">{$errors.title}</span>{/if}
  </div>

  <div class="align-start flex flex-col gap-2">
    <Label class="flex items-end justify-between" for="url">
      URL
      <small class="text-neutral-400 dark:text-neutral-600">required</small>
    </Label>
    <input
      type="text"
      name="url"
      bind:value={$formData.url}
      aria-invalid={$errors.url ? "true" : undefined}
      {...$constraints.url}
      class={cn(
        "flex h-10 w-full rounded-md border border-input disabled:bg-transparent enabled:bg-neutral-100 placeholder:text-foreground/50 dark:enabled:bg-neutral-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-foreground focus:ring-offset-background transition-shadow duration-200",
        $errors.url ? "border-red-300" : "",
      )}
    />
    {#if $errors.url}<span class="text-xs text-red-400">{$errors.url}</span>{/if}
  </div>

  <div class="align-start flex flex-col gap-2">
    <Label for="category">Category</Label>
    <Select.Root
      name="categoryId"
      type="single"
      onValueChange={(v: string) => ($categoryProxy = v)}
    >
      <Select.Trigger
        class="border-input placeholder:text-foreground/50 focus:ring-foreground focus:ring-offset-background w-full truncate transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 enabled:bg-neutral-100 disabled:bg-transparent disabled:opacity-50 dark:enabled:bg-neutral-950"
      >
        Choose a category
      </Select.Trigger>
      <Select.Content>
        {#each page.data?.categories as category (category.id)}
          <Select.Item value={category.id}>{category.name}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <input type="hidden" name="categoryId" value={$categoryProxy || ""} />
    {#if $errors.category}<span class="text-xs text-red-400">{$errors.category}</span>{/if}
  </div>

  <div class="align-start flex flex-col gap-2">
    <Label for="tags">Tags</Label>
    <!-- @ts-ignore -->
    <TagInput {form} tags={page.data.tags} field="tags" />
  </div>

  <div class="align-start flex flex-col gap-2">
    <Label for="description">Description</Label>
    <input
      type="text"
      name="description"
      placeholder="Leave blank to use auto-generated"
      bind:value={$formData.description}
      aria-invalid={$errors.description ? "true" : undefined}
      {...$constraints.description}
      class={cn(
        "flex h-10 w-full rounded-md border border-input disabled:bg-transparent truncate enabled:bg-neutral-100 placeholder:text-foreground/50 dark:enabled:bg-neutral-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-foreground focus:ring-offset-background transition-shadow duration-200",
        $errors.description ? "border-red-300" : "",
      )}
    />
    {#if $errors.description}<span class="text-xs text-red-400">{$errors.description}</span>{/if}
  </div>

  <Button
    type="submit"
    disabled={$submitting || $delayed}
    class="ring-offset-background focus:ring-foreground focus:ring-offset-background transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  >
    {#if $submitting || $delayed}
      <LoadingIndicator class="mr-2" />
    {/if}
    Submit
  </Button>
  {#if dev}
    <div class="flex flex-col pt-4">
      <SuperDebug data={{ $formData, $errors }} collapsible={true} theme="vscode" />
    </div>
  {/if}
</form>

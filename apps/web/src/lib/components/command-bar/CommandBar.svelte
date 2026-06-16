<script lang="ts">
import { toggleMode } from "mode-watcher"
import { goto } from "$app/navigation"
import Kbd from "$lib/components/KeyboardIndicator.svelte"
import * as Command from "$lib/components/ui/command"
import { useInterface } from "$lib/state/ui.svelte"
import { isEditableTarget } from "$lib/utils/keyboard"

function findNextItem(
  currentElement: Element | HTMLElement,
  direction: "k" | "j"
): HTMLElement | undefined {
  const directionMethod = direction === "k" ? "previousElementSibling" : "nextElementSibling"
  let nextElement = currentElement?.[directionMethod] as HTMLElement | undefined
  if (nextElement) {
    return nextElement
  }

  nextElement =
    currentElement.parentElement?.parentElement?.[directionMethod]?.[
      directionMethod
    ]?.querySelector("[data-cmdk-item]") ?? undefined

  if (nextElement) {
    return nextElement
  }
}

const ui = useInterface()
// @ts-expect-error element will always be assigned
let element: HTMLDialogElement = $state()
let value: string = $state("")

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.repeat || isEditableTarget(event.target)) {
    return
  }
  if ((event.ctrlKey || event.metaKey) && event.code === "KeyK") {
    value = ""
    event.preventDefault()
    element.showModal()
  }

  // Navigate up / down list of items
  if (
    ((event.ctrlKey || event.metaKey) && event.key === "j") ||
    ((event.ctrlKey || event.metaKey) && event.key === "k")
  ) {
    event.preventDefault()
    const currentElement = document.querySelector("[data-cmdk-item][data-selected]")
    if (!currentElement) {
      return
    }
    const nextElement = findNextItem(currentElement, event.key)

    if (nextElement) {
      currentElement?.removeAttribute("data-selected")
      currentElement?.removeAttribute("aria-selected")
      nextElement.setAttribute("data-selected", "true")
      nextElement.setAttribute("aria-selected", "true")
      nextElement.focus()
    }
  }
}

const navigateTo = async (path: string) => {
  element?.close()

  await new Promise((resolve) => setTimeout(resolve, 200))
  await goto(path)
}

const openQuickAdd = () => {
  element?.close()
  ui.toggleQuickAdd()
}

const toggleDarkMode = () => {
  toggleMode()
  element?.close()
}
</script>

<svelte:window onkeydown={handleKeyDown} />

<dialog bind:this={element} class="border-input z-20 rounded-md border shadow-lg">
  <Command.Root class="p-1" loop>
    <Command.Input
      bind:value
      class="text-base"
      type="command-input"
      placeholder="Type a command or search..."
    />
    <Command.List>
      <Command.Empty>No results found.</Command.Empty>
      <Command.Group heading="Actions">
        <Command.Item onSelect={toggleDarkMode} class="text-base">Toggle Dark Mode</Command.Item>
        <Command.Item onSelect={openQuickAdd} class="text-base">New Bookmark</Command.Item>
      </Command.Group>
      <Command.Separator />
      <Command.Group heading="Pages" class="text-base">
        <Command.Item onSelect={() => navigateTo("/")} class="flex justify-between text-base">
          Dashboard <Kbd class="text-xs" key="Shift + 1" />
        </Command.Item>
        <Command.Item
          onSelect={() => navigateTo("/bookmarks")}
          class="flex justify-between text-base"
        >
          Bookmarks <Kbd class="text-xs" key="Shift + 2" />
        </Command.Item>
        <Command.Item onSelect={() => navigateTo("/feeds")} class="flex justify-between text-base">
          Feeds <Kbd class="text-xs" key="Shift + 3" />
        </Command.Item>
        <Command.Item
          onSelect={() => navigateTo("/archives")}
          class="flex justify-between text-base"
        >
          Archive <Kbd class="text-xs" key="Shift + 4" />
        </Command.Item>
        <Command.Item
          onSelect={() => navigateTo("/categories")}
          class="flex justify-between text-base"
        >
          Categories <Kbd class="text-xs" key="Shift + 5" />
        </Command.Item>
        <Command.Item onSelect={() => navigateTo("/tags")} class="flex justify-between text-base">
          Tags <Kbd class="text-xs" key="Shift + 6" />
        </Command.Item>
        <Command.Item
          onSelect={() => navigateTo("/settings")}
          class="flex justify-between text-base"
        >
          Settings <Kbd class="text-xs" key="Shift + 7" />
        </Command.Item>
      </Command.Group>
    </Command.List>
  </Command.Root>
</dialog>

<style>
  :root {
    --duration: 0.3;
    --speed: calc(var(--duration) * 1s);
    --bounce-out: linear(
      0 0%,
      0.5583 3.72%,
      0.9549 7.72%,
      1.0968 9.86%,
      1.2039 12.13%,
      1.2783 14.57%,
      1.3213 17.23%,
      1.3317 18.7%,
      1.3345 20.27%,
      1.3296 21.97%,
      1.3171 23.83%,
      1.2806 27.25%,
      1.1551 36.58%,
      1.096 41.71%,
      1.0465 47.53%,
      1.014 53.68%,
      0.997 59.87%,
      0.9899 67.32%,
      1 100%
    );
    --easing: linear(
      0 0%,
      0.0027 3.64%,
      0.0106 7.29%,
      0.0425 14.58%,
      0.0957 21.87%,
      0.1701 29.16%,
      0.2477 35.19%,
      0.3401 41.23%,
      0.5982 55.18%,
      0.7044 61.56%,
      0.7987 68.28%,
      0.875 75%,
      0.9297 81.25%,
      0.9687 87.5%,
      0.9922 93.75%,
      1 100%
    );
  }
  dialog {
    --present: 0;
    --scale: 0.95;
    --blur: 10;
    --translate: 12;
    outline: none;
    view-transition-name: dialog;
    scale: calc(var(--scale) + ((1 - var(--scale)) * var(--present)));
    opacity: var(--present);
    filter: blur(calc((var(--blur) * (1 - var(--present))) * 1px));
    translate: 0 calc(calc(var(--translate) * 1lh) * (1 - var(--present)));
    width: 40ch;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.08),
      0px 1px 1px rgba(0, 0, 0, 0.02),
      0px 4px 8px -4px rgba(0, 0, 0, 0.04),
      0px 16px 24px -8px rgba(0, 0, 0, 0.06);
    transition:
      display var(--speed) var(--easing) allow-discrete,
      scale var(--speed) var(--easing),
      opacity var(--speed) var(--easing),
      filter var(--speed) var(--easing),
      translate calc(var(--speed) * calc(1 + var(--present))) var(--move, var(--easing));
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.08),
      0px 1px 1px rgba(0, 0, 0, 0.02),
      0px 4px 8px -4px rgba(0, 0, 0, 0.04),
      0px 16px 24px -8px rgba(0, 0, 0, 0.06);
  }

  dialog[open] {
    --present: 1;
    --move: var(--bounce-out);
  }
  @starting-style {
    dialog[open] {
      --present: 0;
    }
  }

  /* Backdrop */
  dialog::backdrop {
    --present: 0;
    z-index: 0;
    background-color: color-mix(in lch, canvas, transparent 80%);
    backdrop-filter: blur(4px);
    opacity: calc(var(--present) * 1);
    transition:
      overlay var(--speed) var(--easing) allow-discrete,
      opacity var(--speed) var(--easing);
  }
  dialog[open]::backdrop {
    --present: 1;
  }
  @starting-style {
    dialog[open]::backdrop {
      --present: 0;
    }
  }

  ::view-transition-new(dialog) {
    animation: reveal 1s;
    clip-path: inset(0 0 0 0);
    z-index: 2;
  }
  ::view-transition-old(dialog) {
    z-index: -1;
    animation: none;
  }

  @keyframes reveal {
    from {
      clip-path: inset(0 100% 0 0);
    }
  }
</style>

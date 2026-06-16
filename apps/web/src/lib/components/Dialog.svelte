<script lang="ts">
import type { Snippet } from "svelte"
import { cn } from "$lib/utils"

const ModalSize = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
} as const

interface Props {
  id: string
  children: Snippet
  element: HTMLDialogElement | undefined
  footer?: boolean
  class?: string
  header?: Snippet<[{ cancelAction: () => void }]>
  popoverState?: "auto" | "manual"
  confirmAction?: () => void
  cancelAction?: () => void
  confirmLabel?: Snippet
  cancelLabel?: Snippet
  size?: keyof typeof ModalSize
}

let {
  id,
  footer = true,
  element = $bindable(),
  confirmAction = () => null,
  cancelAction = () => element?.close(),
  class: className,
  children,
  header,
  confirmLabel,
  cancelLabel,
  size = ModalSize.md,
  ...rest
}: Props = $props()

const modalSizeWidths = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
}
</script>

<dialog
  {id}
  bind:this={element}
  class={cn(
    "bg-white rounded-lg shadow-xl border dark:bg-neutral-900",
    modalSizeWidths[size],
    className,
  )}
  {...rest}
>
  {#if header}
    <header class="px-2">
      {@render header({ cancelAction: () => element?.close() })}
    </header>
  {/if}
  <div class="flex flex-col gap-4 p-2">
    {@render children()}
  </div>
  {#if footer}
    <footer class="flex justify-end py-2 space-x-2">
      <button
        class="h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
        onclick={() => confirmAction()}
      >
        {#if confirmLabel}
          {@render confirmLabel()}
        {:else}
          Confirm
        {/if}
      </button>
      <button
        type="button"
        class="h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80"
        onclick={() => cancelAction()}
      >
        {#if cancelLabel}
          {@render cancelLabel()}
        {:else}
          Cancel
        {/if}
      </button>
    </footer>
  {/if}
</dialog>

<style>
  @reference "tailwindcss";

  :root {
    --duration: 0.2;
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
    --blur: 6;
    --translate: 6;
    position: fixed;
    inset: 0;
    margin: auto;
    outline: none;
    view-transition-name: dialog;
    scale: calc(var(--scale) + ((1 - var(--scale)) * var(--present)));
    opacity: var(--present);
    filter: blur(calc((var(--blur) * (1 - var(--present))) * 1px));
    translate: 0 calc(calc(var(--translate) * 1lh) * (1 - var(--present)));
    width: min(80ch, calc(100vw - 2rem));
    max-height: calc(100dvh - 2rem);
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.08),
      0px 1px 1px rgba(0, 0, 0, 0.02),
      0px 4px 8px -4px rgba(0, 0, 0, 0.04),
      0px 16px 24px -8px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    font-size: 14px;
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
    background-color: color-mix(in lch, #000000, transparent 60%);
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
</style>

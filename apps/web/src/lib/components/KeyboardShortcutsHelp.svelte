<script lang="ts">
import Dialog from "$lib/components/Dialog.svelte"
import Kbd from "$lib/components/KeyboardIndicator.svelte"

let { dialogElement = $bindable() }: { dialogElement: HTMLDialogElement | undefined } = $props()
</script>

<Dialog id="keyboard-shortcuts" size="2xl" footer={false} bind:element={dialogElement}>
  {#snippet header({ cancelAction })}
    <div class="flex justify-between">
      <h2 class="text-2xl font-bold">Keyboard Shortcuts</h2>
      <button
        aria-label="Cancel"
        class="flex justify-center items-center rounded-full transition outline-none hover:ring-2 focus:ring-2 ring-neutral-300 size-7 dark:ring-neutral-600"
        onclick={cancelAction}
      >
        <svg
          class="rounded-full size-5"
          data-slot="icon"
          fill="none"
          stroke-width="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  {/snippet}
  <table class="table-auto">
    <tbody class="*:h-10">
      <tr class="font-semibold">
        <td colspan="2">
          <div class="text-lg dark:text-neutral-100">Global</div>
        </td>
        <td colspan="2">
          <div class="text-lg dark:text-neutral-100">Navigation</div>
        </td>
      </tr>
      <tr>
        <td>Show Shortcut Help</td>
        <td><Kbd class="text-xs" key="Ctrl/Cmd + ?" /></td>
        <td>Navigate to Dashboard</td>
        <td><Kbd class="text-xs" key="Shift + 1" /></td>
      </tr>
      <tr>
        <td>Toggle Right Sidebar</td>
        <td><Kbd class="text-xs" key="]" /></td>
        <td>Navigate to Bookmarks</td>
        <td><Kbd class="text-xs" key="Shift + 2" /></td>
      </tr>
      <tr>
        <td>Toggle Left Sidebar</td>
        <td><Kbd class="text-xs" key="[" /></td>
        <td>Navigate to Feeds</td>
        <td><Kbd class="text-xs" key="Shift + 3" /></td>
      </tr>
      <tr>
        <td>Focus search input</td>
        <td><Kbd class="text-xs" key="/" /></td>
        <td>Navigate to Archives</td>
        <td><Kbd class="text-xs" key="Shift + 4" /></td>
      </tr>
      <tr>
        <td>Open "Quick Add" Dialog</td>
        <td><Kbd class="text-xs" key="Alt + N" /></td>
        <td>Navigate to Categories</td>
        <td><Kbd class="text-xs" key="Shift + 5" /></td>
      </tr>
      <tr>
        <td>Open Command Dialog</td>
        <td><Kbd class="text-xs" key="Ctrl/Cmd + K" /></td>
        <td>Navigate to Tags</td>
        <td><Kbd class="text-xs" key="Shift + 6" /></td>
      </tr>
      <tr>
        <td colspan="2" class="font-semibold">
          <div class="text-lg dark:text-neutral-100">Items Lists</div>
        </td>
        <td>Navigate to Settings</td>
        <td><Kbd class="text-xs" key="Shift + 7" /></td>
      </tr>
      <tr>
        <td>Focus element in list down</td>
        <td class="flex gap-2 items-stretch">
          <Kbd key="j" /> <span class="self-center text-xs">or</span>
          <Kbd>
            <div class="grid place-items-center h-full">
              <svg
                class="size-3"
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
                  d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                ></path>
              </svg>
            </div>
          </Kbd>
        </td>
      </tr>
      <tr>
        <td>Focus element in list up</td>
        <td class="flex gap-2 items-stretch">
          <Kbd key="k" /> <span class="self-center text-xs">or</span>
          <Kbd>
            <div class="grid place-items-center h-full">
              <svg
                class="size-3"
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
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                ></path>
              </svg>
            </div>
          </Kbd>
        </td>
      </tr>
      <tr>
        <td>Open original link</td>
        <td><Kbd key="o" /></td>
      </tr>
      <tr>
        <td>Toggle RSS article open to read</td>
        <td><Kbd key="&bsol;" /></td>
      </tr>
      <tr>
        <td>Toggle Mark as Unread</td>
        <td><Kbd key="u" /></td>
      </tr>
    </tbody>
  </table>
</Dialog>

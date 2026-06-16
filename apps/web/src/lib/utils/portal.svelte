<script lang="ts">
// https://github.com/stolinski/habit-path/blob/main/src/lib/Portal.svelte
import { tick } from "svelte"

export function portal(el: HTMLElement, target: string = "body") {
  let targetEl
  async function update(newTarget: string) {
    target = newTarget
    if (typeof target === "string") {
      targetEl = document.querySelector(target)
      if (targetEl === null) {
        await tick()
        targetEl = document.querySelector(target)
      }
      if (targetEl === null) {
        throw new Error(`No element found matching css selector: "${target}"`)
      }
    } else {
      throw new TypeError(
        `Unknown portal target type: ${
          target === null ? "null" : typeof target
        }. Allowed types: string (CSS selector).`
      )
    }
    targetEl.appendChild(el)
    el.hidden = false
  }
  function destroy() {
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
  update(target)
  return {
    update,
    destroy,
  }
}
export let target = "body"
</script>

<div use:portal={target} hidden>
  <slot />
</div>

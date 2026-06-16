export type Action<T = any> = (
  node: HTMLElement,
  parameters?: T
) => {
  update?: (parameters: T) => any | void
  destroy?: () => void
}

export function clipboard(node: HTMLElement, text: string | (() => string)): ReturnType<Action> {
  const click = async () => {
    const detailText = typeof text === "function" ? text() : text
    if (detailText) {
      try {
        await navigator.clipboard.writeText(detailText)
      } catch (e) {
        console.error("navigator.clipboard not supported")
      }
    }
  }

  node.addEventListener("click", click, true)

  return {
    update: (t: string | (() => string)) => (text = t),
    destroy: () => node.removeEventListener("click", click, true),
  }
}

export const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable || Boolean(target.closest('input, textarea, select, [role="textbox"]'))
  )
}

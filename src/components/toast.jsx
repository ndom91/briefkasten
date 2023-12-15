import { useToastDispatchContext } from "@/lib/toastContext"
import { toastTypes } from "@/lib/constants"
import { toastSuccess, toastError, toastWarning } from "@/components/toastElements"

export default function Toast({ type, title, body, id }) {
  const dispatch = useToastDispatchContext()

  switch (type) {
    case toastTypes.SUCCESS:
      return toastSuccess({ title, body, dispatch, id })
    case toastTypes.ERROR:
      return toastError({ title, body, dispatch, id })
    case toastTypes.WARNING:
      return toastWarning({ title, body, dispatch, id })
  }
}

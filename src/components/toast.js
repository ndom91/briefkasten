import { useToastDispatchContext } from '@/lib/toastContext'
import { toastTypes } from '@/lib/constants'
import {
  toastSuccess,
  toastError,
  toastWarning,
} from '@/components/toastElements'

export default function Toast({ type, title, body, id }) {
  const dispatch = useToastDispatchContext()
  let toastElement
  console.log('TOAST TYPE', type)
  switch (type) {
    case toastTypes.SUCCESS:
      toastElement = toastSuccess({ title, body, dispatch, id })
      break
    case toastTypes.ERROR:
      toastElement = toastError({ title, body, dispatch, id })
      break
    case toastTypes.WARNING:
      toastElement = toastWarning({ title, body, dispatch, id })
      break
  }

  return toastElement
}

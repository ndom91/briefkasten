// import crypto from 'crypto'
import { useToastDispatchContext } from '@/lib/toastContext'
export { toastTypes } from '@/lib/constants'

export function useToast(delay) {
  const dispatch = useToastDispatchContext()

  function toast(type, title, body = '') {
    const id = window.crypto.randomUUID()

    dispatch({
      type: 'ADD_TOAST',
      toast: {
        type,
        title,
        body,
        id,
      },
    })

    setTimeout(() => {
      dispatch({ type: 'DELETE_TOAST', id })
    }, delay)
  }

  return toast
}

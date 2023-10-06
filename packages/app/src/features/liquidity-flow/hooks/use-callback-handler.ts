import { useCallback, useRef } from 'react'

export function useCallbackHandler<T>() {
  const callbackRef = useRef<((value: T) => void) | undefined>(undefined)

  const setCallback = useCallback((cb: (value: T) => void) => {
    callbackRef.current = cb
  }, [])

  const clearCallback = useCallback(() => {
    callbackRef.current = undefined
  }, [])

  const runCallback = useCallback(
    (arg: T) => {
      if (callbackRef.current) {
        callbackRef.current(arg)
        clearCallback()
      }
    },
    [clearCallback],
  )

  return { setCallback, clearCallback, runCallback }
}

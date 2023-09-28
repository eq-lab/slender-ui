import React, { useCallback } from 'react'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { useFocus } from '@marginly/ui/components/input/use-focus'

const NUMBER_INPUT_REGEX = /^[0-9]+(?:\.[0-9]*)?$/

interface Props {
  onChange: (value: string) => void
  value: string
  title: string
  placeholder: string
  postfix?: string
  className?: string
  initFocus?: boolean
}

export function TokenSuperField({
  onChange,
  placeholder,
  postfix,
  title,
  value,
  className,
  initFocus,
}: Props) {
  const { focused, onClick, ref, setInputFocused } = useFocus()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const changedValue = event.target.value
    const isCorrectValue = (changedValue || '0').match(NUMBER_INPUT_REGEX)
    if (!isCorrectValue) return
    onChange(changedValue)
  }

  const refCallback = useCallback(
    (el: HTMLInputElement | null) => {
      ref.current = el
      if (initFocus) {
        el?.focus()
        setInputFocused(true)
      }
    },
    [initFocus, ref, setInputFocused],
  )

  return (
    <SuperField
      onChange={handleChange}
      placeholder={placeholder}
      postfix={postfix}
      title={title}
      value={value}
      className={className}
      onClick={onClick}
      ref={refCallback}
      focused={focused}
    />
  )
}

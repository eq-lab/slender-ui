import React, { useCallback } from 'react'
import SuperField from '@marginly/ui/components/input/super-field'
import { useFocus } from '@marginly/ui/components/input/use-focus'
import { FieldContainer } from '@marginly/ui/components/input/text.styled'
import { Suggestion } from '@marginly/ui/constants/classnames'
import Label from '@marginly/ui/components/label'
import { formatCompactCryptoCurrency } from '@/shared/formatters'

const NUMBER_INPUT_REGEX = /^[0-9]+(?:\.[0-9]*)?$/

interface Props {
  onChange: (value: string) => void
  value: string
  title: string
  className?: string
  initFocus?: boolean
  tokenSymbol?: string
  badgeValue?: string
  children?: React.ReactNode
}

export function TokenSuperField({
  onChange,
  title,
  value,
  className,
  initFocus,
  tokenSymbol,
  badgeValue,
  children,
}: Props) {
  const { focused, onClick, ref, setInputFocused } = useFocus()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const changedValue = event.target.value
    const changedModifiedValue = changedValue.startsWith('.') ? `0${changedValue}` : changedValue
    const isCorrectValue = (changedModifiedValue || '0').match(NUMBER_INPUT_REGEX)
    if (!isCorrectValue) return
    onChange(changedModifiedValue)
  }

  const refCallback = useCallback(
    (el: HTMLLabelElement | null) => {
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
      placeholder={`${tokenSymbol} amount`}
      postfix={tokenSymbol}
      title={title}
      value={value}
      className={className}
      onClick={onClick}
      ref={refCallback}
      focused={focused}
    >
      {children}
      {Number(badgeValue) && badgeValue ? (
        <FieldContainer className={Suggestion}>
          <Label badge onClick={() => onChange(badgeValue)}>
            Max {formatCompactCryptoCurrency(badgeValue)}
          </Label>
        </FieldContainer>
      ) : null}
    </SuperField>
  )
}

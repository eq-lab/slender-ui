import React from 'react'
import * as S from './styled'

interface Props {
  title: string
  children: React.ReactNode
  buttonProps: {
    onClick: () => void
    disabled?: boolean
    label: string
  }
  description?: string
}

export function FormLayout({ title, children, buttonProps, description }: Props) {
  return (
    <S.Wrapper>
      <S.Title>{title}</S.Title>
      <div>{children}</div>
      <S.BottomSection>
        <S.Button onClick={buttonProps.onClick} type="button" disabled={buttonProps.disabled}>
          {buttonProps.label}
        </S.Button>
        {description && <S.Description>{description}</S.Description>}
      </S.BottomSection>
    </S.Wrapper>
  )
}

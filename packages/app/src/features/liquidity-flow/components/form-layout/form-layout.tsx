import React from 'react'
import Typography from '@marginly/ui/components/typography'
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
      <Typography headerL>{title}</Typography>
      <S.Inner>{children}</S.Inner>
      <S.BottomSection>
        <S.Button onClick={buttonProps.onClick} type="button" disabled={buttonProps.disabled}>
          {buttonProps.label}
        </S.Button>
        {description && (
          <Typography caption secondary>
            {description}
          </Typography>
        )}
      </S.BottomSection>
    </S.Wrapper>
  )
}

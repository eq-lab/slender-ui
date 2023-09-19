import React from 'react'
import Typography from '@marginly/ui/components/typography'
import * as S from './styled'

interface Props {
  children: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

export function Button({ children, icon, disabled, onClick }: Props) {
  return (
    <S.Wrapper onClick={onClick} disabled={disabled}>
      {icon}
      <Typography action>{children}</Typography>
    </S.Wrapper>
  )
}

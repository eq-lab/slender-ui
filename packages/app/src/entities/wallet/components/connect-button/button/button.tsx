import React from 'react'
import Typography from '@marginly/ui/components/typography'
import cn from 'classnames'
import * as S from './styled'

interface Props {
  children: React.ReactNode
  icon?: React.ReactNode
  inactive?: boolean
  onClick?: () => void
}

export function Button({ children, icon, inactive, onClick }: Props) {
  return (
    <S.Wrapper onClick={onClick} className={cn(inactive && 'inactive')}>
      {icon}
      <Typography action>{children}</Typography>
    </S.Wrapper>
  )
}

import React from 'react'
import Typography from '@marginly/ui/components/typography'
import * as S from './styled'

interface Props {
  title?: string
  mediaSection: React.ReactNode
  children: React.ReactNode
}

export function InfoLayout({ title, mediaSection, children }: Props) {
  return (
    <S.Wrapper>
      <Typography headerS>{title}</Typography>
      {mediaSection}
      <S.List>{children}</S.List>
    </S.Wrapper>
  )
}

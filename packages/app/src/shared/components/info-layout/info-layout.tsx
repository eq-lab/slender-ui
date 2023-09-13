import React from 'react'
import * as S from './styled'

interface Props {
  title?: string
  mediaSection: React.ReactNode
  children: React.ReactNode
}

export function InfoLayout({ title, mediaSection, children }: Props) {
  return (
    <S.Wrapper>
      <S.Title>{title}</S.Title>
      {mediaSection}
      <S.List>{children}</S.List>
    </S.Wrapper>
  )
}

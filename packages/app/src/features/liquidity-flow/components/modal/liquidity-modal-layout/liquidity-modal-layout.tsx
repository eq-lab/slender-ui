import React from 'react'
import * as S from './styled'

interface Props {
  infoSlot?: React.ReactNode
  children?: React.ReactNode
}

export function LiquidityModalLayout({ children, infoSlot }: Props) {
  return (
    <S.Wrapper>
      <S.Inner>{children}</S.Inner>
      {infoSlot && <S.Inner>{infoSlot}</S.Inner>}
    </S.Wrapper>
  )
}

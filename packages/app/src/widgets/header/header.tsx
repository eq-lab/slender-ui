import React from 'react'
import * as S from './styled'
import { ConnectButton } from '../../entities/wallet/components/connect-button'

export function Header() {
  return (
    <S.Wrapper>
      <S.SlenderLogo />
      <S.ConnectButtonWrapper>
        <ConnectButton />
      </S.ConnectButtonWrapper>
    </S.Wrapper>
  )
}

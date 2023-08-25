import React from 'react'
import * as S from './styled'
import { ConnectButton } from '../../entities/wallet/components/connect-button'

export function Header() {
  return (
    <S.Wrapper>
      <div>Slender</div>
      {/* @ts-expect-error Server Component */}
      <ConnectButton />
    </S.Wrapper>
  )
}
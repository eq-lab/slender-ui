import React from 'react'
import { ReactComponent as SlenderLogo } from '@/shared/icons/logo/slender.svg'
import { ConnectButton } from '@/entities/wallet/components/connect-button'
import * as S from './styled'

export function Header() {
  return (
    <S.Wrapper>
      <S.Inner>
        <SlenderLogo width={110} />
        <ConnectButton />
      </S.Inner>
    </S.Wrapper>
  )
}

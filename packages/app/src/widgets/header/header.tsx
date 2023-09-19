import React from 'react'
import { ReactComponent as SlenderLogo } from '@/shared/icons/logo/slender.svg'
import * as S from './styled'
import { ConnectButton } from '../../entities/wallet/components/connect-button'

export function Header() {
  return (
    <S.Wrapper>
      <SlenderLogo width={110} />
      <ConnectButton />
    </S.Wrapper>
  )
}

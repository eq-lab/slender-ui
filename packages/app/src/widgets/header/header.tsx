import React from 'react';
import { ReactComponent as SlenderLogo } from '@/shared/icons/logo/slender.svg';
import { ConnectButton } from '@/entities/wallet/components/connect-button';
import { networks } from '@bindings/pool';
import * as S from './styled';

export function Header() {
  return (
    <S.Wrapper>
      <S.Inner>
        <SlenderLogo width={110} />
        {networks.testnet.contractId && (
          <S.Label sm negative>
            Testnet
          </S.Label>
        )}
        <ConnectButton />
      </S.Inner>
    </S.Wrapper>
  );
}

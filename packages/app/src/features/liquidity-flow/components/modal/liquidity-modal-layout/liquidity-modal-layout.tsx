import React from 'react';
import * as S from './styled';

interface Props {
  infoSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function LiquidityModalLayout({ children, infoSlot, className }: Props) {
  return (
    <S.Wrapper className={className}>
      <S.Inner>{children}</S.Inner>
      {infoSlot && <S.Inner>{infoSlot}</S.Inner>}
    </S.Wrapper>
  );
}

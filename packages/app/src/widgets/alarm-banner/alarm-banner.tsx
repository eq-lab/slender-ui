import React from 'react';
import Typography from '@marginly/ui/components/typography';
import { ReactComponent as AlertIcon } from '@/shared/icons/alert.svg';
import * as S from './styled';

export function AlarmBanner() {
  return (
    <S.Wrapper alert md>
      <AlertIcon />
      <Typography>
        Our smart contracts are undergoing a security audit now. You are using Slender at your own
        risk.
      </Typography>
    </S.Wrapper>
  );
}

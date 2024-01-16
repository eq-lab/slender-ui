import React, { MouseEvent } from 'react';
import { ReactComponent as PlusIcon } from '@/shared/icons/plus.svg';
import Typography from '@marginly/ui/components/typography';
import * as S from './styled';

interface Props {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export function AddAssetButton({ onClick }: Props) {
  return (
    <S.Wrapper onClick={onClick}>
      <S.Thumbnail rectangle md>
        <PlusIcon width={24} />
      </S.Thumbnail>
      <Typography secondary>Add Asset</Typography>
    </S.Wrapper>
  );
}

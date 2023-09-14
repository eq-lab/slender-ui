import React from 'react'
import { ReactComponent as PlusIcon } from '@/shared/icons/plus.svg'
import * as S from './styled'

interface Props {
  onClick: () => void
}

export function AddAssetButton({ onClick }: Props) {
  return (
    <S.Wrapper onClick={onClick}>
      <S.Button>
        <PlusIcon />
      </S.Button>
      Add Asset
    </S.Wrapper>
  )
}

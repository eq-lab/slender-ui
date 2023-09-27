import React, { MouseEvent } from 'react'
import { ReactComponent as PlusIcon } from '@/shared/icons/plus.svg'
import Button from '@marginly/ui/components/button'
import * as S from './styled'

interface Props {
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

export function AddAssetButton({ onClick }: Props) {
  return (
    <S.Wrapper onClick={onClick}>
      <Button md icon secondary>
        <PlusIcon width={24} />
      </Button>
      Add Asset
    </S.Wrapper>
  )
}

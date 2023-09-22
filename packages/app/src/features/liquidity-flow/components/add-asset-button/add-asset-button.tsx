import React, { MouseEventHandler } from 'react'
import { ReactComponent as PlusIcon } from '@/shared/icons/plus.svg'
import Thumbnail from '@marginly/ui/components/thumbnail'
import * as S from './styled'

interface Props {
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function AddAssetButton({ onClick }: Props) {
  return (
    <S.Wrapper onClick={onClick}>
      <Thumbnail md rectangle darkbg>
        <PlusIcon width={24} />
      </Thumbnail>
      Add Asset
    </S.Wrapper>
  )
}

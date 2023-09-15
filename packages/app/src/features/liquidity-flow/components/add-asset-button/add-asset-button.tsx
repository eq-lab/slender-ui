import React from 'react'
import { ReactComponent as PlusIcon } from '@/shared/icons/plus.svg'
import { ThumbnailWrapper } from '@marginly/ui/components/thumbnail/thumbnail.styled'
import * as uiClassNames from '@marginly/ui/constants/classnames'
import cn from 'classnames'
import * as S from './styled'

interface Props {
  onClick: () => void
}

export function AddAssetButton({ onClick }: Props) {
  return (
    <S.Wrapper onClick={onClick}>
      <ThumbnailWrapper className={cn(uiClassNames.M, uiClassNames.Rectangle)}>
        <PlusIcon width={24} />
      </ThumbnailWrapper>
      Add Asset
    </S.Wrapper>
  )
}

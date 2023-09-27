import React from 'react'
import Typography from '@marginly/ui/components/typography'
import Thumbnail from '@marginly/ui/components/thumbnail'
import { ReactComponent as PlusIcon } from '@/shared/icons/plus.svg'
import * as S from './more-button.styled'

export function MoreButton({
  upperText,
  bottomText,
  onClick,
}: {
  upperText: string
  bottomText: string
  onClick: () => void
}) {
  return (
    <S.MoreButtonWrapper onClick={onClick}>
      <Thumbnail rectangle md className="plus-button">
        <PlusIcon />
      </Thumbnail>
      <Typography className="upper-text" secondary>
        {upperText}
      </Typography>
      <Typography caption secondary className="bottom-text">
        {bottomText}
      </Typography>
    </S.MoreButtonWrapper>
  )
}

import React from 'react'
import Typography from '@marginly/ui/components/typography'
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
    <S.MoreButtonWrapper>
      <button type="button" className="plus-button" onClick={onClick}>
        +
      </button>
      <Typography className="upper-text" secondary>
        {upperText}
      </Typography>
      <Typography caption secondary className="bottom-text">
        {bottomText}
      </Typography>
    </S.MoreButtonWrapper>
  )
}

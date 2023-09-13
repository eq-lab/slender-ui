import React from 'react'
import * as S from './styled'

interface Props {
  onClose: () => void
  children: React.ReactNode
  infoSlot: React.ReactNode
}

export function ModalLayout({ onClose, children, infoSlot }: Props) {
  return (
    <S.Dialog open onClose={onClose} maxWidth="md">
      <S.Inner>
        <div>{children}</div>
        <div>{infoSlot}</div>
      </S.Inner>
    </S.Dialog>
  )
}

import React from 'react'
import * as S from './styled'

interface Props {
  onClose: () => void
  children: React.ReactNode
  infoSlot?: React.ReactNode
  clean?: boolean
}

export function ModalLayout({ onClose, children, infoSlot, clean = false }: Props) {
  return (
    <S.Dialog open onClose={onClose} maxWidth={clean ? undefined : 'md'} $clean={clean}>
      <S.Inner $clean={clean}>
        <div>{children}</div>
        {infoSlot && <div>{infoSlot}</div>}
      </S.Inner>
    </S.Dialog>
  )
}

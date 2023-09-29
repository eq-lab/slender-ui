import React from 'react'
import { ReactComponent as CrossIcon } from './cross.svg'
import { ReactComponent as ArrowLeft } from './arrow-left.svg'
import * as S from './styled'

interface Props {
  onClose: () => void
  onBack?: () => void
  children: React.ReactNode
  infoSlot?: React.ReactNode
  clean?: boolean
}

export function ModalLayout({ onClose, onBack, children, infoSlot, clean = false }: Props) {
  return (
    <S.Dialog open onClose={onClose} maxWidth={clean ? undefined : 'md'} $clean={clean}>
      <S.Inner $clean={clean}>
        <div>{children}</div>
        {infoSlot && <div>{infoSlot}</div>}
      </S.Inner>
      <S.CloseButton sm tertiary onClick={onClose}>
        <CrossIcon />
      </S.CloseButton>
      {onBack && (
        <S.BackButton sm tertiary onClick={onBack}>
          <ArrowLeft />
        </S.BackButton>
      )}
    </S.Dialog>
  )
}

import React from 'react'
import * as S from './styled'

interface Props {
  onClose: () => void
  onPrev?: () => void
  children: React.ReactNode
  infoSlot: React.ReactNode
}

export function ModalLayout({ onClose, onPrev, children, infoSlot }: Props) {
  return (
    <div>
      {onPrev && (
        <button type="button" onClick={onPrev}>
          prev
        </button>
      )}
      <button type="button" onClick={onClose}>
        close
      </button>
      <S.Inner>
        <div>{children}</div>
        <div>{infoSlot}</div>
      </S.Inner>
    </div>
  )
}

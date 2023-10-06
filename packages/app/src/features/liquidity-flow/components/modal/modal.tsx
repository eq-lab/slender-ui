import React from 'react'
import { DialogProps } from '@mui/material/Dialog'
import { ReactComponent as CrossIcon } from './cross.svg'
import { ReactComponent as ArrowLeft } from './arrow-left.svg'
import * as S from './styled'

interface Props extends DialogProps {
  onBack?: () => void
  children?: React.ReactNode
  onClose: () => void
}

export function Modal({ children, onBack, onClose, ...muiProps }: Props) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <S.Dialog {...muiProps} onClose={onClose}>
      {children}
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

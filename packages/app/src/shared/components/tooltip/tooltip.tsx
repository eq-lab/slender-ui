import React, { ReactElement } from 'react'
import TooltipUi from '@mui/material/Tooltip'
import * as S from './styled'

export function Tooltip({ children, content }: { children: ReactElement; content: ReactElement }) {
  return (
    <S.GeneratePopperClassName>
      {(popperClassName) => (
        <TooltipUi title={content} arrow classes={{ popper: popperClassName }}>
          {children}
        </TooltipUi>
      )}
    </S.GeneratePopperClassName>
  )
}

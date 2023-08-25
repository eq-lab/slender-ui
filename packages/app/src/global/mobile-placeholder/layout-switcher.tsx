import React from 'react'
import { LayoutSwitcherStyled } from './styled'

interface Props {
  mobile: React.ReactNode
  desktop: React.ReactNode
}

export function LayoutSwitcher({ desktop, mobile }: Props) {
  return (
    <LayoutSwitcherStyled>
      <div className="desktop">{desktop}</div>
      <div className="mobile">{mobile}</div>
    </LayoutSwitcherStyled>
  )
}

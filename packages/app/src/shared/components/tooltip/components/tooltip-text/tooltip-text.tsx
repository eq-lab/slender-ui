import React from 'react'
import { TooltipTypography } from './styled'

export function TooltipText({ children }: { children: React.ReactNode }) {
  return <TooltipTypography caption>{children}</TooltipTypography>
}

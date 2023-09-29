import React, { ReactElement } from 'react'
import TooltipUi from '@mui/material/Tooltip'

export function Tooltip({ children, content }: { children: ReactElement; content: ReactElement }) {
  return (
    <TooltipUi
      title={content}
      arrow
      componentsProps={{
        tooltip: { sx: { padding: '12px', borderRadius: '12px', backgroundColor: '#000' } },
        arrow: { sx: { color: '#000' } },
      }}
    >
      {children}
    </TooltipUi>
  )
}

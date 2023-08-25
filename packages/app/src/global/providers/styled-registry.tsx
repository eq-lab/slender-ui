'use client'

import { useServerInsertedHTML } from 'next/navigation'
import React from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [stylesheet] = React.useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = stylesheet.getStyleElement()
    stylesheet.instance.clearTag()
    return styles
  })

  if (typeof window !== 'undefined') return children

  return <StyleSheetManager sheet={stylesheet.instance}>{children}</StyleSheetManager>
}

import React from 'react'
import '@/global/globals.css'
import type { Metadata } from 'next'
import { GlobalStyle } from '@/global/styles'
import { StyledComponentsRegistry } from '@/global/styled-registry'

export const metadata: Metadata = {
  title: 'Slender',
  description: 'Lend & borrow fat stakes at a fair interest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <html lang="en">
        <head>
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
          <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        </head>
        <GlobalStyle />
        <body>{children}</body>
      </html>
    </StyledComponentsRegistry>
  )
}

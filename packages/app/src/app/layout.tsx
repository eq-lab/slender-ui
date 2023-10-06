import type { Metadata } from 'next'
import React from 'react'
import { Providers } from '@/global/providers'
import { MobilePlaceholder } from '@/global/mobile-placeholder/mobile-placeholder'
import { LayoutSwitcher } from '@/global/mobile-placeholder/layout-switcher'
import '@marginly/ui/styles/theme.css'
import { GlobalStyle } from '@/global/styles'

export const metadata: Metadata = {
  title: 'Slender',
  description: 'Lend & borrow fat stakes at a fair interest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
          <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        </head>
        <body>
          <GlobalStyle />
          <LayoutSwitcher desktop={children} mobile={<MobilePlaceholder />} />
        </body>
      </html>
    </Providers>
  )
}

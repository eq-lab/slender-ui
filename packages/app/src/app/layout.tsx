import type { Metadata } from 'next'
import React from 'react'
import { Providers } from '@/global/providers'
import { MobilePlaceholder } from '@/global/mobile-placeholder/mobile-placeholder'
import { LayoutSwitcher } from '@/global/mobile-placeholder/layout-switcher'
import '@marginly/ui/styles/theme.css'
import { GlobalStyle } from '@/global/styles'

export const metadata: Metadata = {
  title: 'Slender',
  description: 'Lend & borrow fat stakes at a fairer interest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body>
          <GlobalStyle />
          <LayoutSwitcher desktop={children} mobile={<MobilePlaceholder />} />
        </body>
      </html>
    </Providers>
  )
}

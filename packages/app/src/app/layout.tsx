import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import { Providers } from '@/global/providers'
import { MobilePlaceholder } from '@/global/mobile-placeholder/mobile-placeholder'
import { LayoutSwitcher } from '@/global/mobile-placeholder/layout-switcher'
import { GlobalStyle } from '@/global/styles'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Slender',
  description: 'Lend & borrow fat stakes at a fairer interest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <GlobalStyle />
          <LayoutSwitcher desktop={children} mobile={<MobilePlaceholder />} />
        </body>
      </html>
    </Providers>
  )
}

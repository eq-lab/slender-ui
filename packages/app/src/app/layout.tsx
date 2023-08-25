import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import { MobilePlaceholder } from '@/global/mobile-placeholder/mobile-placeholder'
import { LayoutSwitcher } from '@/global/mobile-placeholder/layout-switcher'
import { GlobalStyle } from '@/global/styles'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Slender',
  description: 'Lend & borrow fat stakes at a fairer interest with no liquidations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <GlobalStyle />
      <body className={inter.className}>
        <LayoutSwitcher desktop={children} mobile={<MobilePlaceholder />} />
      </body>
    </html>
  )
}

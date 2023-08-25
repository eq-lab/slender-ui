import '@/global/globals.css'
import type { Metadata } from 'next'
import { GlobalStyle } from '@/global/styles'

export const metadata: Metadata = {
  title: 'Slender',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <GlobalStyle />
      <body>{children}</body>
    </html>
  )
}

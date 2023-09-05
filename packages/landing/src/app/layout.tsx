import '@/global/globals.css'
import type { Metadata } from 'next'
import { GlobalStyle } from '@/global/styles'
import { StyledComponentsRegistry } from '@/global/styled-registry'

export const metadata: Metadata = {
  title: 'Slender',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <html lang="en">
        <GlobalStyle />
        <body>{children}</body>
      </html>
    </StyledComponentsRegistry>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../global/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Slender',
  description: 'Lend & borrow fat stakes at a fairer interest with no liquidations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  )
}

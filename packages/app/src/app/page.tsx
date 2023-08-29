import React from 'react'
import '@marginly/ui/styles/reset.css'
import { Header } from '@/widgets/header'
import { Balances } from '@/widgets/balances'

export default function Home() {
  return (
    <main>
      <Header />
      <Balances />
    </main>
  )
}

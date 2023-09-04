import React from 'react'
import '@marginly/ui/styles/reset.css'
import { Header } from '@/widgets/header'
import { Balances } from '@/widgets/balances'
import { MarketSection } from '@/widgets/market-section'
import { PositionSection } from '@/widgets/position-section/position-section'

export default function Home() {
  return (
    <main>
      <Header />
      <Balances />
      <PositionSection />
      <MarketSection />
    </main>
  )
}

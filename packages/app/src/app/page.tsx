import React from 'react'
import '@marginly/ui/styles/reset.css'
import { Header } from '@/widgets/header'
import { MarketSection } from '@/widgets/market-section'
import { PositionSection } from '@/widgets/position-section/position-section'
import { VersionAlert } from '@slender/shared/components/version-alert'

export default function Home() {
  return (
    <main>
      <VersionAlert />
      <Header />
      <PositionSection />
      <MarketSection />
    </main>
  )
}

'use client'

import React from 'react'
import '@marginly/ui/styles/reset.css'
import { Header } from '@/widgets/header'
import { MarketSection } from '@/widgets/market-section'
import { PositionSection } from '@/widgets/position-section/position-section'
import { VersionAlert } from '@slender/shared/components/version-alert'
import { PageWrapper } from './styled'

export default function Home() {
  return (
    <PageWrapper>
      <VersionAlert />
      <Header />
      <PositionSection />
      <MarketSection />
    </PageWrapper>
  )
}

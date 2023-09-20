'use client'

import React from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import '@marginly/ui/styles/reset.css'
import { Header } from '@/widgets/header'
import { MarketSection } from '@/widgets/market-section'
import { PositionSection } from '@/widgets/position-section/position-section'
import { VersionAlert } from '@slender/shared/components/version-alert'
import { WaitModal } from '@/features/liquidity-flow/components/wait-modal'
import { PageWrapper } from './styled'

export default function Home() {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const havePositions = !!position?.deposits.length || !!position?.debts.length

  return (
    <PageWrapper>
      <VersionAlert />
      <WaitModal />
      <Header />
      {havePositions && <PositionSection />}
      <MarketSection />
    </PageWrapper>
  )
}

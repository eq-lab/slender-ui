'use client'

import { MarketCard } from '@/widgets/market-section/components/market-card'
import { tokens } from '@/shared/stellar-constants/tokens'

export function MarketSection() {
  return (
    <>
      <MarketCard token={tokens.usdc} />
      <MarketCard token={tokens.xlm} />
      <MarketCard token={tokens.xrp} />
    </>
  )
}

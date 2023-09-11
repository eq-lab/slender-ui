'use client'

import { MarketCard } from '@/widgets/market-section/components/market-card'
import { SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'

export function MarketSection() {
  return (
    <div style={{ fontSize: '20px', margin: '1em 2em' }}>
      <h2>Market</h2>
      {SUPPORTED_TOKENS.map((tokenName) => (
        <MarketCard key={tokenName} tokenName={tokenName} />
      ))}
    </div>
  )
}

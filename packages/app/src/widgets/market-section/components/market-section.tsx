'use client'

import { MarketCard } from '@/widgets/market-section/components/market-card'
import { SUPPORTED_TOKENS, tokens } from '@/shared/stellar/constants/tokens'
import { BorrowFirstPositionFlow } from '@/features/borrow-flow/components/borrow-first-position-flow'
import { LendFirstPositionFlow } from '@/features/borrow-flow/components/lend-first-position-flow'
import { useContextSelector } from 'use-context-selector'
import { PositionContext } from '@/entities/position/context/context'

export function MarketSection() {
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)

  return (
    <div style={{ fontSize: '20px', margin: '1em 2em' }}>
      <h2>Market</h2>
      {SUPPORTED_TOKENS.map((tokenName) => (
        <MarketCard
          key={tokenName}
          token={tokens[tokenName]}
          renderLendButton={(text) => (
            <LendFirstPositionFlow
              token={tokenName}
              buttonText={`+${text} Lend`}
              onSend={setPosition}
            />
          )}
          renderBorrowButton={(text) => (
            <BorrowFirstPositionFlow
              token={tokenName}
              buttonText={`-${text} Borrow`}
              onSend={setPosition}
            />
          )}
        />
      ))}
    </div>
  )
}

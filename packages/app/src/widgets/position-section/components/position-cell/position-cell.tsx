'use client'

import React from 'react'
import { tokenContracts } from '@/shared/stellar/constants/tokens'
import { PositionCell as PositionCellType } from '@/entities/position/types'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { formatUsd } from '@/features/borrow-flow/formatters'
import { useTokenCache } from '@/entities/token/context/hooks'

export function PositionCell({
  position,
  persentage,
  openDecreaseModal,
  openIncreaseModal,
  isLendPosition,
}: {
  position: PositionCellType
  persentage?: number
  openDecreaseModal: () => void
  openIncreaseModal: () => void
  isLendPosition?: boolean
}) {
  const { token, value, valueInUsd } = position

  const { lendInterestRate, borrowInterestRate, discount } = useMarketDataForDisplay(
    tokenContracts[token],
  )
  const tokenCache = useTokenCache()?.[tokenContracts[token].address]

  return (
    <div key={token}>
      <em>
        {tokenCache?.name}
        {persentage && persentage !== 100 ? ` - ${persentage}%` : null}
      </em>
      <br />
      {value} {token.toUpperCase()}{' '}
      {isLendPosition && (
        <div>
          <em>{discount}% discount</em>
        </div>
      )}
      {borrowInterestRate && <div>{isLendPosition ? lendInterestRate : borrowInterestRate}</div>}
      {valueInUsd && value !== valueInUsd && <div>{formatUsd(valueInUsd)}</div>}
      <button type="button" onClick={openDecreaseModal}>
        -
      </button>
      <button type="button" onClick={openIncreaseModal}>
        +
      </button>
    </div>
  )
}

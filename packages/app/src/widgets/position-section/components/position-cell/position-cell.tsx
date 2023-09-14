import React from 'react'
import { tokenContracts } from '@/shared/stellar/constants/tokens'
import { PositionCell as PositionCellType } from '@/entities/position/types'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { formatUsd } from '@/shared/formatters'
import { useTokenCache } from '@/entities/token/context/hooks'

export function PositionCell({
  position,
  percentage,
  openDecreaseModal,
  openIncreaseModal,
  isLendPosition,
}: {
  position: PositionCellType
  percentage?: number
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
        {percentage && percentage !== 100 ? `: ${percentage}%` : null}
      </em>
      <br />
      {value.toString(10)} {tokenCache?.symbol}{' '}
      {isLendPosition && (
        <div>
          <em>{discount} discount</em>
        </div>
      )}
      {borrowInterestRate && <div>{isLendPosition ? lendInterestRate : borrowInterestRate}</div>}
      {valueInUsd && Number(value) !== valueInUsd && <div>{formatUsd(valueInUsd)}</div>}
      <button type="button" onClick={openDecreaseModal}>
        &minus;
      </button>
      <button type="button" onClick={openIncreaseModal}>
        +
      </button>
    </div>
  )
}

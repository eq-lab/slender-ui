import React from 'react'
import { formatUsd } from '../../formatters'

interface Props {
  health: number
  healthDelta: number
  debtUsdDelta: number
  actualDebtUsd: number
  collateralSumUsd: number
  borrowCapacityError?: boolean
  debtError?: boolean
  borrowCapacityInterface: number
  borrowCapacityDelta: number
}

export function PositionSummary({
  health,
  healthDelta,
  debtUsdDelta,
  actualDebtUsd,
  collateralSumUsd,
  borrowCapacityError,
  borrowCapacityInterface,
  borrowCapacityDelta,
  debtError,
}: Props) {
  return (
    <div>
      <h4>Position summary</h4>
      <div>
        {health}% ({healthDelta}%)
      </div>
      <div style={{ color: debtError ? 'red' : '' }}>
        Debt {formatUsd(actualDebtUsd)} ({formatUsd(debtUsdDelta)})
      </div>
      <div>Collateral {formatUsd(collateralSumUsd)}</div>
      <div style={{ color: borrowCapacityError ? 'red' : '' }}>
        Borrow capacity {formatUsd(borrowCapacityInterface)} ({formatUsd(borrowCapacityDelta)})
      </div>
    </div>
  )
}

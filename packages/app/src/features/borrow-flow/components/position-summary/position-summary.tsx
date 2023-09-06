import React from 'react'
import { formatUsd } from '../../formatters'

interface Props {
  health: number
  healthDelta?: number
  debtUsd: number
  debtUsdDelta?: number
  stakeSumUsd: number
  stakeSumUsdDelta?: number
  borrowCapacityError?: boolean
  debtError?: boolean
  borrowCapacity: number
  borrowCapacityDelta?: number
}

export function PositionSummary({
  health,
  healthDelta,
  debtUsdDelta,
  debtUsd,
  stakeSumUsd,
  borrowCapacityError,
  borrowCapacity,
  borrowCapacityDelta,
  stakeSumUsdDelta,
  debtError,
}: Props) {
  return (
    <div>
      <h4>Position summary</h4>
      <div>
        {health}% {healthDelta ? `(${healthDelta}%)` : ''}
      </div>
      <div style={{ color: debtError ? 'red' : '' }}>
        Debt {formatUsd(debtUsd)} {debtUsdDelta ? `(${formatUsd(debtUsdDelta)})` : ''}
      </div>
      <div>
        Collateral {formatUsd(stakeSumUsd)}{' '}
        {stakeSumUsdDelta ? `(${formatUsd(stakeSumUsdDelta)})` : ''}
      </div>
      <div style={{ color: borrowCapacityError ? 'red' : '' }}>
        Borrow capacity {formatUsd(borrowCapacity)}{' '}
        {borrowCapacityDelta ? `(${formatUsd(borrowCapacityDelta)})` : ''}
      </div>
    </div>
  )
}

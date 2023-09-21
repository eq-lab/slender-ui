import React from 'react'
import { InfoRow } from '@/shared/components/info-row'
import { InfoLayout } from '@/shared/components/info-layout'
import { formatUsd } from '@/shared/formatters'

const getSubValue = (value?: number) => {
  if (!value) return undefined
  if (value < 0) return formatUsd(value)
  return `+${formatUsd(value)}`
}

interface Props {
  health: number
  healthDelta?: number
  debtUsd: number
  debtUsdDelta?: number
  depositSumUsd: number
  depositSumUsdDelta?: number
  borrowCapacityError?: boolean
  debtError?: boolean
  borrowCapacity: number
  borrowCapacityDelta?: number
  collateralError?: boolean
}

export function PositionSummary({
  health,
  healthDelta,
  debtUsdDelta,
  debtUsd,
  depositSumUsd,
  borrowCapacityError,
  borrowCapacity,
  borrowCapacityDelta,
  depositSumUsdDelta,
  debtError,
  collateralError,
}: Props) {
  return (
    <InfoLayout
      title="Position summary"
      mediaSection={
        <div>
          {health}% {healthDelta ? `(${healthDelta}%)` : ''}
        </div>
      }
    >
      <InfoRow
        label="Debt"
        value={formatUsd(debtUsd)}
        subValue={getSubValue(debtUsdDelta)}
        error={debtError}
      />
      <InfoRow
        label="Collateral"
        value={formatUsd(depositSumUsd)}
        subValue={getSubValue(depositSumUsdDelta)}
        error={collateralError}
      />
      <InfoRow
        label="Borrow capacity"
        value={formatUsd(borrowCapacity)}
        subValue={getSubValue(borrowCapacityDelta)}
        error={borrowCapacityError}
      />
    </InfoLayout>
  )
}

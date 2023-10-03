import React from 'react'
import { HealthMeter } from '@/shared/components/health-meter'
import { InfoRow } from '@/shared/components/info-row'
import { InfoLayout } from '@/shared/components/info-layout'
import { formatCompactUsd } from '@/shared/formatters'

const getSubValue = (value?: number) => {
  if (!value) return undefined
  if (value < 0) return formatCompactUsd(value)
  return `+${formatCompactUsd(value)}`
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
      mediaSection={<HealthMeter healthPercent={health} healthDelta={healthDelta} />}
    >
      <InfoRow
        label="Debt"
        value={formatCompactUsd(debtUsd)}
        subValue={getSubValue(debtUsdDelta)}
        error={debtError}
      />
      <InfoRow
        label="Collateral"
        value={formatCompactUsd(depositSumUsd)}
        subValue={getSubValue(depositSumUsdDelta)}
        error={collateralError}
      />
      <InfoRow
        label="Borrow capacity"
        value={formatCompactUsd(borrowCapacity)}
        subValue={getSubValue(borrowCapacityDelta)}
        error={borrowCapacityError}
      />
    </InfoLayout>
  )
}

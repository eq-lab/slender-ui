import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'

import { PositionCell } from '@/entities/position/types'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { useTokenInfo } from '../../hooks/use-token-info'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils'

interface Props {
  deposit: number
  depositSumUsd: number
  onClose: () => void
  token: SupportedToken
  onSend: (value: PositionCell) => void
  debtSumUsd: number
}

export function LendDecreaseModal({
  depositSumUsd,
  deposit,
  onClose,
  token,
  onSend,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('')

  const depositTokenInfo = useTokenInfo(token)

  const actualDepositUsd = Math.max(
    depositSumUsd - Number(value) * depositTokenInfo.priceInUsd * depositTokenInfo.discount,
    0,
  )

  const {
    borrowCapacityDelta,
    borrowCapacityInterface,
    borrowCapacityError,
    defaultBorrowCapacity,
    health,
    healthDelta,
  } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDebtUsd: debtSumUsd,
    debtUsd: debtSumUsd,
    actualDepositUsd,
  })

  const borrowTokenInfo = useTokenInfo(token)

  const max = Math.floor(
    defaultBorrowCapacity / (borrowTokenInfo.priceInUsd * borrowTokenInfo.discount),
  )

  const depositDelta = deposit - Number(value)
  const depositError = depositDelta < 0

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={debtSumUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={actualDepositUsd}
          borrowCapacityError={borrowCapacityError}
          health={health}
          healthDelta={healthDelta}
          depositSumUsdDelta={actualDepositUsd - depositSumUsd}
        />
      }
      onClose={onClose}
    >
      <h3>Withdraw collateral</h3>
      <input onChange={(e) => setValue(e.target.value)} type="number" value={value} />
      <button type="button" onClick={() => setValue(String(max))}>
        max {max}
      </button>
      <div>
        <button
          onClick={() => onSend({ value: Number(value), token })}
          type="button"
          disabled={depositError || borrowCapacityError}
        >
          pay off {value} {token}
        </button>
      </div>
    </ModalLayout>
  )
}

import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'

import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { PositionCell } from '@/entities/position/types'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils'
import { PositionSummary } from '../position-summary'

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

  const actualDepositUsd = Math.max(
    depositSumUsd -
      Number(value) * mockTokenInfoByType[token].usd * mockTokenInfoByType[token].discount,
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

  const max = Math.floor(
    defaultBorrowCapacity / (mockTokenInfoByType[token].usd * mockTokenInfoByType[token].discount),
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

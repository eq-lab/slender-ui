import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'

import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { PositionCell } from '@/entities/position/types'
import { ModalLayout } from '../modal-layout'
import { getHealth, getBorrowCapacity } from '../../utils'
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

  const actualDepositSumUsd = Math.max(
    depositSumUsd -
      Number(value) * mockTokenInfoByType[token].usd * mockTokenInfoByType[token].discount,
    0,
  )

  const { health, healthDelta } = getHealth({
    depositSumUsd,
    actualDebtUsd: debtSumUsd,
    debtSumUsd,
    actualDepositSumUsd,
  })

  const { borrowCapacityDelta, borrowCapacityInterface, borrowCapacityError } = getBorrowCapacity({
    depositSumUsd,
    actualDebtUsd: debtSumUsd,
    debtSumUsd,
    actualDepositUsd: actualDepositSumUsd,
  })

  const debtDelta = deposit - Number(value)
  const debtError = debtDelta < 0

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={debtSumUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={actualDepositSumUsd}
          borrowCapacityError={borrowCapacityError}
          health={health}
          healthDelta={healthDelta}
          depositSumUsdDelta={actualDepositSumUsd - depositSumUsd}
        />
      }
      onClose={onClose}
    >
      <h3>How much to pay off</h3>
      <input onChange={(e) => setValue(e.target.value)} type="number" value={value} />
      <button type="button" onClick={() => setValue(String(deposit))}>
        max {deposit}
      </button>
      <div>
        <button
          onClick={() => onSend({ value: Number(value), token })}
          type="button"
          disabled={debtError || borrowCapacityError}
        >
          pay off {value} {token}
        </button>
      </div>
    </ModalLayout>
  )
}

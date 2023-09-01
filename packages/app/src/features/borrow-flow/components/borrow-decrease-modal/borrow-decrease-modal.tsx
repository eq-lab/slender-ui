import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'

import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { DebtInfo } from '@/entities/position/types'
import { ModalLayout } from '../modal-layout'
import { formatUsd } from '../../formatters'

interface Props {
  debt: number
  collateralUsd: number
  onClose: () => void
  type: SupportedToken
  onSend: (value: DebtInfo) => void
}

export function BorrowDecreaseModal({ collateralUsd, debt, onClose, type, onSend }: Props) {
  const [value, setValue] = useState('')

  const debtDelta = debt - Number(value)

  const defaultDebtInUsd = debt * mockTokenInfoByType[type].usd
  const debtDeltaUsd = Math.max(debtDelta * mockTokenInfoByType[type].usd, 0)

  const defaultHealth = Math.max(
    Math.round(collateralUsd && (1 - defaultDebtInUsd / collateralUsd) * 100),
    0,
  )
  const health = Math.max(Math.round(collateralUsd && (1 - debtDeltaUsd / collateralUsd) * 100), 0)

  const defaultBorrowCapacity = Math.max(collateralUsd - defaultDebtInUsd, 0)
  const borrowCapacity = Math.max(collateralUsd - debtDeltaUsd, 0)

  const debtError = debtDelta < 0

  const infoSlot = (
    <div>
      <h4>Position summary</h4>
      <div>
        {health}% ({health - defaultHealth}%)
      </div>
      <div style={{ color: debtError ? 'red' : '' }}>
        Debt {formatUsd(debtDeltaUsd)} ({formatUsd(debtDeltaUsd - defaultDebtInUsd)})
      </div>
      <div>Collateral {formatUsd(collateralUsd)}</div>
      <div>
        Borrow capacity {formatUsd(borrowCapacity)} (
        {formatUsd(borrowCapacity - defaultBorrowCapacity)})
      </div>
    </div>
  )

  return (
    <ModalLayout infoSlot={infoSlot} onClose={onClose}>
      <h3>How much to pay off</h3>
      <input onChange={(e) => setValue(e.target.value)} type="number" value={value} />
      <button type="button" onClick={() => setValue(String(debt))}>
        max {debt}
      </button>
      <div>
        <button
          onClick={() => onSend({ debt: debtDelta, debtType: type })}
          type="button"
          disabled={debtError}
        >
          pay off {value} {type}
        </button>
      </div>
    </ModalLayout>
  )
}

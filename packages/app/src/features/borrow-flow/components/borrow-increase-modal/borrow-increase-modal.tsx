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

// TODO: need to rework component logic
export function BorrowIncreaseModal({ collateralUsd, debt, onClose, type, onSend }: Props) {
  const [value, setValue] = useState('')

  const debtDelta = debt + Number(value)

  const defaultDebtInUsd = debt * mockTokenInfoByType[type].usd
  const debtDeltaUsd = debtDelta * mockTokenInfoByType[type].usd

  const defaultHealth = Math.max(
    Math.round(collateralUsd && (1 - defaultDebtInUsd / collateralUsd) * 100),
    0,
  )
  const health = Math.max(Math.round(collateralUsd && (1 - debtDeltaUsd / collateralUsd) * 100), 0)

  const defaultBorrowCapacity = Math.max(collateralUsd - defaultDebtInUsd, 0)
  const borrowCapacity = collateralUsd - debtDeltaUsd

  const borrowCapacityInterface = Math.max(borrowCapacity, 0)
  const max = Math.floor(defaultBorrowCapacity / mockTokenInfoByType[type].usd)
  const borrowCapacityError = borrowCapacity < 0

  const infoSlot = (
    <div>
      <h4>Position summary</h4>
      <div>
        {health}% ({health - defaultHealth}%)
      </div>
      <div>
        Debt {formatUsd(debtDeltaUsd)} ({formatUsd(debtDeltaUsd - defaultDebtInUsd)})
      </div>
      <div>Collateral {formatUsd(collateralUsd)}</div>
      <div style={{ color: borrowCapacityError ? 'red' : '' }}>
        Borrow capacity {formatUsd(borrowCapacityInterface)} (
        {formatUsd(borrowCapacityInterface - defaultBorrowCapacity)})
      </div>
    </div>
  )

  return (
    <ModalLayout infoSlot={infoSlot} onClose={onClose}>
      <h3>How much to borrow</h3>
      <input onChange={(e) => setValue(e.target.value)} type="number" value={value} />
      <button type="button" onClick={() => setValue(String(max))} disabled={borrowCapacityError}>
        max {max}
      </button>
      <div>
        <button onClick={() => onSend({ debt: debtDelta, debtType: type })} type="button">
          pay off {value} {type}
        </button>
      </div>
    </ModalLayout>
  )
}

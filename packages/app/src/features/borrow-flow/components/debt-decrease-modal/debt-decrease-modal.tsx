import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'

import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { PositionCell } from '@/entities/position/types'
import { ModalLayout } from '../modal-layout'
import { getHealth, getBorrowCapacity } from '../../utils'
import { PositionSummary } from '../position-summary'

interface Props {
  debt: number
  stakeSumUsd: number
  onClose: () => void
  type: SupportedToken
  onSend: (value: PositionCell) => void
  debtSumUsd: number
}

export function DebtDecreaseModal({ stakeSumUsd, debt, onClose, type, onSend, debtSumUsd }: Props) {
  const [value, setValue] = useState('')

  const debtDeltaUsd = Math.max(debtSumUsd - Number(value) * mockTokenInfoByType[type].usd, 0)

  const { health, healthDelta } = getHealth({
    stakeSumUsd,
    actualDebtUsd: debtDeltaUsd,
    debtSumUsd,
    actualStakeSumUsd: stakeSumUsd,
  })

  const { borrowCapacityDelta, borrowCapacityInterface } = getBorrowCapacity({
    stakeSumUsd,
    actualDebtUsd: debtDeltaUsd,
    debtSumUsd,
    actualStakeUsd: stakeSumUsd,
  })

  const debtDelta = debt - Number(value)
  const debtError = debtDelta < 0

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={debtDeltaUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          stakeSumUsd={stakeSumUsd}
          health={health}
          debtUsdDelta={debtDeltaUsd - debtSumUsd}
          healthDelta={healthDelta}
          debtError={debtDelta < 0}
        />
      }
      onClose={onClose}
    >
      <h3>How much to pay off</h3>
      <input onChange={(e) => setValue(e.target.value)} type="number" value={value} />
      <button type="button" onClick={() => setValue(String(debt))}>
        max {debt}
      </button>
      <div>
        <button
          onClick={() => onSend({ value: Number(value), type })}
          type="button"
          disabled={debtError}
        >
          pay off {value} {type}
        </button>
      </div>
    </ModalLayout>
  )
}

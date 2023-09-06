import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'

import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { PositionCell } from '@/entities/position/types'
import { ModalLayout } from '../modal-layout'
import { getHealth, getBorrowCapacity } from '../../utils'
import { PositionSummary } from '../position-summary'

interface Props {
  stake: number
  stakeSumUsd: number
  onClose: () => void
  type: SupportedToken
  onSend: (value: PositionCell) => void
  debtSumUsd: number
}

export function StakeDecreaseModal({
  stakeSumUsd,
  stake,
  onClose,
  type,
  onSend,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('')

  const actualStakeSumUsd = Math.max(
    stakeSumUsd -
      Number(value) * mockTokenInfoByType[type].usd * mockTokenInfoByType[type].discount,
    0,
  )

  const { health, healthDelta } = getHealth({
    stakeSumUsd,
    actualDebtUsd: debtSumUsd,
    debtSumUsd,
    actualStakeSumUsd,
  })

  const { borrowCapacityDelta, borrowCapacityInterface } = getBorrowCapacity({
    stakeSumUsd,
    actualDebtUsd: debtSumUsd,
    debtSumUsd,
    actualStakeUsd: actualStakeSumUsd,
  })

  const debtDelta = stake - Number(value)
  const debtError = debtDelta < 0

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={debtSumUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          stakeSumUsd={actualStakeSumUsd}
          health={health}
          healthDelta={healthDelta}
          debtError={debtDelta < 0}
          stakeSumUsdDelta={actualStakeSumUsd - stakeSumUsd}
        />
      }
      onClose={onClose}
    >
      <h3>How much to pay off</h3>
      <input onChange={(e) => setValue(e.target.value)} type="number" value={value} />
      <button type="button" onClick={() => setValue(String(stake))}>
        max {stake}
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

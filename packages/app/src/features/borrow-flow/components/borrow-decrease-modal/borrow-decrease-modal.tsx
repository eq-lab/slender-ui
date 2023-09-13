import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'

import { PositionCell } from '@/entities/position/types'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { useGetSymbolByToken } from '@/entities/token/hooks/use-get-symbol-by-token'
import { useTokenInfo } from '../../hooks/use-token-info'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils'
import { FormLayout } from '../form-layout'

interface Props {
  debt: bigint
  depositSumUsd: number
  onClose: () => void
  token: SupportedToken
  onSend: (value: PositionCell) => void
  debtSumUsd: number
}

export function BorrowDecreaseModal({
  depositSumUsd,
  debt,
  onClose,
  token,
  onSend,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('')
  const getSymbolByToken = useGetSymbolByToken()

  const tokenInfo = useTokenInfo(token)
  const debtDeltaUsd = Math.max(debtSumUsd - Number(value) * tokenInfo.priceInUsd, 0)

  const { health, healthDelta, borrowCapacityInterface, borrowCapacityDelta } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDebtUsd: debtDeltaUsd,
    debtUsd: debtSumUsd,
    actualDepositUsd: depositSumUsd,
  })

  const debtDelta = debt - BigInt(value)
  const debtError = debtDelta < 0

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={debtDeltaUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={depositSumUsd}
          health={health}
          debtUsdDelta={debtDeltaUsd - debtSumUsd}
          healthDelta={healthDelta}
          debtError={debtDelta < 0}
        />
      }
      onClose={onClose}
    >
      <FormLayout
        title="How much to pay off"
        buttonProps={{
          label: `pay off ${value} ${getSymbolByToken(token)}`,
          onClick: () => onSend({ value: BigInt(value), token }),
          disabled: debtError,
        }}
      >
        <SuperField
          onChange={(e) => setValue(e.target.value)}
          value={value}
          title="To pay off"
          placeholder={`${getSymbolByToken(token)} amount`}
        />
        <button type="button" onClick={() => setValue(String(debt))}>
          max {debt.toString(10)}
        </button>
      </FormLayout>
    </ModalLayout>
  )
}

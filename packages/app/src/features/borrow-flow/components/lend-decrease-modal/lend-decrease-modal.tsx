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
  deposit: bigint
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
  const getSymbolByToken = useGetSymbolByToken()

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

  const depositDelta = deposit - BigInt(value)
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
      <FormLayout
        title="Withdraw collateral"
        buttonProps={{
          label: `Pay off ${value} ${getSymbolByToken(token)}`,
          onClick: () => onSend({ value: BigInt(value), token }),
          disabled: depositError || borrowCapacityError,
        }}
      >
        <SuperField
          onChange={(e) => setValue(e.target.value)}
          value={value}
          title="To withdraw"
          placeholder={`${getSymbolByToken(token)} amount`}
        />
        <button type="button" onClick={() => setValue(String(max))}>
          Max {max}
        </button>
      </FormLayout>
    </ModalLayout>
  )
}

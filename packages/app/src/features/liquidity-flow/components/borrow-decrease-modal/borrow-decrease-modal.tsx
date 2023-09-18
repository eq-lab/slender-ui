import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'

import { PositionCell } from '@/entities/position/types'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { useTokenInfo } from '../../hooks/use-token-info'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils'
import { FormLayout } from '../form-layout'

interface Props {
  debt: bigint
  depositSumUsd: number
  onClose: () => void
  tokenName: SupportedToken
  onSend: (value: PositionCell) => void
  debtSumUsd: number
}

export function BorrowDecreaseModal({
  depositSumUsd,
  debt,
  onClose,
  tokenName,
  onSend,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('')
  const getTokenByTokenName = useGetTokenByTokenName()

  const tokenInfo = useTokenInfo(tokenName)
  const debtDeltaUsd = Math.max(debtSumUsd - Number(value) * tokenInfo.priceInUsd, 0)

  const { health, healthDelta, borrowCapacityInterface, borrowCapacityDelta } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDebtUsd: debtDeltaUsd,
    debtUsd: debtSumUsd,
    actualDepositUsd: depositSumUsd,
  })

  const debtDelta = debt - BigInt(value)
  const debtError = debtDelta < 0

  const tokenSymbol = getTokenByTokenName(tokenName)?.symbol
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
          label: `Pay off ${value} ${tokenSymbol}`,
          onClick: () => onSend({ value: BigInt(value), token: tokenName }),
          disabled: debtError,
        }}
      >
        <SuperField
          onChange={(e) => setValue(e.target.value)}
          value={value}
          title="To pay off"
          placeholder={`Max ${debt.toString(10)} ${tokenSymbol}`}
          postfix={tokenSymbol}
        />
      </FormLayout>
    </ModalLayout>
  )
}

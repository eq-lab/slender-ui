import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'

import { PositionCell } from '@/entities/position/types'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { useTokenInfo } from '../../hooks/use-token-info'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils/get-position-info'
import { FormLayout } from '../form-layout'
import { getRequiredError } from '../../utils/get-required-error'

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

  const tokenInfo = useTokenInfo(tokenName)
  const inputDebtUsd = Number(value) * tokenInfo.priceInUsd
  const actualDebtUsd = Math.max(debtSumUsd - inputDebtUsd, 0)

  const { health, healthDelta, borrowCapacityInterface, borrowCapacityDelta } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDepositUsd: depositSumUsd,
    debtUsd: debtSumUsd,
    actualDebtUsd,
  })

  const debtDelta = debt - BigInt(value)
  const debtError = debtDelta < 0

  const formError = debtError || getRequiredError(value)

  const getTokenByTokenName = useGetTokenByTokenName()
  const tokenSymbol = getTokenByTokenName(tokenName)?.symbol
  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={actualDebtUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={depositSumUsd}
          health={health}
          debtUsdDelta={inputDebtUsd}
          healthDelta={healthDelta}
          debtError={debtError}
        />
      }
      onClose={onClose}
    >
      <FormLayout
        title="How much to pay off"
        buttonProps={{
          label: `Pay off ${value} ${tokenSymbol}`,
          onClick: () => onSend({ value: BigInt(value), tokenName }),
          disabled: formError,
        }}
      >
        <SuperField
          type="number"
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

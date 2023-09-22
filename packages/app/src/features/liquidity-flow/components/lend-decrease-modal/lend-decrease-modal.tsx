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
import { getDepositUsd } from '../../utils/get-deposit-usd'
import { getRequiredError } from '../../utils/get-required-error'

interface Props {
  deposit: bigint
  depositSumUsd: number
  onClose: () => void
  tokenName: SupportedToken
  onSend: (value: PositionCell) => void
  debtSumUsd: number
}

export function LendDecreaseModal({
  depositSumUsd,
  deposit,
  onClose,
  tokenName,
  onSend,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('')

  const depositTokenInfo = useTokenInfo(tokenName)

  const inputDepositSumUsd = getDepositUsd(
    value,
    depositTokenInfo.priceInUsd,
    depositTokenInfo.discount,
  )

  const actualDepositUsd = Math.max(depositSumUsd - inputDepositSumUsd, 0)

  const {
    borrowCapacityDelta,
    borrowCapacityInterface,
    borrowCapacityError,
    defaultBorrowCapacity,
    health,
    healthDelta,
  } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDepositUsd,
    debtUsd: debtSumUsd,
    actualDebtUsd: debtSumUsd,
  })

  const depositDelta = deposit - BigInt(value)
  const depositError = depositDelta < 0

  const formError = depositError || borrowCapacityError || getRequiredError(value)

  const borrowTokenInfo = useTokenInfo(tokenName)
  const max = Math.floor(
    defaultBorrowCapacity / (borrowTokenInfo.priceInUsd * borrowTokenInfo.discount),
  )

  const getTokenByTokenName = useGetTokenByTokenName()
  const tokenSymbol = getTokenByTokenName(tokenName)?.symbol

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={debtSumUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={actualDepositUsd}
          collateralError={borrowCapacityError}
          health={health}
          healthDelta={healthDelta}
          depositSumUsdDelta={inputDepositSumUsd}
        />
      }
      onClose={onClose}
    >
      <FormLayout
        title="Withdraw collateral"
        description={
          formError ? "Can't withdraw, not enough collateral to cover the debt" : undefined
        }
        buttonProps={{
          label: `Withdraw ${value} ${tokenSymbol}`,
          onClick: () => onSend({ value: BigInt(value), tokenName }),
          disabled: formError,
        }}
      >
        <SuperField
          type="number"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          title="To withdraw"
          placeholder={`Max ${max} ${tokenSymbol}`}
          postfix={tokenSymbol}
        />
      </FormLayout>
    </ModalLayout>
  )
}

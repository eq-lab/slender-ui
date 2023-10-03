import React, { useState } from 'react'
import { SupportedTokenName } from '@/shared/stellar/constants/tokens'

import { PositionCell } from '@/entities/position/types'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import BigNumber from 'bignumber.js'
import { TokenSuperField } from '@/shared/components/token-super-field'
import { formatCompactCryptoCurrency } from '@/shared/formatters'
import { useTokenInfo } from '../../hooks/use-token-info'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils/get-position-info'
import { FormLayout } from '../form-layout'
import { getRequiredError } from '../../utils/get-required-error'
import { makePosition } from '../../utils/make-position'

interface Props {
  debt: BigNumber
  depositSumUsd: number
  onClose: () => void
  tokenName: SupportedTokenName
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
  const inputDebtUsd = Number(value) / tokenInfo.priceInUsd
  const actualDebtUsd = Math.max(debtSumUsd - inputDebtUsd, 0)

  const { health, healthDelta, borrowCapacityInterface, borrowCapacityDelta } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDepositUsd: depositSumUsd,
    debtUsd: debtSumUsd,
    actualDebtUsd,
  })

  const debtError = Number(debt) < Math.floor(+value)

  const formError = debtError || getRequiredError({ value, valueDecimals: tokenInfo.decimals })

  const getTokenByTokenName = useGetTokenByTokenName()
  const token = getTokenByTokenName(tokenName)
  const sendValue = makePosition(tokenName, value)
  const tokenSymbol = token?.symbol

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={actualDebtUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={depositSumUsd}
          health={health}
          debtUsdDelta={-inputDebtUsd}
          healthDelta={healthDelta}
          debtError={debtError}
        />
      }
      onClose={onClose}
    >
      <FormLayout
        title="How much to pay off"
        buttonProps={{
          label: `Pay off ${formatCompactCryptoCurrency(value)} ${tokenSymbol}`,
          onClick: () => onSend(sendValue),
          disabled: formError,
        }}
      >
        <TokenSuperField
          initFocus
          onChange={setValue}
          tokenSymbol={tokenSymbol}
          value={value}
          title="To pay off"
          badgeValue={debt.toString(10)}
        />
      </FormLayout>
    </ModalLayout>
  )
}

import React, { useState } from 'react'
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { InfoRow } from '@/shared/components/info-row'
import { InfoLayout } from '@/shared/components/info-layout'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name'
import { formatUsd } from '@/shared/formatters'
import { PositionCell } from '@/entities/position/types'
import { ModalLayout } from '../modal-layout'
import { FormLayout } from '../form-layout'
import { useTokenInfo } from '../../hooks/use-token-info'
import { getDepositUsd } from '../../utils/get-deposit-usd'
import { getRequiredError } from '../../utils/get-required-error'
import { makePosition } from '../../utils/make-position'

interface Props {
  onClose: () => void
  onSend: (value: PositionCell) => void
  depositTokenName: SupportedTokenName
}

export function LendFirstPositionModal({ onClose, onSend, depositTokenName }: Props) {
  const [value, setValue] = useState('')

  const { balance = 0 } = useGetBalance([tokenContracts[depositTokenName].address])[0] || {}
  const max = Number(balance)

  const { lendInterestRate, discount, liquidationPenalty } = useMarketDataForDisplay(
    tokenContracts[depositTokenName],
  )
  const tokenInfo = useTokenInfo(depositTokenName)

  const getTokenByTokenName = useGetTokenByTokenName()
  const token = getTokenByTokenName(depositTokenName)
  const tokenSymbol = token?.symbol
  const Icon = getIconByTokenName(depositTokenName)

  const handleClick = () => {
    const depositValue = makePosition(depositTokenName, value)
    onSend(depositValue)
  }

  const infoSlot = (
    <InfoLayout title={token?.title} mediaSection={<Icon width={48} />}>
      <InfoRow label="Lend APR" value={lendInterestRate} />
      <InfoRow label="Discount" value={discount} />
      <InfoRow label="Liquidation penalty" value={liquidationPenalty} />
    </InfoLayout>
  )

  const requiredError = getRequiredError(value)
  const notEnoughFoundsError = Number(value) > max

  const formError = requiredError || notEnoughFoundsError

  const renderDescription = () => {
    if (requiredError) return 'Add deposit amount first'
    if (notEnoughFoundsError) return 'You don’t have enough funds'
    const depositUsd = getDepositUsd(value, tokenInfo.priceInUsd, tokenInfo.discount)
    return `${formatUsd(depositUsd)} will be counted as collateral`
  }

  return (
    <ModalLayout onClose={onClose} infoSlot={infoSlot}>
      <FormLayout
        description={renderDescription()}
        title="How much to lend"
        buttonProps={{
          label: `Lend ${value} ${tokenSymbol}`,
          onClick: handleClick,
          disabled: formError,
        }}
      >
        <SuperField
          type="number"
          onChange={(e) => {
            setValue(e.target.value)
          }}
          value={value}
          title="To deposit"
          placeholder={`Max ${max} ${tokenSymbol}`}
          postfix={tokenSymbol}
        />
      </FormLayout>
    </ModalLayout>
  )
}

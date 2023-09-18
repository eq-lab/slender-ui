import React, { useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { InfoRow } from '@/shared/components/info-row'
import { InfoLayout } from '@/shared/components/info-layout'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name'
import { ModalLayout } from '../modal-layout'
import { FormLayout } from '../form-layout'

interface Props {
  onClose: () => void
  onSend: (value: string) => void
  depositTokenName: SupportedToken
}

export function LendFirstPositionModal({ onClose, onSend, depositTokenName }: Props) {
  const [value, setValue] = useState('')

  const getTokenByTokenName = useGetTokenByTokenName()

  const { balance = '0', decimals = 0 } =
    useGetBalance([tokenContracts[depositTokenName].address])[0] || {}
  const max = Number(balance) / 10 ** decimals

  const { lendInterestRate, discount, liquidationPenalty } = useMarketDataForDisplay(
    tokenContracts[depositTokenName],
  )

  const token = getTokenByTokenName(depositTokenName)
  const tokenSymbol = token?.symbol
  const Icon = getIconByTokenName(depositTokenName)

  const infoSlot = (
    <InfoLayout title={token?.name} mediaSection={<Icon width={48} />}>
      <InfoRow label="Lend APR" value={lendInterestRate} />
      <InfoRow label="Discount" value={discount} />
      <InfoRow label="Liquidation penalty" value={liquidationPenalty} />
    </InfoLayout>
  )

  return (
    <ModalLayout onClose={onClose} infoSlot={infoSlot}>
      <FormLayout
        description="Add collateral on the next step"
        title="How much to lend"
        buttonProps={{
          label: `Continue`,
          onClick: () => onSend(value),
          disabled: !value || Number(value) > max,
        }}
      >
        <SuperField
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

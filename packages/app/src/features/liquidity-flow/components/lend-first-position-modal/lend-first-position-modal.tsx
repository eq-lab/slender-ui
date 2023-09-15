import React, { useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { InfoRow } from '@/shared/components/info-row'
import { InfoLayout } from '@/shared/components/info-layout'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { useGetInfoByTokenName } from '@/entities/token/hooks/use-get-info-by-token-name'
import { getIconByToken } from '@/entities/token/utils/get-icon-by-token'
import { ModalLayout } from '../modal-layout'
import { FormLayout } from '../form-layout'

interface Props {
  onClose: () => void
  onSend: (value: string) => void
  depositToken: SupportedToken
}

export function LendFirstPositionModal({ onClose, onSend, depositToken }: Props) {
  const [value, setValue] = useState('')

  const getInfoByTokenName = useGetInfoByTokenName()

  const { balance = '0', decimals = 0 } =
    useGetBalance([tokenContracts[depositToken].address])[0] || {}
  const max = Number(balance) / 10 ** decimals

  const { lendInterestRate, discount, liquidationPenalty } = useMarketDataForDisplay(
    tokenContracts[depositToken],
  )

  const tokenSymbol = getInfoByTokenName(depositToken)?.symbol
  const Icon = getIconByToken(depositToken)

  const infoSlot = (
    <InfoLayout title={`${depositToken} Coin`} mediaSection={<Icon width={48} />}>
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

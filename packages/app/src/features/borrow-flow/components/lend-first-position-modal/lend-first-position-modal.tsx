import React, { useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { InfoRow } from '@/shared/components/info-row'
import { InfoLayout } from '@/shared/components/info-layout'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { useGetSymbolByToken } from '@/entities/token/hooks/use-get-symbol-by-token'
import { ModalLayout } from '../modal-layout'
import { FormLayout } from '../form-layout'

interface Props {
  onClose: () => void
  onSend: (value: string) => void
  depositToken: SupportedToken
}

export function LendFirstPositionModal({ onClose, onSend, depositToken }: Props) {
  const [value, setValue] = useState('')

  const getSymbolByToken = useGetSymbolByToken()

  const { balance = '0', decimals = 0 } =
    useGetBalance([tokenContracts[depositToken].address])[0] || {}
  const max = Number(balance) / 10 ** decimals
  const { lendInterestRate, discount, liquidationPenalty } = useMarketDataForDisplay(
    tokenContracts[depositToken],
  )

  const infoSlot = (
    <InfoLayout title={`${depositToken} Coin`} mediaSection={null}>
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
        <div>
          <SuperField
            onChange={(e) => {
              setValue(e.target.value)
            }}
            value={value}
            title="To deposit"
            placeholder={`${getSymbolByToken(depositToken)} amount`}
          />
          <button onClick={() => setValue(String(max))} type="button">
            Max {max}
          </button>
        </div>
      </FormLayout>
    </ModalLayout>
  )
}

import React, { useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { InfoRow } from '@/shared/components/info-row'
import { InfoLayout } from '@/shared/components/info-layout'
import { ModalLayout } from '../modal-layout'

interface Props {
  onClose: () => void
  onSend: (value: string) => void
  depositToken: SupportedToken
}

export function LendFirstPositionModal({ onClose, onSend, depositToken }: Props) {
  const [value, setValue] = useState('')

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
      <h3>How much to lend</h3>
      <div>
        <input
          max={max}
          type="number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
        />
        {depositToken}
        <button onClick={() => setValue(String(max))} type="button">
          max: {max}
        </button>
      </div>
      <div>
        <button
          onClick={() => onSend(value)}
          type="button"
          disabled={!value || Number(value) > max}
        >
          Continue
        </button>
      </div>
      <div>Add collateral on the next step</div>
    </ModalLayout>
  )
}

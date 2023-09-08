import React, { useState } from 'react'
import { SupportedToken, tokens } from '@/shared/stellar/constants/tokens'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { ModalLayout } from '../modal-layout'

interface Props {
  onClose: () => void
  onSend: (value: number) => void
  depositToken: SupportedToken
}

export function LendFirstPositionModal({ onClose, onSend, depositToken }: Props) {
  const [value, setValue] = useState('')

  const { userValue } = mockTokenInfoByType[depositToken]
  const max = userValue
  const { lendInterestRate, discount, liquidationPenalty } = useMarketDataForDisplay(
    tokens[depositToken],
  )

  const infoSlot = (
    <div>
      <h4>{depositToken} Coin</h4>
      <div>Lend APR {lendInterestRate}</div>
      <div>Discount {discount}%</div>
      <div>Liquidation penalty {liquidationPenalty}</div>
    </div>
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
          onClick={() => onSend(Number(value))}
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

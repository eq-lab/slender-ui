import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { APR, mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { ModalLayout } from '../modal-layout'

interface Props {
  onClose: () => void
  onSend: (value: number) => void
  type: SupportedToken
}

export function StakeNoPositionModal({ onClose, onSend, type }: Props) {
  const [value, setValue] = useState('')

  const { userValue, discount } = mockTokenInfoByType[type]
  const max = userValue

  const infoSlot = (
    <div>
      <h4>{type} Coin</h4>
      <div>Lend APR {APR}</div>
      <div>Discount {discount}% (FAKE)</div>
      <div>Liquidation penalty -3% (FAKE)</div>
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
        {type}
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

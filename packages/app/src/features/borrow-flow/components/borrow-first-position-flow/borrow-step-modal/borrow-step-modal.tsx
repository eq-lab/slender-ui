import React from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import {
  APR,
  MINIMUM_HEALTH_VALUE,
  mockTokenInfoByType,
} from '@/shared/stellar/constants/mock-tokens-info'
import { ModalLayout } from '../../modal-layout'

interface Props {
  onClose: () => void
  onContinue: () => void
  value: string
  onBorrowValueChange: (value: string) => void
  type: SupportedToken
  depositType: SupportedToken
}

export function BorrowStepModal({
  onClose,
  onContinue,
  value,
  onBorrowValueChange,
  type,
  depositType,
}: Props) {
  const borrowCoinInfo = mockTokenInfoByType[type]
  const { discount, usd, userValue } = mockTokenInfoByType[depositType]

  const max = Math.floor((userValue * discount * usd * MINIMUM_HEALTH_VALUE) / borrowCoinInfo.usd)

  const infoSlot = (
    <div>
      <h4>{type} Coin</h4>
      <div>Borrow APR {APR}</div>
      <div>Available 100,000 {type} (FAKE)</div>
    </div>
  )
  return (
    <ModalLayout onClose={onClose} infoSlot={infoSlot}>
      <h3>How much to borrow</h3>
      <div>
        <input
          max={max}
          type="number"
          value={value}
          onChange={(e) => {
            onBorrowValueChange(e.target.value)
          }}
        />
        {type}
        <button onClick={() => onBorrowValueChange(String(max))} type="button">
          max: {max}
        </button>
      </div>
      <div>
        <button onClick={onContinue} type="button" disabled={!value || Number(value) > max}>
          Continue
        </button>
      </div>
      <div>Add collateral on the next step</div>
    </ModalLayout>
  )
}

import React from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import {
  APR,
  MINIMUM_HEALTH_VALUE,
  mockTokenInfoByType,
} from '@/shared/stellar/constants/mock-tokens-info'
import { ModalLayout } from '../modal-layout'

interface Props {
  onClose: () => void
  onContinue: () => void
  borrowValue: string
  onBorrowValueChange: (value: string) => void
  borrowType: SupportedToken
  stakeType: SupportedToken
}

export function BorrowStepModal({
  onClose,
  onContinue,
  borrowValue,
  onBorrowValueChange,
  borrowType,
  stakeType,
}: Props) {
  const borrowCoinInfo = mockTokenInfoByType[borrowType]
  const { discount, usd, userValue } = mockTokenInfoByType[stakeType]

  const max = Math.floor((userValue * discount * usd * MINIMUM_HEALTH_VALUE) / borrowCoinInfo.usd)

  const infoSlot = (
    <div>
      <h4>{borrowType} Coin</h4>
      <div>Borrow APR {APR}</div>
      <div>Available 100,000 {borrowType} (FAKE)</div>
    </div>
  )
  return (
    <ModalLayout onClose={onClose} infoSlot={infoSlot}>
      <h3>How much to borrow</h3>
      <div>
        <input
          max={max}
          type="number"
          value={borrowValue}
          onChange={(e) => {
            onBorrowValueChange(e.target.value)
          }}
        />
        {borrowType}
        <button onClick={() => onBorrowValueChange(String(max))} type="button">
          max: {max}
        </button>
      </div>
      <div>
        <button
          onClick={onContinue}
          type="button"
          disabled={!borrowValue || Number(borrowValue) > max}
        >
          Continue
        </button>
      </div>
      <div>Add collateral on the next step</div>
    </ModalLayout>
  )
}

import React from 'react'
import { SupportedToken, tokens } from '@/shared/stellar/constants/tokens'
import {
  MINIMUM_HEALTH_VALUE,
  mockTokenInfoByType,
} from '@/shared/stellar/constants/mock-tokens-info'
import { useMarketDataForDisplay } from '@/widgets/market-section/components/use-market-data-for-display'
import { ModalLayout } from '../../modal-layout'

interface Props {
  onClose: () => void
  onContinue: () => void
  value: string
  onBorrowValueChange: (value: string) => void
  debtToken: SupportedToken
  depositToken: SupportedToken
}

export function BorrowStepModal({
  onClose,
  onContinue,
  value,
  onBorrowValueChange,
  debtToken,
  depositToken,
}: Props) {
  const borrowCoinInfo = mockTokenInfoByType[debtToken]
  const { discount, usd, userValue } = mockTokenInfoByType[depositToken]

  const max = Math.floor((userValue * discount * usd * MINIMUM_HEALTH_VALUE) / borrowCoinInfo.usd)
  const { borrowInterestRate } = useMarketDataForDisplay(tokens[debtToken])

  const infoSlot = (
    <div>
      <h4>{debtToken} Coin</h4>
      <div>Borrow APR {borrowInterestRate}</div>
      <div>Available 100,000 {debtToken} (FAKE)</div>
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
        {debtToken}
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

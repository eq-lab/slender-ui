import React from 'react'
import { SupportedToken, tokens } from '@/shared/stellar/constants/tokens'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { DEFAULT_HEALTH_VALUE } from '../../../constants'
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

  const max = Math.floor((userValue * discount * usd * DEFAULT_HEALTH_VALUE) / borrowCoinInfo.usd)
  const { borrowInterestRate, availableToBorrow } = useMarketDataForDisplay(tokens[debtToken])

  const infoSlot = (
    <div>
      <h4>{debtToken} Coin</h4>
      <div>Borrow APR {borrowInterestRate}</div>
      <div>
        Available {availableToBorrow} {tokens[debtToken].code}
      </div>
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

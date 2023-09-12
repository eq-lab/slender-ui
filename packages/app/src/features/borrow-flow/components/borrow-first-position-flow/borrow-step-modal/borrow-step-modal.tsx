import React from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useTokenCache } from '@/entities/token/context/hooks'
import { useTokenInfo } from '../../../hooks/use-token-info'
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
  const borrowCoinInfo = useTokenInfo(debtToken)
  const { discount, priceInUsd, userBalance } = useTokenInfo(depositToken)

  const { borrowInterestRate, availableToBorrow } = useMarketDataForDisplay(
    tokenContracts[debtToken],
  )
  const tokenCache = useTokenCache()?.[tokenContracts[debtToken].address]

  const max = Math.min(
    Math.floor(
      (userBalance * discount * priceInUsd * DEFAULT_HEALTH_VALUE) / borrowCoinInfo.priceInUsd,
    ),
    availableToBorrow,
  )

  const infoSlot = (
    <div>
      <h4>{debtToken} Coin</h4>
      <div>Borrow APR {borrowInterestRate}</div>
      <div>
        Available {availableToBorrow} {tokenCache?.symbol}
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
        <button onClick={onContinue} type="button" disabled={!Number(value) || Number(value) > max}>
          Continue
        </button>
      </div>
      <div>Add collateral on the next step</div>
    </ModalLayout>
  )
}

import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { useLiquidity } from './use-liquidity'
import { BorrowDecreaseModal } from '../components/borrow-decrease-modal'
import { useDebtUsd } from './use-debt-usd'
import { useDepositUsd } from './use-deposit-usd'

export const useBorrowDecrease = (): {
  modal: JSX.Element | null
  open: (value: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const [modalToken, setModalToken] = useState<SupportedToken | null>(null)

  const debtSumUsd = useDebtUsd(position?.debts)
  const depositSumUsd = useDepositUsd(position?.deposits)
  const send = useLiquidity('repay')

  const renderModal = () => {
    if (!position || !modalToken) return null
    const debt = position.debts.find((debtCell) => debtCell.tokenName === modalToken)
    if (!debt) return null

    const handleSend = async ({ tokenName, value }: PositionCell) => {
      const newDebts = position.debts.map((debtCell) => {
        if (debtCell.tokenName === tokenName) {
          return { value: debtCell.value - value, tokenName }
        }
        return debtCell
      })

      setModalToken(null)
      await send({
        additionalDebts: [{ tokenName, value }],
        debts: newDebts,
      })
    }

    return (
      <BorrowDecreaseModal
        debtSumUsd={debtSumUsd}
        depositSumUsd={depositSumUsd}
        debt={debt.value}
        tokenName={debt.tokenName}
        onClose={() => setModalToken(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open: setModalToken }
}

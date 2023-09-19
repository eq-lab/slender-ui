import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { useLiquidity } from './use-liquidity'
import { submitWithdraw } from '../soroban/submit'
import { useDepositUsd } from './use-deposit-usd'
import { useDebtUsd } from './use-debt-usd'
import { LendDecreaseModal } from '../components/lend-decrease-modal'

export const useLendDecrease = (): {
  modal: JSX.Element | null
  open: (value: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const [modalToken, setModalToken] = useState<SupportedToken | null>(null)

  const debtSumUsd = useDebtUsd(position?.debts)
  const depositSumUsd = useDepositUsd(position?.deposits)
  const send = useLiquidity()

  const renderModal = () => {
    if (!position || !modalToken) return null
    const deposit = position.deposits.find((depositItem) => depositItem.tokenName === modalToken)
    if (!deposit) return null

    const handleSend = async ({ tokenName, value }: PositionCell) => {
      const newDeposits = position.deposits.map((newDeposit) => {
        if (newDeposit.tokenName === tokenName) {
          return { value: newDeposit.value - value, tokenName }
        }
        return newDeposit
      })

      setModalToken(null)
      await send({
        submitFunc: submitWithdraw,
        additionalDeposits: [{ tokenName, value }],
        deposits: newDeposits,
      })
    }

    return (
      <LendDecreaseModal
        deposit={deposit.value}
        debtSumUsd={debtSumUsd}
        depositSumUsd={depositSumUsd}
        tokenName={deposit.tokenName}
        onClose={() => setModalToken(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open: setModalToken }
}

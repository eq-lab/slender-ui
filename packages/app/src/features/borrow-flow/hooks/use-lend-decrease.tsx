import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { LendDecreaseModal } from '../components/lend-decrease-modal'
import { useDebtUsd } from './use-debt-usd'
import { useDepositUsd } from './use-deposit-usd'

export const useLendDecrease = (): {
  modal: JSX.Element | null
  open: (value: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [modalToken, setModalToken] = useState<SupportedToken | null>(null)

  const debtSumUsd = useDebtUsd(position?.debts)
  const depositSumUsd = useDepositUsd(position?.deposits)

  const renderModal = () => {
    if (!position || !modalToken) return null
    const deposit = position.deposits.find((depositItem) => depositItem.token === modalToken)
    if (!deposit) return null

    const handleSend = ({ token, value }: PositionCell) => {
      const newDeposits = position.deposits.map((el) => {
        if (el.token === token) {
          return { value: el.value - value, token }
        }
        return el
      })
      setPosition({
        debts: position.debts,
        deposits: newDeposits as [PositionCell, ...PositionCell[]],
      })
      setModalToken(null)
    }

    return (
      <LendDecreaseModal
        deposit={deposit.value}
        debtSumUsd={debtSumUsd}
        depositSumUsd={depositSumUsd}
        token={deposit.token}
        onClose={() => setModalToken(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open: setModalToken }
}

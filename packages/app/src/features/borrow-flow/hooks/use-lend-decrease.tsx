import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { getDebtUsd, getDepositUsd } from '../utils'
import { LendDecreaseModal } from '../components/lend-decrease-modal'

export const useLendDecrease = () => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [modalType, setModalType] = useState<SupportedToken | null>(null)

  const renderModal = () => {
    if (!position || !modalType) return null
    const deposit = position.deposits.find((depositItem) => depositItem.token === modalType)
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
      setModalType(null)
    }

    return (
      <LendDecreaseModal
        deposit={deposit.value}
        debtSumUsd={getDebtUsd(position.debts)}
        depositSumUsd={getDepositUsd(position.deposits)}
        token={deposit.token}
        onClose={() => setModalType(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open: setModalType }
}

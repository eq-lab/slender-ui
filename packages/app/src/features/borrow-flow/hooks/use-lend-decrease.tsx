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
    const deposit = position.deposits.find((depositItem) => depositItem.type === modalType)
    if (!deposit) return null

    const handleSend = ({ type, value }: PositionCell) => {
      const newDeposits = position.deposits.map((el) => {
        if (el.type === type) {
          return { value: el.value - value, type }
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
        type={deposit.type}
        onClose={() => setModalType(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open: setModalType }
}

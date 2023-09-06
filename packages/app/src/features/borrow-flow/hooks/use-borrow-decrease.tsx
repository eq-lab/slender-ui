import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { DebtDecreaseModal } from '../components/debt-decrease-modal'
import { getDebtUsd, getStakeUsd } from '../utils'

export const useDebtDecrease = (): {
  modal: React.ReactNode
  open: (value: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [modalType, setModalType] = useState<SupportedToken | null>(null)

  const renderModal = () => {
    if (!position || !modalType) return null
    const debt = position.debts.find((debtCell) => debtCell.type === modalType)
    if (!debt) return null

    const handleSend = ({ type, value }: PositionCell) => {
      const newDebts = position.debts.map((debtCell) => {
        if (debtCell.type === type) {
          return { value: debtCell.value - value, type }
        }
        return debtCell
      })
      setPosition({
        debts: newDebts,
        stakes: position.stakes,
      })
      setModalType(null)
    }

    return (
      <DebtDecreaseModal
        debtSumUsd={getDebtUsd(position.debts)}
        stakeSumUsd={getStakeUsd(position.stakes)}
        debt={debt.value}
        type={debt.type}
        onClose={() => setModalType(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open: setModalType }
}

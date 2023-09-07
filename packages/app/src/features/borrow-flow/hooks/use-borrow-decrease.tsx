import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { BorrowDecreaseModal } from '../components/borrow-decrease-modal'
import { getDebtUsd, getDepositUsd } from '../utils'

export const useBorrowDecrease = (): {
  modal: React.ReactNode
  open: (value: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [modalType, setModalType] = useState<SupportedToken | null>(null)

  const renderModal = () => {
    if (!position || !modalType) return null
    const debt = position.debts.find((debtCell) => debtCell.token === modalType)
    if (!debt) return null

    const handleSend = ({ token, value }: PositionCell) => {
      const newDebts = position.debts.map((debtCell) => {
        if (debtCell.token === token) {
          return { value: debtCell.value - value, token }
        }
        return debtCell
      })
      setPosition({
        debts: newDebts,
        deposits: position.deposits,
      })
      setModalType(null)
    }

    return (
      <BorrowDecreaseModal
        debtSumUsd={getDebtUsd(position.debts)}
        depositSumUsd={getDepositUsd(position.deposits)}
        debt={debt.value}
        token={debt.token}
        onClose={() => setModalType(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open: setModalType }
}

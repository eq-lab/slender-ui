import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { BorrowIncreaseModal } from '../components/borrow-increase-modal'
import { excludeSupportedTokens, getDebtUsd, getDepositUsd, sumObj } from '../utils'

export const useBorrowIncrease = (): {
  modal: React.ReactNode
  open: (value: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [modalType, setModalType] = useState<SupportedToken | null>(null)

  const renderModal = () => {
    if (!position || !modalType) return null
    const debt = position.debts.find((debtItem) => debtItem.type === modalType)
    if (!debt) return null

    const firstDeposit = position.deposits[0].type
    const secondDeposit = position.deposits[1]?.type
    const secondDebt = position.debts[1]?.type

    const getDebtTypes = () => {
      if (secondDebt) {
        return [debt.type]
      }

      return excludeSupportedTokens(secondDeposit ? [firstDeposit, secondDeposit] : [firstDeposit])
    }

    const handleSend = (sendValue: Partial<Record<'usdc' | 'xlm' | 'xrp', number>>) => {
      const prevDebtsObj = position.debts.reduce(
        (acc, el) => ({
          ...acc,
          [el.type]: el.value,
        }),
        {},
      )
      const finalDebtsObj = sumObj(prevDebtsObj, sendValue)

      const arr = Object.entries(finalDebtsObj).map((entry) => {
        const [key, value] = entry as [SupportedToken, number]
        return {
          type: key,
          value,
        }
      })

      setPosition({
        debts: arr,
        deposits: position.deposits,
      })
      setModalType(null)
    }

    return (
      <BorrowIncreaseModal
        debtTypes={getDebtTypes()}
        depositSumUsd={getDepositUsd(position.deposits)}
        debtSumUsd={getDebtUsd(position.debts)}
        type={debt.type}
        onClose={() => setModalType(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open: setModalType }
}

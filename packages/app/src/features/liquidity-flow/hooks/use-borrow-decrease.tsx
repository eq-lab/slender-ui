import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { logError, logInfo } from '@/shared/logger'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { BorrowDecreaseModal } from '../components/borrow-decrease-modal'
import { useDebtUsd } from './use-debt-usd'
import { useDepositUsd } from './use-deposit-usd'
import { submitRepay } from '../soroban/submit'
import { getPositionUpdateByCells } from '../soroban/get-position-update-by-cells'
import { useSetWaitModalIsOpen } from '../context/hooks'

export const useBorrowDecrease = (): {
  modal: JSX.Element | null
  open: (value: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [modalToken, setModalToken] = useState<SupportedToken | null>(null)

  const debtSumUsd = useDebtUsd(position?.debts)
  const depositSumUsd = useDepositUsd(position?.deposits)
  const setWaitModalIsOpen = useSetWaitModalIsOpen()
  const { address } = useWalletAddress()

  const renderModal = () => {
    if (!position || !modalToken) return null
    const debt = position.debts.find((debtCell) => debtCell.token === modalToken)
    if (!debt) return null

    const handleSend = async ({ token, value }: PositionCell) => {
      const newDebts = position.debts.map((debtCell) => {
        if (debtCell.token === token) {
          return { value: debtCell.value - value, token }
        }
        return debtCell
      })

      if (!address) return
      setModalToken(null)

      try {
        setWaitModalIsOpen(true)

        logInfo(await submitRepay(address, getPositionUpdateByCells(newDebts)))
        setPosition({
          debts: newDebts,
          deposits: position.deposits,
        })
      } catch (e) {
        logError(e)
      } finally {
        setWaitModalIsOpen(false)
      }
    }

    return (
      <BorrowDecreaseModal
        debtSumUsd={debtSumUsd}
        depositSumUsd={depositSumUsd}
        debt={debt.value}
        tokenName={debt.token}
        onClose={() => setModalToken(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open: setModalToken }
}

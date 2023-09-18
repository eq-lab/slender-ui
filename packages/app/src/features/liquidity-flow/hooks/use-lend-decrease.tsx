import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { logError, logInfo } from '@/shared/logger'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { submitWithdraw } from '../soroban/submit'
import { getPositionUpdateByCells } from '../soroban/get-position-update-by-cells'
import { useSetWaitModalIsOpen } from '../context/hooks'
import { useDepositUsd } from './use-deposit-usd'
import { useDebtUsd } from './use-debt-usd'
import { LendDecreaseModal } from '../components/lend-decrease-modal'

export const useLendDecrease = (): {
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
    const deposit = position.deposits.find((depositItem) => depositItem.tokenName === modalToken)
    if (!deposit) return null

    const handleSend = async ({ tokenName, value }: PositionCell) => {
      const newDeposits = position.deposits.map((el) => {
        if (el.tokenName === tokenName) {
          return { value: el.value - value, tokenName }
        }
        return el
      })

      if (!address) return
      setModalToken(null)

      try {
        setWaitModalIsOpen(true)

        logInfo(await submitWithdraw(address, getPositionUpdateByCells(newDeposits)))
        setPosition({
          debts: position.debts,
          deposits: newDeposits,
        })
      } catch (e) {
        logError(e)
      } finally {
        setWaitModalIsOpen(false)
      }
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

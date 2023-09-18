import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { logError, logInfo } from '@/shared/logger'
import { excludeSupportedTokens } from '../utils/exclude-supported-tokens'
import { BorrowIncreaseModal } from '../components/borrow-increase-modal'
import { sumObj } from '../utils/sum-obj'
import { useDebtUsd } from './use-debt-usd'
import { useDepositUsd } from './use-deposit-usd'
import { PositionUpdate } from '../types'
import { submitBorrow } from '../soroban/submit'
import { useSetWaitModalIsOpen } from '../context/hooks'

export const useBorrowIncrease = (): {
  modal: JSX.Element | null
  open: (value?: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [modalToken, setModalToken] = useState<SupportedToken | null>(null)

  const depositTokens = position?.deposits.map((deposit) => deposit.tokenName) || []

  const depositSumUsd = useDepositUsd(position?.deposits)
  const debtSumUsd = useDebtUsd(position?.debts)
  const { address } = useWalletAddress()
  const setWaitModalIsOpen = useSetWaitModalIsOpen()

  const open = (value?: SupportedToken) => {
    if (value) {
      setModalToken(value)
      return
    }
    const firstToken = excludeSupportedTokens(depositTokens)[0]
    if (firstToken) {
      setModalToken(firstToken)
    }
  }

  const renderModal = () => {
    if (!position || !modalToken) return null

    const handleSend = async (sendValue: PositionUpdate) => {
      if (!address) return
      setModalToken(null)

      try {
        setWaitModalIsOpen(true)
        logInfo(await submitBorrow(address, sendValue))

        const prevDebtsObj = position.debts.reduce(
          (acc, el) => ({
            ...acc,
            [el.tokenName]: el.value,
          }),
          {},
        )
        const finalDebtsObj = sumObj(prevDebtsObj, sendValue)
        const debts = Object.entries(finalDebtsObj).map((entry) => {
          const [tokenName, value] = entry as [SupportedToken, bigint]
          return {
            tokenName,
            value,
          }
        })
        setPosition({
          debts,
          deposits: position.deposits,
        })
      } catch (e) {
        logError(e)
      } finally {
        setWaitModalIsOpen(false)
      }
    }

    return (
      <BorrowIncreaseModal
        debtTokenNames={excludeSupportedTokens(depositTokens)}
        depositSumUsd={depositSumUsd}
        debtSumUsd={debtSumUsd}
        tokenName={modalToken}
        onClose={() => setModalToken(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open }
}

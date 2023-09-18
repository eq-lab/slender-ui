import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { logError, logInfo } from '@/shared/logger'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { excludeSupportedTokens } from '../utils/exclude-supported-tokens'
import { submitDeposit } from '../soroban/submit'
import { useSetWaitModalIsOpen } from '../context/hooks'
import { useDepositUsd } from './use-deposit-usd'
import { useDebtUsd } from './use-debt-usd'
import { LendIncreaseModal } from '../components/lend-increase-modal'
import { sumObj } from '../utils/sum-obj'
import { PositionUpdate } from '../types'
import { getPositionUpdateByCells } from '../soroban/get-position-update-by-cells'

export const useLendIncrease = (): {
  modal: JSX.Element | null
  open: (value?: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [modalToken, setModalToken] = useState<SupportedToken | null>(null)

  const debtsTokens = position?.debts.map((debt) => debt.tokenName) || []

  const open = (value?: SupportedToken) => {
    if (value) {
      setModalToken(value)
      return
    }
    const firstToken = excludeSupportedTokens(debtsTokens)[0]
    if (firstToken) {
      setModalToken(firstToken)
    }
  }

  const depositSumUsd = useDepositUsd(position?.deposits)
  const debtSumUsd = useDebtUsd(position?.debts)
  const setWaitModalIsOpen = useSetWaitModalIsOpen()
  const { address } = useWalletAddress()

  const renderModal = () => {
    if (!position || !modalToken) return null

    const handleSend = async (sendValue: PositionUpdate) => {
      const prevDepositsObj = position.deposits.reduce(
        (acc, el) => ({
          ...acc,
          [el.tokenName]: el.value,
        }),
        {},
      )
      const finalDebtsObj = sumObj(prevDepositsObj, sendValue)

      const arr = Object.entries(finalDebtsObj).map((entry) => {
        const [tokenName, value] = entry as [SupportedToken, bigint]
        return {
          tokenName,
          value,
        }
      })

      if (!address) return
      setModalToken(null)

      try {
        setWaitModalIsOpen(true)

        const deposits = getPositionUpdateByCells(arr)

        logInfo(await submitDeposit(address, deposits))
        setPosition({
          debts: position.debts,
          deposits: arr,
        })
      } catch (e) {
        logError(e)
      } finally {
        setWaitModalIsOpen(false)
      }
    }

    return (
      <LendIncreaseModal
        depositTokenNames={excludeSupportedTokens(debtsTokens)}
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

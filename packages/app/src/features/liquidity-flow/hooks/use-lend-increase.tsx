import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { useLiquidity } from './use-liquidity'
import { excludeSupportedTokens } from '../utils/exclude-supported-tokens'
import { submitDeposit } from '../soroban/submit'
import { useDepositUsd } from './use-deposit-usd'
import { useDebtUsd } from './use-debt-usd'
import { LendIncreaseModal } from '../components/lend-increase-modal'
import { sumObj } from '../utils/sum-obj'
import { PositionUpdate } from '../types'
import { getCellByPositionUpdate } from '../soroban/get-cell-by-position-update'

export const useLendIncrease = (): {
  modal: JSX.Element | null
  open: (value?: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
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
  const send = useLiquidity()

  const renderModal = () => {
    if (!position || !modalToken) return null

    const handleSend = (sendValue: PositionUpdate) => {
      const prevDepositsObj = position.deposits.reduce(
        (acc, el) => ({
          ...acc,
          [el.tokenName]: el.value,
        }),
        {},
      )
      const finalDebtsObj = sumObj(prevDepositsObj, sendValue)

      const newDeposits = getCellByPositionUpdate(finalDebtsObj)

      setModalToken(null)
      send({
        submitFunc: submitDeposit,
        additionalDeposits: getCellByPositionUpdate(sendValue),
        deposits: newDeposits,
      })
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

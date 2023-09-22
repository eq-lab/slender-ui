import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { SupportedTokenName } from '@/shared/stellar/constants/tokens'
import { useLiquidity } from './use-liquidity'
import { excludeSupportedTokens } from '../utils/exclude-supported-tokens'
import { useDepositUsd } from './use-deposit-usd'
import { useDebtUsd } from './use-debt-usd'
import { LendIncreaseModal } from '../components/lend-increase-modal'
import { sumObj } from '../utils/sum-obj'
import { PositionUpdate } from '../types'
import { getCellByPositionUpdate } from '../soroban/get-cell-by-position-update'

export const useLendIncrease = (): {
  modal: JSX.Element | null
  open: (value?: SupportedTokenName) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const [modalToken, setModalToken] = useState<SupportedTokenName | null>(null)

  const debtsTokens = position?.debts.map((debt) => debt.tokenName) || []

  const open = (value?: SupportedTokenName) => {
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
  const send = useLiquidity('deposit')

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

      const newDeposits = getCellByPositionUpdate(finalDebtsObj)

      setModalToken(null)
      await send({
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

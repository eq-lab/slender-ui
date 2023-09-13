import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { PositionCell } from '@/entities/position/types'
import { useDepositUsd } from './use-deposit-usd'
import { useDebtUsd } from './use-debt-usd'
import { LendIncreaseModal } from '../components/lend-increase-modal'
import { excludeSupportedTokens, sumObj } from '../utils'

export const useLendIncrease = (): {
  modal: React.ReactNode
  open: (value?: SupportedToken) => void
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [modalToken, setModalToken] = useState<SupportedToken | null>(null)

  const debtsTokens = position?.debts.map((debt) => debt.token) || []

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

  const renderModal = () => {
    if (!position || !modalToken) return null

    const handleSend = (sendValue: Partial<Record<SupportedToken, bigint>>) => {
      const prevDepositsObj = position.deposits.reduce(
        (acc, el) => ({
          ...acc,
          [el.token]: el.value,
        }),
        {},
      )
      const finalDebtsObj = sumObj(prevDepositsObj, sendValue)

      const arr = Object.entries(finalDebtsObj).map((entry) => {
        const [key, value] = entry as [SupportedToken, bigint]
        return {
          token: key,
          value,
        }
      })

      setPosition({
        debts: position.debts,
        deposits: arr as [PositionCell, ...PositionCell[]],
      })
      setModalToken(null)
    }

    return (
      <LendIncreaseModal
        depositTokens={excludeSupportedTokens(debtsTokens)}
        depositSumUsd={depositSumUsd}
        debtSumUsd={debtSumUsd}
        token={modalToken}
        onClose={() => setModalToken(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open }
}

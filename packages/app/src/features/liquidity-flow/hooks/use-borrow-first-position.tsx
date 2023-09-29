import { useState } from 'react'
import { SupportedTokenName } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { useLiquidity } from './use-liquidity'
import { excludeSupportedTokens } from '../utils/exclude-supported-tokens'
import { BorrowStepModal } from '../components/borrow-first-position-flow/borrow-step-modal'
import { LendStepModal } from '../components/borrow-first-position-flow/lend-step-modal'
import { useTokenInfo } from './use-token-info'
import { getDepositUsd } from '../utils/get-deposit-usd'
import { DEFAULT_HEALTH_VALUE } from '../constants'

enum Step {
  Borrow = 'Borrow',
  Deposit = 'Deposit',
}

export const useBorrowFirstPosition = (
  token: SupportedTokenName,
): {
  modal: JSX.Element | null
  open: () => void
} => {
  const [step, setStep] = useState<Step | null>(null)
  const [debtValue, setDebtValue] = useState('')
  const sendDeposit = useLiquidity('deposit')
  const sendBorrow = useLiquidity('borrow')

  const close = () => {
    setStep(null)
    setDebtValue('')
  }

  const handleSend = async (value: Position) => {
    close()
    const depositResult = await sendDeposit({
      deposits: value.deposits,
    })
    if (depositResult) {
      await sendBorrow({
        debts: value.debts,
      })
    }
  }

  const [firstDepositToken, secondDepositToken] = excludeSupportedTokens([token]) as [
    SupportedTokenName,
    SupportedTokenName,
  ]

  const firstDepositTokenInfo = useTokenInfo(firstDepositToken)
  const secondDepositTokenInfo = useTokenInfo(secondDepositToken)

  const firstTokenUserBalanceUsd = getDepositUsd(
    firstDepositTokenInfo.userBalance,
    firstDepositTokenInfo.priceInUsd,
    firstDepositTokenInfo.discount,
  )
  const secondTokenUserBalanceUsd = getDepositUsd(
    secondDepositTokenInfo.userBalance,
    secondDepositTokenInfo.priceInUsd,
    secondDepositTokenInfo.discount,
  )

  const maxDepositUsd =
    (firstTokenUserBalanceUsd + secondTokenUserBalanceUsd) * DEFAULT_HEALTH_VALUE

  const depositTokenName =
    firstTokenUserBalanceUsd > secondTokenUserBalanceUsd ? firstDepositToken : secondDepositToken

  const modalByStep = {
    [Step.Borrow]: (
      <BorrowStepModal
        value={debtValue}
        onClose={close}
        onContinue={() => setStep(Step.Deposit)}
        maxDepositUsd={maxDepositUsd}
        onBorrowValueChange={setDebtValue}
        debtTokenName={token}
      />
    ),
    [Step.Deposit]: (
      <LendStepModal
        onClose={close}
        onBack={() => setStep(Step.Borrow)}
        debtValue={debtValue}
        debtTokenName={token}
        depositTokenName={depositTokenName}
        depositTokenNames={[firstDepositToken, secondDepositToken]}
        onSend={handleSend}
      />
    ),
  }

  const modal = (step && modalByStep[step]) || null

  const open = () => {
    setStep(Step.Borrow)
  }

  return { modal, open }
}

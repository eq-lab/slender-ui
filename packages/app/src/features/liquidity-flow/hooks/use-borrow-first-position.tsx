import { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { useLiquidity } from './use-liquidity'
import { excludeSupportedTokens } from '../utils/exclude-supported-tokens'
import { BorrowStepModal } from '../components/borrow-first-position-flow/borrow-step-modal'
import { LendStepModal } from '../components/borrow-first-position-flow/lend-step-modal'
import { submitBorrow, submitDeposit } from '../soroban/submit'

enum Step {
  Borrow = 'Borrow',
  Deposit = 'Deposit',
}

export const useBorrowFirstPosition = (
  token: SupportedToken,
): {
  modal: React.ReactNode
  open: () => void
} => {
  const [step, setStep] = useState<Step | null>(null)
  const [debtValue, setDebtValue] = useState('')
  const send = useLiquidity()

  const close = () => {
    setStep(null)
    setDebtValue('')
  }

  const handleSend = async (value: Position) => {
    close()
    const depositResult = await send({
      submitFunc: submitDeposit,
      deposits: value.deposits,
    })
    if (depositResult) {
      await send({
        submitFunc: submitBorrow,
        debts: value.debts,
      })
    }
  }

  const [firstDepositToken, secondDepositToken] = excludeSupportedTokens([token])

  const modalByStep = {
    [Step.Borrow]: firstDepositToken && (
      <BorrowStepModal
        value={debtValue}
        onClose={close}
        onContinue={() => setStep(Step.Deposit)}
        onBorrowValueChange={setDebtValue}
        debtTokenName={token}
        depositTokenName={firstDepositToken}
      />
    ),
    [Step.Deposit]: firstDepositToken && secondDepositToken && (
      <LendStepModal
        onClose={close}
        debtValue={debtValue}
        debtTokenName={token}
        depositTokenNames={[firstDepositToken, secondDepositToken]}
        onSend={handleSend}
      />
    ),
  }

  const modal = step ? modalByStep[step] : null

  const open = () => {
    setStep(Step.Borrow)
  }

  return { modal, open }
}

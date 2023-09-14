import { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { useContextSelector } from 'use-context-selector'
import { PositionContext } from '@/entities/position/context/context'
import { logInfo } from '@/shared/logger'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { getPositionUpdateByPosition } from '../soroban/get-position-update-by-position'
import { BorrowStepModal } from '../components/borrow-first-position-flow/borrow-step-modal'
import { LendStepModal } from '../components/borrow-first-position-flow/lend-step-modal'
import { excludeSupportedTokens } from '../utils'
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
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [step, setStep] = useState<Step | null>(null)
  const [debtValue, setDebtValue] = useState('')
  const { address } = useWalletAddress()

  const close = () => {
    setStep(null)
    setDebtValue('')
  }

  const handleSend = async (value: Position) => {
    if (!address) return
    close()
    setPosition(value)
    const { deposits, debts } = getPositionUpdateByPosition(value)
    logInfo(await submitDeposit(address, deposits))
    logInfo(await submitBorrow(address, debts))
  }

  const [firstDepositToken, secondDepositToken] = excludeSupportedTokens([token])

  const modalByStep = {
    [Step.Borrow]: firstDepositToken && (
      <BorrowStepModal
        value={debtValue}
        onClose={close}
        onContinue={() => setStep(Step.Deposit)}
        onBorrowValueChange={setDebtValue}
        debtToken={token}
        depositToken={firstDepositToken}
      />
    ),
    [Step.Deposit]: firstDepositToken && secondDepositToken && (
      <LendStepModal
        onClose={close}
        debtValue={debtValue}
        debtToken={token}
        depositTokens={[firstDepositToken, secondDepositToken]}
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

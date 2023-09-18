import { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { useContextSelector } from 'use-context-selector'
import { PositionContext } from '@/entities/position/context/context'
import { logError, logInfo } from '@/shared/logger'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { getPositionUpdateByCells } from '../soroban/get-position-update-by-cells'
import { BorrowStepModal } from '../components/borrow-first-position-flow/borrow-step-modal'
import { LendStepModal } from '../components/borrow-first-position-flow/lend-step-modal'
import { excludeSupportedTokens } from '../utils'
import { submitBorrow, submitDeposit } from '../soroban/submit'
import { useSetWaitModalIsOpen } from '../context/hooks'

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
  const setWaitModalIsOpen = useSetWaitModalIsOpen()

  const close = () => {
    setStep(null)
    setDebtValue('')
  }

  const handleSend = async (value: Position) => {
    if (!address) return
    close()

    try {
      setWaitModalIsOpen(true)

      const deposits = getPositionUpdateByCells(value.deposits)
      logInfo(await submitDeposit(address, deposits))

      const debts = getPositionUpdateByCells(value.debts)
      logInfo(await submitBorrow(address, debts))

      setPosition(value)
    } catch (e) {
      logError(e)
    } finally {
      setWaitModalIsOpen(false)
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

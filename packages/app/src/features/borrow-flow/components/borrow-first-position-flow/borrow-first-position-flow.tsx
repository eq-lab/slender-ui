'use client'

import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { BorrowStepModal } from './borrow-step-modal'
import { LendStepModal } from './lend-step-modal'
import { excludeSupportedTokens } from '../../utils'

enum Step {
  Borrow = 'Borrow',
  Deposit = 'Deposit',
}

interface Props {
  token: SupportedToken
  onSend: (value: Position) => void
  buttonText: string
}

export function BorrowFirstPositionFlow({ token, onSend, buttonText }: Props) {
  const [step, setStep] = useState<Step | null>(null)
  const [debtValue, setDebtValue] = useState('')

  const handleClose = () => {
    setStep(null)
    setDebtValue('')
  }

  const handleSend = (value: Position) => {
    handleClose()
    onSend(value)
  }

  const [firstDepositToken, secondDepositToken] = excludeSupportedTokens([token])

  const modalByStep = {
    [Step.Borrow]: firstDepositToken && (
      <BorrowStepModal
        value={debtValue}
        onClose={handleClose}
        onContinue={() => setStep(Step.Deposit)}
        onBorrowValueChange={setDebtValue}
        debtToken={token}
        depositToken={firstDepositToken}
      />
    ),
    [Step.Deposit]: firstDepositToken && secondDepositToken && (
      <LendStepModal
        onClose={handleClose}
        onPrev={() => setStep(Step.Borrow)}
        debtValue={debtValue}
        debtToken={token}
        depositTokens={[firstDepositToken, secondDepositToken]}
        onSend={handleSend}
      />
    ),
  }

  const handleClick = () => {
    setStep(Step.Borrow)
  }

  return (
    <>
      {!step && (
        <button type="button" onClick={handleClick}>
          {buttonText}
        </button>
      )}
      {step && modalByStep[step]}
    </>
  )
}

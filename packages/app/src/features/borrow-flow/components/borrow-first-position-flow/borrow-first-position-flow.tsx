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
  type: SupportedToken
  onSend: (value: Position) => void
  buttonText: string
}

export function BorrowFirstPositionFlow({ type, onSend, buttonText }: Props) {
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

  const modalByStep = {
    [Step.Borrow]: (
      <BorrowStepModal
        value={debtValue}
        onClose={handleClose}
        onContinue={() => setStep(Step.Deposit)}
        onBorrowValueChange={setDebtValue}
        type={type}
        depositType={excludeSupportedTokens([type])[0]}
      />
    ),
    [Step.Deposit]: (
      <LendStepModal
        onClose={handleClose}
        onPrev={() => setStep(Step.Borrow)}
        debtValue={debtValue}
        debtType={type}
        depositTypes={excludeSupportedTokens([type])}
        onSend={handleSend}
      />
    ),
  }

  const handleClick = () => {
    setStep(Step.Borrow)
  }

  return (
    <div>
      {!step && (
        <button type="button" onClick={handleClick}>
          {buttonText}
        </button>
      )}
      {step && modalByStep[step]}
    </div>
  )
}

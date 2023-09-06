'use client'

import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { DebtStepModal } from '../debt-step-modal'
import { StakeStepModal } from '../stake-step-modal'
import { excludeSupportedTokens } from '../../utils'

enum Step {
  Borrow = 'Borrow',
  Stake = 'Stake',
}

interface Props {
  type: SupportedToken
  onSend: (value: Position) => void
  buttonText: string
}

export function SingleDebtFlow({ type, onSend, buttonText }: Props) {
  const [step, setStep] = useState<Step | null>(null)
  const [borrowValue, setBorrowValue] = useState('')

  const handleClose = () => {
    setStep(null)
    setBorrowValue('')
  }

  const handleSend = (value: Position) => {
    handleClose()
    onSend(value)
  }

  const modalByStep = {
    [Step.Borrow]: (
      <DebtStepModal
        borrowValue={borrowValue}
        onClose={handleClose}
        onContinue={() => setStep(Step.Stake)}
        onBorrowValueChange={setBorrowValue}
        borrowType={type}
        stakeType={excludeSupportedTokens([type])[0]}
      />
    ),
    [Step.Stake]: (
      <StakeStepModal
        onClose={handleClose}
        onPrev={() => setStep(Step.Borrow)}
        borrowValue={borrowValue}
        borrowType={type}
        stakeTypes={excludeSupportedTokens([type])}
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

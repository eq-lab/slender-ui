'use client'

import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { BorrowStepModal } from '../borrow-step-modal'
import { CollateralStepModal } from '../collateral-step-modal'
import { excludeSupportedTokens } from '../../utils'

enum Step {
  Borrow = 'Borrow',
  Collateral = 'Collateral',
}

interface Props {
  type: SupportedToken
  onSend: (value: Position) => void
  buttonText: string
}

export function SingleBorrowFlow({ type, onSend, buttonText }: Props) {
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
      <BorrowStepModal
        borrowValue={borrowValue}
        onClose={handleClose}
        onContinue={() => setStep(Step.Collateral)}
        onBorrowValueChange={setBorrowValue}
        borrowType={type}
        collateralTypes={excludeSupportedTokens([type])}
      />
    ),
    [Step.Collateral]: (
      <CollateralStepModal
        onClose={handleClose}
        onPrev={() => setStep(Step.Borrow)}
        borrowValue={borrowValue}
        borrowType={type}
        collateralTypes={excludeSupportedTokens([type])}
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

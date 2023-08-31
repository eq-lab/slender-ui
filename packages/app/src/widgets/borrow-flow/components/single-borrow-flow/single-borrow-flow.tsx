'use client'

import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar-constants/tokens'
import { BorrowStepModal } from '../borrow-step-modal'
import { CollateralStepModal } from '../collateral-step-modal'

enum Step {
  Borrow = 'Borrow',
  Collateral = 'Collateral',
}

interface Props {
  type: SupportedToken
}

const collateralByBorrow: Record<SupportedToken, [SupportedToken, SupportedToken]> = {
  usdc: ['xlm', 'xrp'],
  xlm: ['usdc', 'xrp'],
  xrp: ['usdc', 'xlm'],
}

export function SingleBorrowFlow({ type }: Props) {
  const [step, setStep] = useState<Step | null>(null)
  const [borrowValue, setBorrowValue] = useState('')

  const handleClose = () => {
    setStep(null)
    setBorrowValue('')
  }

  const modalByStep = {
    [Step.Borrow]: (
      <BorrowStepModal
        borrowValue={borrowValue}
        onClose={handleClose}
        onContinue={() => setStep(Step.Collateral)}
        onBorrowValueChange={setBorrowValue}
        borrowType={type}
        collateralTypes={collateralByBorrow[type]}
      />
    ),
    [Step.Collateral]: (
      <CollateralStepModal
        onClose={handleClose}
        onPrev={() => setStep(Step.Borrow)}
        borrowValue={borrowValue}
        borrowType={type}
        collateralTypes={collateralByBorrow[type]}
      />
    ),
  }

  const handleClick = () => {
    setStep(Step.Borrow)
  }

  return (
    <div style={{ padding: '8px', border: '1px solid gray' }}>
      {!step && (
        <button type="button" onClick={handleClick}>
          {type} Borrow
        </button>
      )}
      {step && modalByStep[step]}
    </div>
  )
}

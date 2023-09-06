'use client'

import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { StakeNoPositionModal } from '../stake-no-position-modal'

interface Props {
  type: SupportedToken
  onSend: (value: Position) => void
  buttonText: string
}

export function SingleStakeFlow({ type, onSend, buttonText }: Props) {
  const [isModalOpen, setModalOpenStatus] = useState(false)

  const handleSend = (value: number) => {
    setModalOpenStatus(false)
    onSend({ debts: [], stakes: [{ value, type }] })
  }

  const handleClick = () => {
    setModalOpenStatus(true)
  }

  return (
    <div>
      {!isModalOpen && (
        <button type="button" onClick={handleClick}>
          {buttonText}
        </button>
      )}
      {isModalOpen && (
        <StakeNoPositionModal
          onClose={() => setModalOpenStatus(false)}
          onSend={handleSend}
          type={type}
        />
      )}
    </div>
  )
}

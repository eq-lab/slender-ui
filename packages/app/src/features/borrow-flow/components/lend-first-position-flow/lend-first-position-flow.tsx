'use client'

import React, { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { LendFirstPositionModal } from '../lend-first-position-modal'

interface Props {
  type: SupportedToken
  onSend: (value: Position) => void
  buttonText: string
}

export function LendFirstPositionFlow({ type, onSend, buttonText }: Props) {
  const [isModalOpen, setModalOpenStatus] = useState(false)

  const handleSend = (value: number) => {
    setModalOpenStatus(false)
    onSend({ debts: [], deposits: [{ value, type }] })
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
        <LendFirstPositionModal
          onClose={() => setModalOpenStatus(false)}
          onSend={handleSend}
          type={type}
        />
      )}
    </div>
  )
}

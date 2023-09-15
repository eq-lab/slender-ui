import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { LendFirstPositionModal } from '../components/lend-first-position-modal'

export const useLendFirstPosition = (
  token: SupportedToken,
): {
  modal: React.ReactNode
  open: () => void
} => {
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [isModalOpen, setModalOpenStatus] = useState(false)

  const handleSend = (value: string) => {
    setPosition({ debts: [], deposits: [{ token, value: BigInt(value) }] })
    setModalOpenStatus(false)
  }

  const modal = isModalOpen ? (
    <LendFirstPositionModal
      onClose={() => setModalOpenStatus(false)}
      onSend={handleSend}
      depositToken={token}
    />
  ) : null

  return { modal, open: () => setModalOpenStatus(true) }
}

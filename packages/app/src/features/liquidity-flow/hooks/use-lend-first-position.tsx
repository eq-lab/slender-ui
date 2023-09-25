import { useState } from 'react'
import { SupportedTokenName } from '@/shared/stellar/constants/tokens'
import { PositionCell } from '@/entities/position/types'
import { LendFirstPositionModal } from '../components/lend-first-position-modal'
import { useLiquidity } from './use-liquidity'

export const useLendFirstPosition = (
  tokenName: SupportedTokenName,
): {
  modal: JSX.Element | null
  open: () => void
} => {
  const [isModalOpen, setModalOpenStatus] = useState(false)
  const send = useLiquidity('deposit')

  const handleSend = async (value: PositionCell) => {
    setModalOpenStatus(false)
    await send({ deposits: [value] })
  }

  const modal = isModalOpen ? (
    <LendFirstPositionModal
      onClose={() => setModalOpenStatus(false)}
      onSend={handleSend}
      depositTokenName={tokenName}
    />
  ) : null

  return { modal, open: () => setModalOpenStatus(true) }
}

import { useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { LendFirstPositionModal } from '../components/lend-first-position-modal'
import { submitDeposit } from '../soroban/submit'
import { useLiquidity } from './use-liquidity'

export const useLendFirstPosition = (
  tokenName: SupportedToken,
): {
  modal: React.ReactNode
  open: () => void
} => {
  const [isModalOpen, setModalOpenStatus] = useState(false)
  const { send } = useLiquidity()

  const handleSend = async (value: string) => {
    setModalOpenStatus(false)
    send({ submitFunc: submitDeposit, deposits: [{ tokenName, value: BigInt(value) }] })
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

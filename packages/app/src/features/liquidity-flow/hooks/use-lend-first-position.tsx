import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { logError, logInfo } from '@/shared/logger'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { LendFirstPositionModal } from '../components/lend-first-position-modal'
import { submitDeposit } from '../soroban/submit'
import { PositionUpdate } from '../types'
import { useSetWaitModalIsOpen } from '../context/hooks'

export const useLendFirstPosition = (
  tokenName: SupportedToken,
): {
  modal: React.ReactNode
  open: () => void
} => {
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [isModalOpen, setModalOpenStatus] = useState(false)
  const setWaitModalIsOpen = useSetWaitModalIsOpen()
  const { address } = useWalletAddress()

  const handleSend = async (value: string) => {
    if (!address) return
    setModalOpenStatus(false)

    try {
      setWaitModalIsOpen(true)

      const deposits: PositionUpdate = { [tokenName]: BigInt(value) }

      logInfo(await submitDeposit(address, deposits))
      setPosition({ debts: [], deposits: [{ tokenName, value: BigInt(value) }] })
    } catch (e) {
      logError(e)
    } finally {
      setWaitModalIsOpen(false)
    }
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

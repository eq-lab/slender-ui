import { useContextSelector } from 'use-context-selector'
import { PositionContext } from '@/entities/position/context/context'
import { PositionCell } from '@/entities/position/types'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { logError, logInfo } from '@/shared/logger'
import { useSetWaitModalIsOpen } from '../context/hooks'
import { PositionUpdate } from '../types'
import { getPositionUpdateByCells } from '../soroban/get-position-update-by-cells'

type Send = (args: {
  submitFunc: (address: string, sendValue: PositionUpdate) => Promise<'fulfilled' | never>
  deposits?: PositionCell[]
  debts?: PositionCell[]
}) => void

export function useLiquidity(): {
  send: Send
} {
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const updatePosition = useContextSelector(PositionContext, (state) => state.updatePosition)
  const setWaitModalIsOpen = useSetWaitModalIsOpen()
  const { address } = useWalletAddress()
  const position = useContextSelector(PositionContext, (state) => state.position)

  const send: Send = async (args) => {
    if (!address) return

    try {
      setWaitModalIsOpen(true)

      const positionUpdate = getPositionUpdateByCells(args.deposits ?? args.debts ?? [])
      logInfo(await args.submitFunc(address, positionUpdate))

      const deposits = args.deposits ?? position?.deposits ?? []
      const debts = args.debts ?? position?.debts ?? []
      setPosition({ deposits, debts })
      updatePosition()
    } catch (e) {
      logError(e)
    } finally {
      setWaitModalIsOpen(false)
    }
  }

  return { send }
}

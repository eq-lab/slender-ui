import { useContextSelector } from 'use-context-selector'
import { PositionContext } from '@/entities/position/context/context'
import { PositionCell } from '@/entities/position/types'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { logError, logInfo } from '@/shared/logger'
import { useTokenCache } from '@/entities/token/context/hooks'
import { CachedTokens } from '@/entities/token/context/context'
import { useSetWaitModalIsOpen } from '../context/hooks'
import { PositionUpdate } from '../types'

export const getPositionUpdateByCells = (
  positionCells: PositionCell[],
  tokenCache: Partial<CachedTokens> = {},
): PositionUpdate =>
  positionCells.reduce((positionUpdate: PositionUpdate, item: PositionCell): PositionUpdate => {
    positionUpdate[item.tokenName] = item.value * BigInt(tokenCache[item.tokenName]?.decimals ?? 1)
    return positionUpdate
  }, {} as PositionUpdate)

export function useLiquidity(): (args: {
  submitFunc: (address: string, sendValue: PositionUpdate) => Promise<'fulfilled' | never>
  deposits?: PositionCell[]
  additionalDeposits?: PositionCell[]
  debts?: PositionCell[]
  additionalDebts?: PositionCell[]
}) => Promise<boolean> {
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const updatePosition = useContextSelector(PositionContext, (state) => state.updatePosition)
  const setWaitModalIsOpen = useSetWaitModalIsOpen()
  const { address } = useWalletAddress()
  const position = useContextSelector(PositionContext, (state) => state.position)
  const tokenInfo = useTokenCache()

  return async (args) => {
    if (!address) return false

    try {
      setWaitModalIsOpen(true)

      const positionUpdate = getPositionUpdateByCells(
        args.additionalDeposits ?? args.additionalDebts ?? args.deposits ?? args.debts ?? [],
        tokenInfo,
      )
      const result = await args.submitFunc(address, positionUpdate)
      logInfo(result)

      const deposits = args.deposits ?? args.additionalDeposits ?? position?.deposits ?? []
      const debts = args.debts ?? args.additionalDebts ?? position?.debts ?? []
      setPosition({ deposits, debts })
      updatePosition()
      return true
    } catch (e) {
      logError(e)
      return false
    } finally {
      setWaitModalIsOpen(false)
    }
  }
}

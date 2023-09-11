import { createContext } from 'use-context-selector'
import type { TokenAddress } from '@/shared/stellar/constants/tokens'
import { Underlying } from '@/shared/stellar/constants/tokens'

export type CachedTokens = Record<
  TokenAddress,
  {
    name: string
    symbol: string
    decimals: number
  }
>

export type PoolData = Record<
  Underlying,
  {
    discount: number
    liquidationPenalty: number
    utilizationCapacity: number
  }
>

export const MarketContext = createContext<{
  tokens?: Partial<CachedTokens>
  pool?: PoolData
}>({})

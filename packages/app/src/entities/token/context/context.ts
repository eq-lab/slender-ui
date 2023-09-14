import { createContext } from 'use-context-selector'
import type { TokenAddress } from '@/shared/stellar/constants/tokens'

export type CachedTokens = Record<
  TokenAddress,
  {
    name: string
    symbol: string
    decimals: number
  }
>

export type PoolData = Record<
  string,
  {
    discount: number
    liquidationPenalty: number
    utilizationCapacity: number
    borrowInterestRate: string
    lendInterestRate: string
  }
>

export const MarketContext = createContext<{
  tokens?: Partial<CachedTokens>
  pool?: PoolData
}>({})

import { createContext, useContextSelector } from 'use-context-selector'
import type { TokenAddress } from '@/shared/stellar/constants/tokens'

export type CachedTokens = Record<TokenAddress, { name: string; symbol: string; decimals: number }>

export const MarketContext = createContext<{
  tokens?: CachedTokens
}>({})

export const useMarketData = () => useContextSelector(MarketContext, (state) => state.tokens)

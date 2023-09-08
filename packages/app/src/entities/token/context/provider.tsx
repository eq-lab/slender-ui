'use client'

import React, { useEffect, useState } from 'react'
import { useMakeInvoke } from '@/shared/stellar/hooks/invoke'
import { decodeStr, decodeU32 } from '@/shared/stellar/decoders'

import {
  CACHED_TOKEN_ADDRESSES,
  CACHED_MARKET_ADDRESSES,
  Underlying,
} from '@/shared/stellar/constants/tokens'
import { ReserveData, getReserve } from '@bindings/pool'
import { CachedTokens, MarketContext, PoolData } from './context'
import { PERCENT_PRECISION } from '../contract-constants'

type Rest = [string, string, number]

export function TokenProvider({ children }: { children: JSX.Element }) {
  const [cachedTokens, setCachedTokens] = useState<CachedTokens>()
  const [marketData, setMarketData] = useState<PoolData>()
  const makeInvoke = useMakeInvoke()

  useEffect(() => {
    ;(async () => {
      // @ts-ignore
      const cacheTxs = CACHED_TOKEN_ADDRESSES.reduce((allTxs, tokenAddress) => {
        const invoke = makeInvoke(tokenAddress)
        return [
          ...allTxs,
          invoke('name', decodeStr),
          invoke('symbol', decodeStr),
          invoke('decimals', decodeU32),
        ]
      }, [])
      const marketTxs = CACHED_MARKET_ADDRESSES.map((asset) => getReserve({ asset }))
      const [restValues, marketValues] = (await Promise.all([
        Promise.all(cacheTxs),
        Promise.all(marketTxs),
      ])) as [[...Rest, ...Rest[]], ReserveData[]]

      const newCachedTokens = CACHED_TOKEN_ADDRESSES.reduce<CachedTokens>(
        (cached, tokenAddress) => {
          const name = restValues.shift() as string
          const symbol = restValues.shift() as string
          const decimals = restValues.shift() as number
          cached[tokenAddress] = { name, symbol, decimals }
          return cached
        },
        {} as CachedTokens,
      )
      setCachedTokens(newCachedTokens)

      const newMarketData = marketValues.reduce<PoolData>((cached, poolReserve, currentIndex) => {
        cached[CACHED_MARKET_ADDRESSES[currentIndex] as Underlying] = {
          // @ts-ignore
          discount: poolReserve.configuration.get('discount'),
          // @ts-ignore
          liquidationPenalty: poolReserve.configuration.get('liq_bonus') - PERCENT_PRECISION,
          // @ts-ignore
          utilizationCapacity: poolReserve.configuration.get('util_cap'),
        }
        return cached
      }, {} as PoolData)
      setMarketData(newMarketData)
    })()
  }, [makeInvoke])

  return (
    <MarketContext.Provider value={{ tokens: cachedTokens, pool: marketData }}>
      {children}
    </MarketContext.Provider>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { useMakeInvoke } from '@/shared/stellar/hooks/invoke'
import { decodeStr, decodeU32 } from '@/shared/stellar/decoders'

import { cachedTokenAddresses } from '@/shared/stellar/constants/tokens'
import { CachedTokens, MarketContext } from './context'

export function TokenProvider({ children }: { children: JSX.Element }) {
  const [cachedTokens, setCachedTokens] = useState<CachedTokens>()
  const makeInvoke = useMakeInvoke()

  useEffect(() => {
    ;(async () => {
      // @ts-ignore
      const txs = cachedTokenAddresses.reduce((allTxs, tokenAddress) => {
        const invoke = makeInvoke(tokenAddress)
        return [
          ...allTxs,
          invoke('name', decodeStr),
          invoke('symbol', decodeStr),
          invoke('decimals', decodeU32),
        ]
      }, [])
      let restValues = await Promise.all(txs)
      const newCachedTokens: Partial<CachedTokens> = {}
      cachedTokenAddresses.forEach((tokenAddress) => {
        const [name, symbol, decimals, ...rest] = restValues
        restValues = rest
        // @ts-ignore
        newCachedTokens[tokenAddress] = { name, symbol, decimals }
      })
      // @ts-ignore
      setCachedTokens(newCachedTokens)
    })()
  }, [makeInvoke])

  return (
    <MarketContext.Provider value={{ tokens: cachedTokens }}>{children}</MarketContext.Provider>
  )
}

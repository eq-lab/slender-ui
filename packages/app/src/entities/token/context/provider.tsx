'use client'

import React, { useEffect, useState } from 'react'
import { invoke, useMakeGetTx } from '@/shared/stellar/hooks/invoke'
import { decodeStr, decodeU32 } from '@/shared/stellar/decoders'

import { cachedTokenAddresses } from '@/shared/stellar/constants/tokens'
import { CachedTokens, MarketContext } from './context'

export function TokenProvider({ children }: { children: JSX.Element }) {
  const [cachedTokens, setCachedTokens] = useState<CachedTokens>()
  const makeGetTx = useMakeGetTx()

  useEffect(() => {
    ;(async () => {
      // @ts-ignore
      const txs = cachedTokenAddresses.reduce((allTxs, tokenAddress) => {
        const getTx = makeGetTx(tokenAddress)
        return [
          ...allTxs,
          invoke(getTx('name'), decodeStr),
          invoke(getTx('symbol'), decodeStr),
          invoke(getTx('decimals'), decodeU32),
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
  }, [makeGetTx])

  return (
    <MarketContext.Provider value={{ tokens: cachedTokens }}>{children}</MarketContext.Provider>
  )
}

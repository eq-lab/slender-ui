import * as SorobanClient from 'soroban-client'
import { useEffect, useState, useCallback } from 'react'
import { useContextSelector } from 'use-context-selector'
import { useMakeInvoke } from '@/shared/stellar/hooks/invoke'
import { decodei128 } from '@/shared/stellar/decoders'
import { TokenAddress } from '@/shared/stellar/constants/tokens'
import { MarketContext } from '../context/context'

export interface SorobanTokenRecord {
  balance: string
  name: string
  symbol: string
  decimals: number
}

const defaultTokenRecord = { name: '', symbol: '', decimals: 0 }

const encodeAddress = (account: string) => new SorobanClient.Address(account).toScVal()

export const useGetBalance = (tokenAddressArray: TokenAddress[], userAddress?: string) => {
  const [balanceInfo, setBalanceInfo] = useState<SorobanTokenRecord[] | null>(null)
  const makeInvoke = useMakeInvoke()
  const tokensCache = useContextSelector(MarketContext, (state) => state.tokens) // ?? defaultTokenRecord

  const getBalances = useCallback(async () => {
    if (!userAddress) {
      setBalanceInfo(null)
      return
    }
    const balanceTxParams = [encodeAddress(userAddress)]

    const balancesArray: SorobanTokenRecord[] = []

    await Promise.all(
      tokenAddressArray.map((tokenAddress) => {
        const tokenCache = tokensCache?.[tokenAddress] ?? defaultTokenRecord
        const invoke = makeInvoke(tokenAddress)
        return invoke('balance', decodei128, balanceTxParams).then((balance) => {
          balancesArray.push({ balance, ...tokenCache })
        })
      }),
    )
    setBalanceInfo(balancesArray)
  }, [makeInvoke, tokenAddressArray, userAddress, tokensCache])

  useEffect(() => {
    getBalances()
  }, [getBalances])

  return balanceInfo
}

import * as SorobanClient from 'soroban-client'
import { useEffect, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { useMakeInvoke } from '@/shared/stellar/hooks/invoke'
import { decodei128 } from '@/shared/stellar/decoders'
import { TokenAddress } from '@/shared/stellar/constants/tokens'
import { MarketContext } from '../context/context'

interface SorobanTokenRecord {
  balance: string
  name: string
  symbol: string
  decimals: number
}

const defaultTokenRecord = { name: '', symbol: '', decimals: 0 }

const encodeAddress = (account: string) => new SorobanClient.Address(account).toScVal()

export const useGetBalance = (tokenAddress: TokenAddress, userAddress?: string) => {
  const [balanceInfo, setBalanceInfo] = useState<SorobanTokenRecord | null>()
  const makeInvoke = useMakeInvoke()
  const tokenCache =
    useContextSelector(MarketContext, (state) => state.tokens?.[tokenAddress]) ?? defaultTokenRecord

  useEffect(() => {
    if (!userAddress) {
      setBalanceInfo(null)
      return
    }

    const invoke = makeInvoke(tokenAddress)
    const balanceTxParams = [encodeAddress(userAddress)]
    invoke('balance', decodei128, balanceTxParams).then((balance) => {
      setBalanceInfo({ balance, ...tokenCache })
    })
  }, [makeInvoke, tokenAddress, userAddress, tokenCache])

  return balanceInfo
}

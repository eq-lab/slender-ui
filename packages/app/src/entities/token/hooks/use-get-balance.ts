import * as SorobanClient from 'soroban-client'
import { useEffect, useRef, useState } from 'react'
import { useMakeInvoke } from '@/shared/stellar/hooks/invoke'
import { decodeI128 } from '@/shared/stellar/decoders'
import { TokenAddress } from '@/shared/stellar/constants/tokens'
import { useTokenCache } from '../context/context'

export interface SorobanTokenRecord {
  balance: string
  name: string
  symbol: string
  decimals: number
}

const defaultTokenRecord = { name: '', symbol: '', decimals: 0 }

const encodeAddress = (account: string) => new SorobanClient.Address(account).toScVal()

export const useGetBalance = (
  tokenAddresses: TokenAddress[],
  userAddress?: string,
): SorobanTokenRecord[] => {
  const [balanceInfo, setBalanceInfo] = useState<SorobanTokenRecord[]>([])
  const makeInvoke = useMakeInvoke()
  const tokensCache = useTokenCache()
  const cachedAddresses = useRef(tokenAddresses)

  useEffect(() => {
    async function updateBalances() {
      if (!userAddress) {
        setBalanceInfo([])
        return
      }
      const balanceTxParams = [encodeAddress(userAddress)]

      const balances: SorobanTokenRecord[] = (
        await Promise.all(
          tokenAddresses.map((tokenAddress) => {
            const invoke = makeInvoke(tokenAddress)
            return invoke('balance', decodeI128, balanceTxParams)
          }),
        )
      ).map((balance, index) => ({
        balance,
        ...(tokensCache?.[tokenAddresses[index] as TokenAddress] ?? defaultTokenRecord),
      }))

      setBalanceInfo(balances)
    }
    if (
      tokenAddresses.length !== cachedAddresses.current.length ||
      !tokenAddresses.every((address, index) => address === cachedAddresses.current[index])
    ) {
      cachedAddresses.current = tokenAddresses
      updateBalances()
    }
  }, [makeInvoke, tokenAddresses, userAddress, tokensCache])

  return balanceInfo
}

import { useEffect, useRef, useState } from 'react'
import { useMakeInvoke } from '@/shared/stellar/hooks/invoke'
import { decodeI128 } from '@/shared/stellar/decoders'
import { TokenAddress } from '@/shared/stellar/constants/tokens'
import { addressToScVal } from '@/shared/stellar/encoders'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { CachedTokens } from '../context/context'
import { useTokenCache } from '../context/hooks'

export interface SorobanTokenRecord {
  balance: string
  name: string
  symbol: string
  decimals: number
}

const defaultTokenRecord = { name: '', symbol: '', decimals: 0 }

const isArraysEqual = <T>(a?: T[], b?: T[]) =>
  a?.length === b?.length && a?.every((value, index) => value === b?.[index])

export const useGetBalance = (tokenAddresses: TokenAddress[]): SorobanTokenRecord[] => {
  const [balanceInfo, setBalanceInfo] = useState<SorobanTokenRecord[]>([])
  const makeInvoke = useMakeInvoke()
  const tokensCache = useTokenCache()
  const { address: userAddress } = useWalletAddress()

  const previousTokenAddresses = useRef<TokenAddress[]>()
  const previousUserAddress = useRef<string>()
  const previousTokensCache = useRef<Partial<CachedTokens>>()

  useEffect(() => {
    async function updateBalances() {
      if (!userAddress) {
        setBalanceInfo([])
        return
      }
      const balanceTxParams = [addressToScVal(userAddress)]

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
      !isArraysEqual(tokenAddresses, previousTokenAddresses.current) ||
      userAddress !== previousUserAddress.current ||
      tokensCache !== previousTokensCache.current
    ) {
      updateBalances()
    }
  }, [makeInvoke, tokenAddresses, userAddress, tokensCache])

  useEffect(() => {
    previousTokenAddresses.current = tokenAddresses
    previousUserAddress.current = userAddress
    previousTokensCache.current = tokensCache
  })

  return balanceInfo
}

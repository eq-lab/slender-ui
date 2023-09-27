import { useEffect, useRef, useState } from 'react'
import { useMakeInvoke } from '@/shared/stellar/hooks/use-make-invoke'
import { TokenAddress } from '@/shared/stellar/constants/tokens'
import { addressToScVal } from '@/shared/stellar/encoders'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import BigNumber from 'bignumber.js'
import { CachedTokens } from '../context/context'
import { useTokenCache } from '../context/hooks'

export interface SorobanTokenRecord {
  balance: BigNumber
  title: string
  symbol: string
  decimals: number
}

const defaultTokenRecord = { title: '', symbol: '', decimals: 0 }

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

      try {
        const balances: SorobanTokenRecord[] = (
          await Promise.all(
            tokenAddresses.map((tokenAddress) => {
              const invoke = makeInvoke(tokenAddress)
              return invoke<string>('balance', balanceTxParams)
            }),
          )
        ).map((balance, index) => {
          const tokenCache =
            tokensCache?.[tokenAddresses[index] as TokenAddress] ?? defaultTokenRecord
          return {
            balance: BigNumber(balance ?? 0).div(10 ** tokenCache.decimals),
            ...tokenCache,
          }
        })
        setBalanceInfo(balances)
      } catch (error) {
        setBalanceInfo([])
      }
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

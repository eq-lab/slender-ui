import { useMakeInvoke } from '@/shared/stellar/hooks/use-make-invoke'
import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTokenCache } from '@/entities/token/context/hooks'

interface TokenData {
  totalSupply: BigNumber
}

const defaultTokenData: TokenData = { totalSupply: BigNumber(0) }

export function useTokenData(sTokenAddress: string): TokenData {
  const [data, setData] = useState<TokenData>(defaultTokenData)
  const makeInvoke = useMakeInvoke()
  const invokeSToken = useMemo(() => makeInvoke(sTokenAddress), [makeInvoke, sTokenAddress])
  const tokensCache = useTokenCache()

  useEffect(() => {
    ;(async () => {
      const totalSupply = await invokeSToken<string>('total_supply')
      if (totalSupply) {
        setData({
          totalSupply: BigNumber(totalSupply).div(
            10 ** (tokensCache?.[sTokenAddress]?.decimals ?? 0),
          ),
        })
      }
    })()
  }, [invokeSToken, tokensCache, sTokenAddress])

  return data
}

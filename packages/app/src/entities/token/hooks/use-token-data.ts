import { useMakeInvoke } from '@/shared/stellar/hooks/invoke'
import { decodei128 } from '@/shared/stellar/decoders'
import { useEffect, useMemo, useState } from 'react'

interface TokenData {
  totalSupply: string
}

const defaultTokenData: TokenData = { totalSupply: '0' }

export function useTokenData(sTokenAddress: string): TokenData {
  const [data, setData] = useState<TokenData>(defaultTokenData)
  const makeInvoke = useMakeInvoke()
  const invokeSToken = useMemo(() => makeInvoke(sTokenAddress), [makeInvoke, sTokenAddress])

  useEffect(() => {
    ;(async () => {
      const totalSupply = await invokeSToken('total_supply', decodei128)
      setData({ totalSupply })
    })()
  }, [invokeSToken])

  return data
}

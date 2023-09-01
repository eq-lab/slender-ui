import { useEffect, useState } from 'react'
import { getReserve } from 'LendingPool'

const PERCENT_PRECISION = 1e4

type PoolData = {
  borrowInterestRate?: bigint
  lendInterestRate?: bigint
  discount?: number
  liquidationPenalty?: number
}

export function useMarketData(tokenAddress: string): PoolData & {
  percentMultiplier: number
} {
  const [data, setData] = useState<PoolData>({})

  useEffect(() => {
    ;(async () => {
      const poolResponse = await getReserve({
        asset: tokenAddress,
      })

      setData({
        borrowInterestRate: poolResponse.borrower_ir,
        lendInterestRate: poolResponse.lender_ir,
        // @ts-ignore
        discount: poolResponse.configuration.get('discount'),
        // @ts-ignore
        liquidationPenalty: poolResponse.configuration.get('liq_bonus') - PERCENT_PRECISION,
      })
    })()
  }, [tokenAddress])

  return {
    ...data,
    percentMultiplier: PERCENT_PRECISION,
  }
}

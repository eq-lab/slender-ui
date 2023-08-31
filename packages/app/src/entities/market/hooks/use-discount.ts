import { useEffect, useState } from 'react'
import { getReserve } from 'LendingPool'

const DISCOUNT_PRECISION = 10_000

export function useDiscount(tokenAddress: string): { discount?: number; multiplier: number } {
  const [discount, setDiscount] = useState<number>()

  useEffect(() => {
    ;(async () => {
      const methodResponse = await getReserve({
        asset: tokenAddress,
      })
      // @ts-ignore
      setDiscount(methodResponse.configuration.get('discount'))
    })()
  }, [tokenAddress])

  return { discount, multiplier: DISCOUNT_PRECISION }
}

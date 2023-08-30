import { useEffect, useState } from 'react'
import { getReserve } from 'LendingPool'

export function useDiscount(tokenAddress: string): number | undefined {
  const [entries, setEntries] = useState<number>()

  useEffect(() => {
    ;(async () => {
      const methodResponse = await getReserve({
        asset: tokenAddress,
      })
      // @ts-ignore
      setEntries(methodResponse.configuration.get('discount'))
    })()
  }, [tokenAddress])

  return entries
}

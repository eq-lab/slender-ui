import { Position as PositionType } from '@/entities/position/types'
import { tokens } from '@/shared/stellar/constants/tokens'
import { usePriceInUsd } from '@/entities/currency-rates/hooks/use-price-in-usd'
import { useMarketData } from '@/entities/token/context/context'

export const useDepositUsd = (collaterals?: PositionType['deposits']): number => {
  const priceInUsd = usePriceInUsd()
  const tokensCache = useMarketData()
  if (!tokensCache) {
    return 0
  }

  return (collaterals || []).reduce((sum, { token, value }) => {
    const { discount } = tokensCache[tokens[token].address]
    return sum + value * priceInUsd[token] * discount
  }, 0)
}

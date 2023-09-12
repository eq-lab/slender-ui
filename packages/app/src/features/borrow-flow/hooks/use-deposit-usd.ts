import { Position as PositionType } from '@/entities/position/types'
import { tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketData } from '@/entities/token/context/hooks'
import { usePriceInUsd } from '@/entities/currency-rates/context/hooks'

export const useDepositUsd = (collaterals?: PositionType['deposits']): number => {
  const priceInUsd = usePriceInUsd()
  const tokensCache = useMarketData()
  if (!tokensCache) {
    return 0
  }

  return (collaterals ?? []).reduce((sum, { token, value }) => {
    const { discount } = tokensCache[tokenContracts[token].address] ?? { discount: 0 }
    return sum + Number(value) * priceInUsd[token] * discount
  }, 0)
}

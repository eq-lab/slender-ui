import { Position as PositionType } from '@/entities/position/types'
import { tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketData } from '@/entities/token/context/hooks'
import { getDecimalDiscount } from '../../../shared/utils/get-decimal-discount'

export const useDepositUsd = (collaterals?: PositionType['deposits']): number => {
  const tokensCache = useMarketData()
  if (!tokensCache) {
    return 0
  }

  return (collaterals ?? []).reduce((sum, { tokenName, valueInUsd }) => {
    const { discount } = tokensCache[tokenContracts[tokenName].address] ?? { discount: 0 }
    return sum + (valueInUsd || 0) * getDecimalDiscount(discount)
  }, 0)
}

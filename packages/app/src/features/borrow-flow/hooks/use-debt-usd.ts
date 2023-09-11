import { Position as PositionType } from '@/entities/position/types'
import { usePriceInUsd } from '@/entities/currency-rates/context/hooks'

export const useDebtUsd = (debts: PositionType['debts'] = []): number => {
  const priceInUsd = usePriceInUsd()

  return debts.reduce(
    (sum, { token, value }) => (priceInUsd[token] ? sum + value * priceInUsd[token] : sum),
    0,
  )
}

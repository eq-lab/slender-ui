import { Position as PositionType } from '@/entities/position/types'
import { usePriceInUsd } from '@/entities/currency-rates/context/hooks'

export const useDebtUsd = (debts: PositionType['debts'] = []): number => {
  const priceInUsd = usePriceInUsd()

  return (
    priceInUsd &&
    debts.reduce(
      (sum, { token, value }) =>
        priceInUsd[token] ? sum + Number(value) * priceInUsd[token] : sum,
      0,
    )
  )
}

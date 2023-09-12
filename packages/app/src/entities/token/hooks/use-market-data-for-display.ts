import { TokenContracts } from '@/shared/stellar/constants/tokens'
import { usePoolData } from './use-pool-data'
import { useMarketData } from '../context/hooks'
import { useAvailableToBorrow } from './use-available-to-borrow'

const makeFormatPercentWithPrecision =
  (multiplier: number) =>
  (value?: number | bigint): string =>
    value === undefined ? '...' : `${+Number((Number(value) * 100) / multiplier).toFixed(1)}%`

export function useMarketDataForDisplay(token: TokenContracts): {
  discount: string
  liquidationPenalty: string
  borrowInterestRate: string
  lendInterestRate: string
  totalSupplied: number
  totalBorrowed: number
  reserved: number
  availableToBorrow: number
} {
  const { percentMultiplier, borrowInterestRate, lendInterestRate, contractMultiplier } =
    usePoolData(token.address)
  const marketData = useMarketData()
  const { discount, liquidationPenalty } = marketData?.[token.address] ?? {}

  const { availableToBorrow, reserved, totalBorrowed, totalSupplied } = useAvailableToBorrow(token)

  const formatPercentage = makeFormatPercentWithPrecision(percentMultiplier)
  const formatInterestRate = makeFormatPercentWithPrecision(contractMultiplier)

  return {
    discount: formatPercentage(discount),
    liquidationPenalty: formatPercentage(liquidationPenalty),
    borrowInterestRate: formatInterestRate(borrowInterestRate),
    lendInterestRate: formatInterestRate(lendInterestRate),
    totalSupplied,
    totalBorrowed,
    reserved,
    availableToBorrow,
  }
}

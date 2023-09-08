import { Token } from '@/shared/stellar/constants/tokens'
import { usePoolData } from './use-pool-data'
import { useMarketData, useTokenCache } from '../context/context'
import { useTokenData } from './use-token-data'

const makeFormatPercentWithPrecision =
  (multiplier: number) =>
  (value?: number | bigint): string =>
    value === undefined ? '...' : `${(Number(value) * 100) / multiplier}%`

export function useMarketDataForDisplay(token: Token): {
  discount: string
  liquidationPenalty: string
  borrowInterestRate: string
  lendInterestRate: string
  totalSupplied: number
  totalBorrowed: number
  reserved: number
  availableToBorrow: number
} {
  const {
    percentMultiplier,
    borrowInterestRate,
    lendInterestRate,
    contractMultiplier,
    collateralCoefficient = 0n,
    debtCoefficient = 0n,
  } = usePoolData(token.address)
  const marketData = useMarketData()
  const {
    discount,
    liquidationPenalty,
    utilizationCapacity = 0,
  } = marketData?.[token.address] ?? {}

  const tokenCache = useTokenCache()?.[token.address]
  const decimals = tokenCache?.decimals ?? 0

  const { totalSupply: sTotalSupply } = useTokenData(token.sAddress)
  const totalSupplied =
    ((Number(sTotalSupply) / contractMultiplier) * Number(collateralCoefficient)) / 10 ** decimals

  const { totalSupply: debtTotalSupply } = useTokenData(token.debtAddress)
  const totalBorrowed =
    ((Number(debtTotalSupply) / contractMultiplier) * Number(debtCoefficient)) / 10 ** decimals

  const reserved = totalSupplied * (1 - utilizationCapacity / percentMultiplier)

  const availableToBorrow = totalSupplied - totalBorrowed - reserved

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

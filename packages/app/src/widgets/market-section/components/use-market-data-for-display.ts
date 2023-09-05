import { Token } from '@/shared/stellar/constants/tokens'
import { usePoolData } from '@/entities/token/hooks/use-pool-data'
import { useContextSelector } from 'use-context-selector'
import { MarketContext } from '@/entities/token/context/context'
import { useTokenData } from '@/entities/token/hooks/use-token-data'

const makeFormatPercentWithPrecision =
  (multiplier: number) =>
  (value?: number | bigint): string =>
    value === undefined ? '...' : `${(Number(value) * 100) / multiplier}%`

export function useMarketDataForDisplay(token: Token) {
  const {
    discount,
    liquidationPenalty,
    percentMultiplier,
    borrowInterestRate,
    lendInterestRate,
    contractMultiplier,
    collateralCoefficient = 0n,
    debtCoefficient = 0n,
    utilizationCapacity = 0,
  } = usePoolData(token.address)

  const tokenCache = useContextSelector(MarketContext, (state) => state.tokens?.[token.address])
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

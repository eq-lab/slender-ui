import { usePoolData } from '@/entities/token/hooks/use-pool-data'
import { Token } from '@/shared/stellar/constants/tokens'
import { useContextSelector } from 'use-context-selector'
import { MarketContext } from '@/entities/token/context/context'
import { useTokenData } from '@/entities/token/hooks/use-token-data'

function useMarketDataForDisplay(token: Token) {
  const {
    discount,
    liquidationPenalty,
    borrowInterestRate,
    lendInterestRate,
    percentMultiplier,
    collateralCoefficient = 0n,
    debtCoefficient = 0n,
    utilizationCapacity = 0,
  } = usePoolData(token.address)

  const tokenCache = useContextSelector(MarketContext, (state) => state.tokens?.[token.address])
  const decimals = tokenCache?.decimals ?? 0

  const { totalSupply: sTotalSupply } = useTokenData(token.sAddress)
  const totalSupplied = Number(BigInt(sTotalSupply) * collateralCoefficient) / 10 ** decimals

  const { totalSupply: debtTotalSupply } = useTokenData(token.debtAddress)
  const totalBorrowed = Number(BigInt(debtTotalSupply) * debtCoefficient) / 10 ** decimals

  const reserved = totalSupplied * (1 - utilizationCapacity / percentMultiplier)

  const availableToBorrow = totalSupplied - totalBorrowed - reserved

  const formatPercentage = (value?: number | bigint): string =>
    value === undefined ? '...' : `${(Number(value) * 100) / percentMultiplier}%`

  return {
    discount: formatPercentage(discount),
    liquidationPenalty: formatPercentage(liquidationPenalty),
    borrowInterestRate: formatPercentage(borrowInterestRate),
    lendInterestRate: formatPercentage(lendInterestRate),
    totalSupplied,
    totalBorrowed,
    reserved,
    availableToBorrow,
  }
}

export function MarketCard({
  token,
  renderBorrowButton,
}: {
  token: Token
  renderBorrowButton: (percent: string) => React.ReactNode
}) {
  const {
    discount,
    liquidationPenalty,
    borrowInterestRate,
    lendInterestRate,
    totalSupplied,
    totalBorrowed,
    reserved,
    availableToBorrow,
  } = useMarketDataForDisplay(token)

  if (discount === undefined) {
    return 'Loading...'
  }

  return (
    <div>
      <hr />
      <h3 style={{ fontVariationSettings: '"wght" 700' }}>{token.title}</h3>
      <h4>{token.code}</h4>
      <p>Total Supplied: {totalSupplied}</p>
      <p>Total Borrowed: {totalBorrowed}</p>
      <p>Reserved: {reserved}</p>
      <p>Available to Borrow: {availableToBorrow}</p>
      <p>Discount: {discount}</p>
      <p>Liquidation penalty: &minus;{liquidationPenalty}</p>
      {renderBorrowButton(borrowInterestRate)}
      <button type="button">+{lendInterestRate} Lend</button>
    </div>
  )
}

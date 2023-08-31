import { useMarketData } from '@/entities/market/hooks/use-market-data'
import { Token } from '@/shared/stellar-constants/tokens'

export function MarketCard({ token }: { token: Token }) {
  const { discount, liquidationPenalty, borrowInterestRate, lendInterestRate, percentMultiplier } =
    useMarketData(token.address)

  if (discount === undefined) {
    return 'Loading...'
  }

  const formatPercentage = (value?: number | bigint): string =>
    value === undefined ? '...' : `${(Number(value) * 100) / percentMultiplier}%`

  return (
    <div>
      <hr />
      <h3 style={{ fontVariationSettings: '"wght" 700' }}>{token.title}</h3>
      <h4>{token.code}</h4>
      <p>Discount: {formatPercentage(discount)}</p>
      <p>Liquidation penalty: &minus;{formatPercentage(liquidationPenalty)}</p>
      <button type="button">&minus;{formatPercentage(borrowInterestRate)} Borrow</button>
      <button type="button">+{formatPercentage(lendInterestRate)} Lend</button>
    </div>
  )
}

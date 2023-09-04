import { usePoolData } from '@/entities/token/hooks/use-pool-data'
import { Token } from '@/shared/stellar/constants/tokens'

export function MarketCard({
  token,
  renderBorrowButton,
}: {
  token: Token
  renderBorrowButton: (percent: string) => React.ReactNode
}) {
  const { discount, liquidationPenalty, borrowInterestRate, lendInterestRate, percentMultiplier } =
    usePoolData(token.address)

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
      {renderBorrowButton(formatPercentage(borrowInterestRate))}
      <button type="button">+{formatPercentage(lendInterestRate)} Lend</button>
    </div>
  )
}

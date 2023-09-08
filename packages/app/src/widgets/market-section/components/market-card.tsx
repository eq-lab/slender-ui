import { Token } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'

export function MarketCard({
  token,
  renderBorrowButton,
  renderLendButton,
}: {
  token: Token
  renderBorrowButton: (percent: string) => React.ReactNode
  renderLendButton: (percent: string) => React.ReactNode
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
      {renderLendButton(lendInterestRate)}
    </div>
  )
}

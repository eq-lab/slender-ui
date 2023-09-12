import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useTokenCache } from '@/entities/token/context/hooks'
import { useLendFirstPosition } from '@/features/borrow-flow/hooks/use-lend-first-position'
import { useBorrowFirstPosition } from '@/features/borrow-flow/hooks/use-borrow-first-position'

export function MarketCard({ tokenName }: { tokenName: SupportedToken }) {
  const { modal: lendModal, open: lendOpen } = useLendFirstPosition(tokenName)
  const { modal: borrowModal, open: borrowOpen } = useBorrowFirstPosition(tokenName)
  const token = tokenContracts[tokenName]
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
  const tokenCache = useTokenCache()?.[token.address]

  if (discount === undefined) {
    return 'Loading...'
  }

  return (
    <div>
      <hr />
      <h3 style={{ fontVariationSettings: '"wght" 700' }}>{tokenCache?.name}</h3>
      <h4>{tokenCache?.symbol}</h4>
      <p>Total Supplied: {totalSupplied}</p>
      <p>Total Borrowed: {totalBorrowed}</p>
      <p>Reserved: {reserved}</p>
      <p>Available to Borrow: {availableToBorrow}</p>
      <p>Discount: {discount}</p>
      <p>Liquidation penalty: &minus;{liquidationPenalty}</p>
      <button type="button" onClick={borrowOpen}>
        {`-${borrowInterestRate} Borrow`}
      </button>
      <button type="button" onClick={lendOpen}>
        {`+${lendInterestRate} Lend`}
      </button>
      {lendModal}
      {borrowModal}
    </div>
  )
}

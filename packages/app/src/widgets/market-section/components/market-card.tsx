import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useTokenCache } from '@/entities/token/context/hooks'
import { useLendFirstPosition } from '@/features/borrow-flow/hooks/use-lend-first-position'
import { useLendIncrease } from '@/features/borrow-flow/hooks/use-lend-increase'
import { useBorrowFirstPosition } from '@/features/borrow-flow/hooks/use-borrow-first-position'
import { useBorrowIncrease } from '@/features/borrow-flow/hooks/use-borrow-increase'
import { useActionModal } from '../hooks/use-action-modal'

export function MarketCard({ tokenName }: { tokenName: SupportedToken }) {
  const token = tokenContracts[tokenName]

  const {
    modal: lendModal,
    open: lendOpen,
    disabled: lendDisabled,
  } = useActionModal({
    tokenName,
    useFirstPosition: useLendFirstPosition,
    useIncrease: useLendIncrease,
    type: 'lend',
  })

  const {
    modal: borrowModal,
    open: borrowOpen,
    disabled: borrowDisabled,
  } = useActionModal({
    tokenName,
    useFirstPosition: useBorrowFirstPosition,
    useIncrease: useBorrowIncrease,
    type: 'borrow',
  })

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
      <button type="button" onClick={borrowOpen} disabled={borrowDisabled}>
        {`-${borrowInterestRate} Borrow`}
      </button>
      <button type="button" onClick={lendOpen} disabled={lendDisabled}>
        {`+${lendInterestRate} Lend`}
      </button>
      {lendModal}
      {borrowModal}
    </div>
  )
}

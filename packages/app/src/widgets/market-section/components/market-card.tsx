import { useDiscount } from '@/entities/market/hooks/use-discount'
import { Token } from '@/shared/stellar-constants/tokens'

export function MarketCard({ token }: { token: Token }) {
  const discount = useDiscount(token.address)

  if (discount === undefined) {
    return 'Loading...'
  }
  return <div>Discount: {Math.round(discount / 100)}%</div>
}

import { useDiscount } from '@/entities/market/hooks/use-discount'
import { Token } from '@/shared/stellar-constants/tokens'

export function MarketCard({ token }: { token: Token }) {
  const { discount, multiplier } = useDiscount(token.address)

  if (discount === undefined) {
    return 'Loading...'
  }
  return <div>Discount: {(discount * 100) / multiplier}%</div>
}

import { MarketCard } from '@/widgets/market-section/components/market-card'
import { SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'
import Typography from '@marginly/ui/components/typography'

export function MarketSection() {
  return (
    <div>
      <Typography title>Market</Typography>
      {SUPPORTED_TOKENS.map((tokenName) => (
        <MarketCard key={tokenName} tokenName={tokenName} />
      ))}
    </div>
  )
}

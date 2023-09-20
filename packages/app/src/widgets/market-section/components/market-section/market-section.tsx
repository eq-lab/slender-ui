import { MarketCard } from '@/widgets/market-section/components/market-card/market-card'
import { SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'
import Typography from '@marginly/ui/components/typography'
import { MarketSectionWrapper } from './styled'

export function MarketSection() {
  return (
    <section>
      <Typography title>Market</Typography>
      <MarketSectionWrapper>
        {SUPPORTED_TOKENS.map((tokenName) => (
          <MarketCard key={tokenName} tokenName={tokenName} />
        ))}
      </MarketSectionWrapper>
    </section>
  )
}

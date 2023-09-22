import { MarketCard } from '@/widgets/market-section/components/market-card/market-card'
import { SUPPORTED_TOKEN_NAMES } from '@/shared/stellar/constants/tokens'
import Typography from '@marginly/ui/components/typography'
import { MarketSectionWrapper, MarketSectionItemsWrapper } from './styled'

export function MarketSection() {
  return (
    <MarketSectionWrapper>
      <Typography title>Market</Typography>
      <MarketSectionItemsWrapper>
        {SUPPORTED_TOKEN_NAMES.map((tokenName) => (
          <MarketCard key={tokenName} tokenName={tokenName} />
        ))}
      </MarketSectionItemsWrapper>
    </MarketSectionWrapper>
  )
}

import { MarketCard } from '@/widgets/market-section/components/market-card/market-card'
import { SUPPORTED_TOKEN_NAMES } from '@/shared/stellar/constants/tokens'
import * as S from './styled'

export function MarketSection() {
  return (
    <S.MarketSectionWrapper>
      <S.Typography title>Market</S.Typography>
      <S.MarketSectionItemsWrapper>
        {SUPPORTED_TOKEN_NAMES.map((tokenName) => (
          <MarketCard key={tokenName} tokenName={tokenName} />
        ))}
      </S.MarketSectionItemsWrapper>
    </S.MarketSectionWrapper>
  )
}

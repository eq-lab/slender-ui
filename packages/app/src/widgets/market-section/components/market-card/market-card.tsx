import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useTokenCache } from '@/entities/token/context/hooks'
import { useLendFirstPosition } from '@/features/liquidity-flow/hooks/use-lend-first-position'
import { useLendIncrease } from '@/features/liquidity-flow/hooks/use-lend-increase'
import { useBorrowFirstPosition } from '@/features/liquidity-flow/hooks/use-borrow-first-position'
import { useBorrowIncrease } from '@/features/liquidity-flow/hooks/use-borrow-increase'
import { colorByToken } from '@/entities/token/constants/token-colors'
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name'
import { PercentPieChart } from './percent-pie-chart'
import { useActionModal } from '../../hooks/use-action-modal'
import * as S from './styled'

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
    availableToBorrow,
  } = useMarketDataForDisplay(token)
  const tokenCache = useTokenCache()?.[token.address]

  const tokenBackgroundColor = colorByToken[tokenName]
  const TokenIcon = getIconByTokenName(tokenName)

  const availablePercent = +Number((availableToBorrow / totalSupplied) * 100).toFixed() || 0

  if (discount === undefined) {
    return 'Loading...'
  }

  return (
    <S.MarketCardWrapper>
      <S.MarketCardUpperContainer $backgroundColor={tokenBackgroundColor}>
        <S.MarketCardHeadingContainer>
          <div className="token-name">{tokenCache?.name}</div>
          <div className="token-symbol">{tokenCache?.symbol}</div>
          <div className="token-icon">
            <TokenIcon />
          </div>
        </S.MarketCardHeadingContainer>
        <S.MarketCardPoolInfoContainer>
          <div className="piechart-container">
            <PercentPieChart percent={availablePercent} />
          </div>
          <div className="total-available">{availableToBorrow} available</div>
          <div className="total-supplied">From {totalSupplied}</div>
        </S.MarketCardPoolInfoContainer>
      </S.MarketCardUpperContainer>
      <S.MarketCardBottomContainer>
        <S.MarketCardBottomInfo>
          <S.MarketCardTextCell>
            <div className="tooltip-container">i</div>
            <div className="upper-text-container">Discount:</div>
            <div className="bottom-text-container">{discount}</div>
          </S.MarketCardTextCell>
          <S.MarketCardTextCell>
            <div className="tooltip-container">i</div>
            <div className="upper-text-container">Liquidation penalty:</div>
            <div className="bottom-text-container">{liquidationPenalty}</div>
          </S.MarketCardTextCell>
        </S.MarketCardBottomInfo>
        <S.MarketCardButtonsContainer>
          <button type="button" onClick={borrowOpen} disabled={borrowDisabled}>
            {`-${borrowInterestRate} Borrow`}
          </button>
          <button type="button" onClick={lendOpen} disabled={lendDisabled}>
            {`+${lendInterestRate} Lend`}
          </button>
        </S.MarketCardButtonsContainer>
      </S.MarketCardBottomContainer>
      {lendModal}
      {borrowModal}
    </S.MarketCardWrapper>
  )
}

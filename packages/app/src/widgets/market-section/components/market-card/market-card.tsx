import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens';
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display';
import { useTokenCache } from '@/entities/token/context/hooks';
import Typography from '@marginly/ui/components/typography';
import { useLendFirstPosition } from '@/features/liquidity-flow/hooks/use-lend-first-position';
import { useLendIncrease } from '@/features/liquidity-flow/hooks/use-lend-increase';
import { useBorrowFirstPosition } from '@/features/liquidity-flow/hooks/use-borrow-first-position';
import { useBorrowIncrease } from '@/features/liquidity-flow/hooks/use-borrow-increase';
import { colorByToken } from '@/entities/token/constants/token-colors';
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name';
import { TooltipText } from '@/shared/components/tooltip';
import { formatCompactCryptoCurrency } from '@/shared/formatters';
import { PercentPieChart } from './percent-pie-chart';
import { useActionModal } from '../../hooks/use-action-modal';
import { TooltipThumbnail } from './tooltip-thumbnail';
import * as S from './styled';

export function MarketCard({ tokenName }: { tokenName: SupportedTokenName }) {
  const token = tokenContracts[tokenName];

  const {
    modal: lendModal,
    open: lendOpen,
    disabled: lendDisabled,
  } = useActionModal({
    tokenName,
    useFirstPosition: useLendFirstPosition,
    useIncrease: useLendIncrease,
    type: 'lend',
  });

  const {
    modal: borrowModal,
    open: borrowOpen,
    disabled: borrowDisabled,
  } = useActionModal({
    tokenName,
    useFirstPosition: useBorrowFirstPosition,
    useIncrease: useBorrowIncrease,
    type: 'borrow',
  });

  const {
    discount,
    borrowInterestRate,
    lendInterestRate,
    totalSupplied,
    totalBorrowed,
    reserved,
    availableToBorrow,
  } = useMarketDataForDisplay(token);
  const tokenCache = useTokenCache()?.[token.address];

  const tokenBackgroundColor = colorByToken[tokenName];
  const TokenIcon = getIconByTokenName(tokenName);

  const availablePercent = +Number((availableToBorrow / totalSupplied) * 100).toFixed() || 0;

  const totalSuppliedAmount = Math.floor(totalSupplied);
  const availableToBorrowAmount = Math.floor(availableToBorrow);

  if (discount === undefined) {
    return 'Loading...';
  }

  return (
    <S.MarketCardWrapper>
      <S.MarketCardUpperContainer $backgroundColor={tokenBackgroundColor}>
        <S.MarketCardHeadingContainer>
          <Typography headerS className="token-name">
            {tokenCache?.title}
          </Typography>
          <Typography className="token-symbol">{tokenCache?.symbol}</Typography>
          <div className="token-icon">
            <TokenIcon />
          </div>
        </S.MarketCardHeadingContainer>
        <S.MarketCardPoolInfoContainer>
          <div className="piechart-with-tooltip-wrapper">
            <div className="piechart-with-tooltip-container">
              <PercentPieChart percent={availablePercent} />
              <TooltipThumbnail withThumbnail>
                <TooltipText>
                  {formatCompactCryptoCurrency(totalSuppliedAmount)} Total Supplied
                </TooltipText>
                <TooltipText>
                  {formatCompactCryptoCurrency(totalBorrowed)} Total Borrowed
                </TooltipText>
                <TooltipText>{formatCompactCryptoCurrency(reserved)} Reserved</TooltipText>
                <TooltipText>
                  {formatCompactCryptoCurrency(availableToBorrowAmount)} Available to Borrow
                </TooltipText>
              </TooltipThumbnail>
            </div>
          </div>
          <Typography className="total-available">
            {formatCompactCryptoCurrency(availableToBorrowAmount)} available
          </Typography>
          <Typography caption className="total-supplied">
            From {formatCompactCryptoCurrency(totalSuppliedAmount)}
          </Typography>
        </S.MarketCardPoolInfoContainer>
      </S.MarketCardUpperContainer>
      <S.MarketCardBottomContainer>
        <S.MarketCardBottomInfo>
          <S.MarketCardTextCell>
            <div className="tooltip-container">
              <TooltipThumbnail>
                <TooltipText>
                  Only {discount} of the asset’s value <br /> counts as collateral
                </TooltipText>
              </TooltipThumbnail>
            </div>
            <Typography className="upper-text-container" caption secondary>
              Discount:
            </Typography>
            <Typography className="bottom-text-container">{discount}</Typography>
          </S.MarketCardTextCell>
        </S.MarketCardBottomInfo>
        <S.MarketCardButtonsContainer>
          <S.MarketCardButton md elevated onClick={borrowOpen} disabled={borrowDisabled}>
            {`-${borrowInterestRate} Borrow`}
          </S.MarketCardButton>
          <S.MarketCardButton md elevated onClick={lendOpen} disabled={lendDisabled} $isLend>
            {`+${lendInterestRate} Lend`}
          </S.MarketCardButton>
        </S.MarketCardButtonsContainer>
      </S.MarketCardBottomContainer>
      {lendModal}
      {borrowModal}
    </S.MarketCardWrapper>
  );
}

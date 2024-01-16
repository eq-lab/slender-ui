import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens';
import { useGetBalance } from '@/entities/token/hooks/use-get-balance';
import { useMarketData, useTokenCache } from '@/entities/token/context/hooks';
import { usePriceInUsd } from '@/entities/currency-rates/context/hooks';
import BigNumber from 'bignumber.js';
import { getDecimalDiscount } from '../../../shared/utils/get-decimal-discount';

export function useTokenInfo(tokenName?: SupportedTokenName): {
  userBalance: BigNumber;
  discount: number;
  priceInUsd: number;
  decimals: number;
} {
  const marketData = useMarketData();
  const tokenCache = useTokenCache();
  const priceInUsdList = usePriceInUsd();
  const address = tokenName && tokenContracts[tokenName].address;
  const {
    value: [balance],
  } = useGetBalance(address ? [address] : []);

  if (tokenName && address) {
    const { discount = 0 } = marketData?.[address] ?? {};
    const { decimals = 0 } = tokenCache?.[address] ?? {};
    const priceInUsd = priceInUsdList?.[tokenName] ?? 0;
    const userBalance = balance?.balance ?? BigNumber(0);

    return {
      discount: getDecimalDiscount(discount),
      priceInUsd,
      userBalance,
      decimals,
    };
  }

  return {
    discount: 0,
    priceInUsd: 1,
    userBalance: BigNumber(0),
    decimals: 0,
  };
}

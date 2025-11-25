import { TokenContracts } from '@/shared/stellar/constants/tokens';
import { usePoolData } from './use-pool-data';
import { useMarketData } from '../context/hooks';
import { useAvailableToBorrow } from './use-available-to-borrow';
import { makeFormatPercentWithPrecision } from '../utils/make-format-percent-with-precision';

export function useMarketDataForDisplay(token: TokenContracts): {
  borrowInterestRate: string;
  lendInterestRate: string;
  totalSupplied: number;
  totalBorrowed: number;
  reserved: number;
  availableToBorrow: number;
  percentMultiplier: number;
  discount: number | undefined;
} {
  const { percentMultiplier, borrowInterestRate, lendInterestRate, contractMultiplier } =
    usePoolData(token.address);
  const marketData = useMarketData();
  const { discount } = marketData?.[token.address] ?? {};

  const { availableToBorrow, reserved, totalBorrowed, totalSupplied } = useAvailableToBorrow(token);

  const formatInterestRate = makeFormatPercentWithPrecision(contractMultiplier);

  return {
    discount,
    borrowInterestRate: formatInterestRate(borrowInterestRate?.toNumber()),
    lendInterestRate: formatInterestRate(lendInterestRate?.toNumber()),
    totalSupplied,
    totalBorrowed,
    reserved,
    availableToBorrow,
    percentMultiplier,
  };
}

import { TokenContracts } from '@/shared/stellar/constants/tokens';
import { usePoolData } from './use-pool-data';
import { useTokenData } from './use-token-data';
import { useMarketData } from '../context/hooks';

export function useAvailableToBorrow(token: TokenContracts): {
  totalSupplied: number;
  totalBorrowed: number;
  reserved: number;
  availableToBorrow: number;
} {
  const {
    percentMultiplier,
    contractMultiplier,
    collateralCoefficient = 0n,
    debtCoefficient = 0n,
  } = usePoolData(token.address);

  const marketData = useMarketData();

  const { totalSupply: debtTotalSupply } = useTokenData(token.debtAddress);
  const { totalSupply: sTotalSupply } = useTokenData(token.sAddress);

  const { utilizationCapacity = 0 } = marketData?.[token.address] ?? {};

  const totalSupplied = (Number(sTotalSupply) / contractMultiplier) * Number(collateralCoefficient);

  const reserved = totalSupplied * (1 - utilizationCapacity / percentMultiplier);

  const totalBorrowed = (Number(debtTotalSupply) / contractMultiplier) * Number(debtCoefficient);

  const availableToBorrow = Math.max(totalSupplied - totalBorrowed - reserved, 0);

  return { availableToBorrow, reserved, totalBorrowed, totalSupplied };
}

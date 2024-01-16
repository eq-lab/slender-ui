import { Position as PositionType } from '@/entities/position/types';
import { useMarketData } from '@/entities/token/context/hooks';

export const useDepositUsd = (collaterals?: PositionType['deposits']): number => {
  const tokensCache = useMarketData();
  if (!tokensCache) {
    return 0;
  }

  return (collaterals ?? []).reduce((sum, { valueInUsd }) => sum + (valueInUsd || 0), 0);
};

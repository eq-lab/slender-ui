import { useTokenCache } from '@/entities/token/context/hooks';
import { tokenContracts } from '@/shared/stellar/constants/tokens';
import { useMakeInvoke } from '@/shared/stellar/hooks/use-make-invoke';
import { networks, PoolConfig } from '@bindings/pool';
import { useEffect, useState } from 'react';

export function useMinDebtUsd() {
  const makeInvoke = useMakeInvoke();

  const [minDebt, setMinDebt] = useState<number>();
  const tokenCache = useTokenCache();

  useEffect(() => {
    (async () => {
      const poolInvoke = makeInvoke(networks.unknown.contractId);
      const data = await poolInvoke<PoolConfig>('pool_configuration');
      setMinDebt(Number(data?.min_debt_amount ?? 0));
    })();
  }, []);

  if (!tokenCache || !minDebt) return 0;

  const decimalsUsdc = tokenCache[tokenContracts['usdc'].address]?.decimals ?? 0;
  const minDebtUsd = minDebt / 10 ** decimalsUsdc;

  return minDebtUsd;
}

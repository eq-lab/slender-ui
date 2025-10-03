import { useEffect, useState } from 'react';
import { networks, ReserveData } from '@bindings/pool';
import { i128 } from '@stellar/stellar-sdk/lib/contract';
import { TokenAddress } from '@/shared/stellar/constants/tokens';
import { useMakeInvoke } from '@/shared/stellar/hooks/use-make-invoke';
import { addressToScVal } from '@/shared/stellar/encoders';
import BigNumber from 'bignumber.js';
import { CONTRACT_MATH_PRECISION, PERCENT_PRECISION } from '../constants/contract-constants';

type PoolData = {
  borrowInterestRate?: BigNumber;
  lendInterestRate?: BigNumber;
  collateralCoefficient?: BigNumber;
  debtCoefficient?: BigNumber;
};

const getBigNumber = (value?: bigint): BigNumber => new BigNumber(value?.toString() ?? 0);

export function usePoolData(tokenAddress: TokenAddress): PoolData & {
  percentMultiplier: number;
  contractMultiplier: number;
} {
  const [data, setData] = useState<PoolData>({});
  const makeInvoke = useMakeInvoke();

  useEffect(() => {
    (async () => {
      const invoke = makeInvoke(networks.unknown.contractId);
      const assetArg = [addressToScVal(tokenAddress)];
      const [poolReserve, collateralCoefficient, debtCoefficient] = await Promise.all([
        invoke<ReserveData>('get_reserve', assetArg),
        invoke<i128>('collat_coeff', assetArg),
        invoke<i128>('debt_coeff', assetArg),
      ]);

      setData({
        borrowInterestRate: getBigNumber(poolReserve?.borrower_ir),
        lendInterestRate: getBigNumber(poolReserve?.lender_ir),
        collateralCoefficient: getBigNumber(collateralCoefficient ?? undefined),
        debtCoefficient: getBigNumber(debtCoefficient ?? undefined),
      });
    })();
  }, [tokenAddress, makeInvoke]);

  return {
    ...data,
    percentMultiplier: PERCENT_PRECISION,
    contractMultiplier: CONTRACT_MATH_PRECISION,
  };
}

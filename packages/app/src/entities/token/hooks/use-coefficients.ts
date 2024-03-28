import { useEffect, useState } from 'react';
import { i128, networks } from '@bindings/pool';
import { useMakeInvoke } from '@/shared/stellar/hooks/use-make-invoke';
import { addressToScVal } from '@/shared/stellar/encoders';
import BigNumber from 'bignumber.js';
import {
  SUPPORTED_TOKEN_NAMES,
  SupportedTokenName,
  tokenContracts,
} from '@/shared/stellar/constants/tokens';
import * as StellarSdk from '@stellar/stellar-sdk';
import { CONTRACT_MATH_PRECISION } from '@/entities/token/constants/contract-constants';

type TokenCoefficients = Record<
  SupportedTokenName,
  {
    collateralCoefficient?: BigNumber;
    debtCoefficient?: BigNumber;
  }
>;

const getArgFromTokenName = (tokenName: SupportedTokenName): [StellarSdk.xdr.ScVal] => [
  addressToScVal(tokenContracts[tokenName].address),
];

const getBigNumberCoefficient = (value?: bigint): BigNumber =>
  value ? new BigNumber(value.toString()).div(CONTRACT_MATH_PRECISION) : new BigNumber(1);

export function useCoefficients(): TokenCoefficients | undefined {
  const [data, setData] = useState<TokenCoefficients>();
  const makeInvoke = useMakeInvoke();

  useEffect(() => {
    (async () => {
      const invoke = makeInvoke(networks.unknown.contractId);
      const collateralPromises = SUPPORTED_TOKEN_NAMES.map((tokenName) =>
        invoke<i128>('collat_coeff', getArgFromTokenName(tokenName)),
      );
      const debtPromises = SUPPORTED_TOKEN_NAMES.map((tokenName) =>
        invoke<i128>('debt_coeff', getArgFromTokenName(tokenName)),
      );
      const [collateralCoefficient, debtCoefficient] = await Promise.all([
        Promise.all(collateralPromises),
        Promise.all(debtPromises),
      ]);
      const result = SUPPORTED_TOKEN_NAMES.reduce<TokenCoefficients>(
        (all, tokenName, index) => ({
          ...all,
          [tokenName]: {
            collateralCoefficient: getBigNumberCoefficient(collateralCoefficient[index]),
            debtCoefficient: getBigNumberCoefficient(debtCoefficient[index]),
          },
        }),
        {} as TokenCoefficients,
      );

      setData(result);
    })();
  }, [makeInvoke]);

  return data;
}

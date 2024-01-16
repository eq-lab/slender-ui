import { networks } from '@bindings/pool';
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens';
import { logInfo } from '@/shared/logger';
import { addressToScVal, bigintToScVal } from '@/shared/stellar/encoders';
import { useMakeInvoke } from '@/shared/stellar/hooks/use-make-invoke';
import { SorobanRpc } from 'soroban-client';
import BigNumber from 'bignumber.js';
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name';
import { MAX_POSITION } from '@/features/liquidity-flow/constants';
import { PositionUpdate } from '../types';

const USER_DECLINED_ERROR = 'User declined access';
export type PoolMethodName = 'borrow' | 'deposit' | 'repay' | 'withdraw';
const WITH_TO: PoolMethodName = 'withdraw';

export const useSubmit = (methodName: PoolMethodName) => {
  const makeInvoke = useMakeInvoke();
  const invoke = makeInvoke(networks.futurenet.contractId);
  const getTokenByTokenName = useGetTokenByTokenName();

  const runLiquidityBinding = async ({
    who,
    asset,
    amount,
  }: {
    who: string;
    asset: string;
    amount: BigNumber;
  }) =>
    invoke<
      | string
      | SorobanRpc.SimulateTransactionResponse
      | SorobanRpc.SendTransactionResponse
      | SorobanRpc.GetTransactionResponse
    >(methodName, [
      addressToScVal(who),
      addressToScVal(asset),
      bigintToScVal(amount),
      ...(methodName === WITH_TO ? [addressToScVal(who)] : []),
    ]);

  return async (address: string, sendValue: PositionUpdate): Promise<'fulfilled' | never> => {
    // we have to sign and send transactions one by one
    // eslint-disable-next-line no-restricted-syntax
    for (const [tokenName, value] of Object.entries(sendValue) as [
      SupportedTokenName,
      BigNumber,
    ][]) {
      if (!value?.isNaN() && !value?.isZero()) {
        try {
          const token = getTokenByTokenName(tokenName);
          const amount = value.eq(MAX_POSITION)
            ? MAX_POSITION
            : value.times(10 ** (token?.decimals ?? 0)).dp(0);
          // that's exactly what we want
          // eslint-disable-next-line no-await-in-loop
          const result = await runLiquidityBinding({
            who: address,
            asset: tokenContracts[tokenName].address,
            amount,
          });
          logInfo('Tx result:', result);
        } catch (e) {
          if (e === USER_DECLINED_ERROR) {
            throw Error('rejected');
          }
          throw e;
        }
      }
    }
    return 'fulfilled';
  };
};

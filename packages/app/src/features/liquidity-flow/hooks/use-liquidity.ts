import { useContextSelector } from 'use-context-selector';
import { PositionContext } from '@/entities/position/context/context';
import { PositionCell } from '@/entities/position/types';
import { useWalletAddress } from '@/shared/contexts/use-wallet-address';
import { logError, logInfo } from '@/shared/logger';
import { useSetWaitModalIsOpen } from '../context/hooks';
import { PositionUpdate } from '../types';
import { useSubmit, PoolMethodName } from '../soroban/submit';

export const getPositionUpdateByCells = (positionCells: PositionCell[]): PositionUpdate =>
  positionCells.reduce((positionUpdate: PositionUpdate, item: PositionCell): PositionUpdate => {
    positionUpdate[item.tokenName] = item.value;
    return positionUpdate;
  }, {} as PositionUpdate);

export function useLiquidity(
  methodName: PoolMethodName,
): (parameters: {
  deposits?: PositionCell[];
  additionalDeposits?: PositionCell[];
  debts?: PositionCell[];
  additionalDebts?: PositionCell[];
}) => Promise<boolean> {
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition);
  const updatePosition = useContextSelector(PositionContext, (state) => state.updatePosition);
  const setWaitModalIsOpen = useSetWaitModalIsOpen();
  const { address } = useWalletAddress();
  const position = useContextSelector(PositionContext, (state) => state.position);
  const submitFunc = useSubmit(methodName);

  return async (parameters) => {
    if (!address) return false;

    try {
      setWaitModalIsOpen(true);

      const positionUpdate = getPositionUpdateByCells(
        parameters.additionalDeposits ??
          parameters.additionalDebts ??
          parameters.deposits ??
          parameters.debts ??
          [],
      );
      const result = await submitFunc(address, positionUpdate);
      logInfo(result);

      const deposits =
        parameters.deposits ?? parameters.additionalDeposits ?? position?.deposits ?? [];
      const debts = parameters.debts ?? parameters.additionalDebts ?? position?.debts ?? [];
      setPosition({ deposits, debts });
      updatePosition();
      return true;
    } catch (e) {
      logError(e);
      return false;
    } finally {
      setWaitModalIsOpen(false);
    }
  };
}

import { useWalletAddress } from '@/shared/contexts/use-wallet-address';
import { useEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import { PositionContext } from '@/entities/position/context/context';
import { checkPositionExists } from '@/entities/position/utils';
import { useWalletActions } from '../../../entities/wallet/hooks/use-wallet-action';
import { useCallbackHandler } from './use-callback-handler';

export const useOpenModalAfterAuthentication = (disabled: boolean) => {
  const { address, isConnected } = useWalletAddress();
  const { connect, getWallet } = useWalletActions();
  const position = useContextSelector(PositionContext, (state) => state.position);
  const isPositionFetched = useContextSelector(PositionContext, (state) => state.isPositionFetched);

  const havePosition = checkPositionExists(position);

  const { clearCallback, runCallback, setCallback } = useCallbackHandler<boolean>();

  useEffect(() => {
    if (disabled) {
      clearCallback();
    }
  }, [disabled, clearCallback]);

  useEffect(() => {
    if (address && isPositionFetched) {
      runCallback(havePosition);
    }
  }, [address, havePosition, isPositionFetched, runCallback]);

  return (cb: (value: boolean) => void): void => {
    if (!isConnected) {
      getWallet();
      return;
    }
    if (address) {
      cb(havePosition);
    } else {
      connect();
      setCallback(cb);
    }
  };
};

import { useWalletAddress } from '@/shared/contexts/use-wallet-address';
import { getPublicKey } from '@stellar/freighter-api';
import { FREIGHTER_WALLET_URL } from '../constants/wallet';

export const useWalletActions = () => {
  const { setAddress } = useWalletAddress();

  const getWallet = () => {
    window.open(FREIGHTER_WALLET_URL, '_blank');
  };

  const connect = async () => {
    const publicKey = await getPublicKey();
    setAddress(publicKey);
  };

  return { getWallet, connect };
};

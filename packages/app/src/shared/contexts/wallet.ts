import { createContext } from 'use-context-selector';

interface WalletContextType {
  address?: string;
  setAddress: (value: string) => void;
  isConnected?: boolean;
}

export const WalletContext = createContext<WalletContextType>({} as WalletContextType);

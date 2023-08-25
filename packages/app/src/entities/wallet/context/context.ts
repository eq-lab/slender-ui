import { createContext } from 'use-context-selector'

interface WalletContextType {
  address: string | null
  setAddress: (value: string) => void
  isConnected: boolean | null
}

export const WalletContext = createContext<WalletContextType>({} as WalletContextType)

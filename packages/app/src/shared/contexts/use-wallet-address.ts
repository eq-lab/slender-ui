import { useContextSelector } from 'use-context-selector'
import { WalletContext } from './wallet'

export const useWalletAddress = () => {
  const address = useContextSelector(WalletContext, (state) => state.address)
  const setAddress = useContextSelector(WalletContext, (state) => state.setAddress)
  const isConnected = useContextSelector(WalletContext, (state) => state.isConnected)

  return { address, setAddress, isConnected }
}

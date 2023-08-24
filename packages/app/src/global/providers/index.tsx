import { WalletProvider } from '../../entities/wallet/context/provider'
import { StyledComponentsRegistry } from './styled-registry'

export function Providers({ children }: { children: JSX.Element }) {
  return (
    <WalletProvider>
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </WalletProvider>
  )
}

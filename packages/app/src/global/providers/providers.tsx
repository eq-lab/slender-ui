import { WalletProvider } from '@/entities/wallet/context/provider'
import { PositionProvider } from '@/entities/position/context/provider'
import { TokenProvider } from '@/entities/token/context/provider'
import { StyledComponentsRegistry } from './styled-registry'

export function Providers({ children }: { children: JSX.Element }) {
  return (
    <WalletProvider>
      <TokenProvider>
        <PositionProvider>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </PositionProvider>
      </TokenProvider>
    </WalletProvider>
  )
}

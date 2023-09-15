import { WalletProvider } from '@/entities/wallet/context/provider'
import { PositionProvider } from '@/entities/position/context/provider'
import { TokenProvider } from '@/entities/token/context/provider'
import { CurrencyRatesProvider } from '@/entities/currency-rates/context/provider'
import { WaitModalProvider } from '@/features/liquidity-flow/context/provider'
import { StyledComponentsRegistry } from './styled-registry'

export function Providers({ children }: { children: JSX.Element }) {
  return (
    <CurrencyRatesProvider>
      <WalletProvider>
        <TokenProvider>
          <PositionProvider>
            <WaitModalProvider>
              <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            </WaitModalProvider>
          </PositionProvider>
        </TokenProvider>
      </WalletProvider>
    </CurrencyRatesProvider>
  )
}

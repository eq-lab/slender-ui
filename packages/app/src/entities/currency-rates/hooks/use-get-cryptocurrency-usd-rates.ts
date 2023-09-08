import { useContextSelector } from 'use-context-selector'
import { SUPPORTED_TOKENS, SupportedToken } from '@/shared/stellar/constants/tokens'
import { CurrencyRatesContext } from '../context/context'

export type SupportedTokenRates = {
  [key in SupportedToken]: number
}

export const useGetCryptocurrencyUsdRates = (): SupportedTokenRates | undefined => {
  const currencyRates = useContextSelector(CurrencyRatesContext, (state) => state.currencyRates)

  const supportedTokenEntries =
    currencyRates &&
    SUPPORTED_TOKENS.map((token) => [token, currencyRates[token.toUpperCase()] as number])

  return supportedTokenEntries && Object.fromEntries(supportedTokenEntries)
}
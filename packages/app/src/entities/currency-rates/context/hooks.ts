import { useMemo } from 'react'
import { SUPPORTED_TOKENS, SupportedToken } from '@/shared/stellar/constants/tokens'
import { useContextSelector } from 'use-context-selector'
import { CurrencyRatesContext } from './context'

export type SupportedTokenRates = {
  [key in SupportedToken]: number
}
export const usePriceInUsd = (): SupportedTokenRates => {
  const currencyRates = useContextSelector(CurrencyRatesContext, (state) => state.currencyRates)

  return useMemo(() => {
    const supportedTokenEntries =
      currencyRates &&
      SUPPORTED_TOKENS.map((token) => [token, currencyRates[token.toUpperCase()] as number])
    return supportedTokenEntries && Object.fromEntries(supportedTokenEntries)
  }, [currencyRates])
}

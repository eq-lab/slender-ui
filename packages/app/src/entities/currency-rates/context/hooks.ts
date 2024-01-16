import { useMemo } from 'react';
import { SUPPORTED_TOKEN_NAMES, SupportedTokenName } from '@/shared/stellar/constants/tokens';
import { useContextSelector } from 'use-context-selector';
import { CurrencyRatesContext } from './context';

export type SupportedTokenRates = {
  [key in SupportedTokenName]: number;
};
export const usePriceInUsd = (): SupportedTokenRates | undefined => {
  const currencyRates = useContextSelector(CurrencyRatesContext, (state) => state.currencyRates);

  return useMemo(() => {
    const supportedTokenEntries =
      currencyRates &&
      SUPPORTED_TOKEN_NAMES.map((token) => [token, currencyRates[token.toUpperCase()]]);
    return supportedTokenEntries && Object.fromEntries(supportedTokenEntries);
  }, [currencyRates]);
};

import { createContext } from 'use-context-selector';
import type { TokenAddress } from '@/shared/stellar/constants/tokens';

export type TokenCache = {
  title: string;
  symbol: string;
  decimals: number;
};

export type CachedTokens = Record<TokenAddress, TokenCache>;

export type PoolData = Record<
  string,
  {
    discount: number;
    utilizationCapacity: number;
    borrowInterestRate: string;
    lendInterestRate: string;
  }
>;

export const MarketContext = createContext<{
  tokens?: Partial<CachedTokens>;
  pool?: PoolData;
}>({});

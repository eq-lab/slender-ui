import { useContextSelector } from 'use-context-selector';
import { MarketContext } from './context';

export const useTokenCache = () => useContextSelector(MarketContext, (state) => state.tokens);

export const useMarketData = () => useContextSelector(MarketContext, (state) => state.pool);

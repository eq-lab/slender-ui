'use client';

import React, { useEffect, useState } from 'react';
import { networks, ReserveData, u32 } from '@bindings/pool';
import { useMakeInvoke } from '@/shared/stellar/hooks/use-make-invoke';
import { debtToken, sToken, underlying } from '@/shared/stellar/constants/tokens';
import { addressToScVal } from '@/shared/stellar/encoders';
import { CachedTokens, MarketContext, PoolData } from './context';
import { PERCENT_PRECISION, CONTRACT_MATH_PRECISION } from '../constants/contract-constants';
import { makeFormatPercentWithPrecision } from '../utils/make-format-percent-with-precision';

const NATIVE_ID = 'native';
const NATIVE_TITLE = 'Lumen';
const NATIVE_SYMBOL = 'XLM';

type Rest = [string, string, number];

const CACHED_TOKEN_ADDRESSES = [
  ...Object.values(underlying),
  ...Object.values(sToken),
  ...Object.values(debtToken),
] as const;

const CACHED_POOL_ADDRESSES = [...Object.values(underlying)];

const formatInterestRate = makeFormatPercentWithPrecision(CONTRACT_MATH_PRECISION);

export function TokenProvider({ children }: { children: JSX.Element }) {
  const [cachedTokens, setCachedTokens] = useState<CachedTokens>();
  const [marketData, setMarketData] = useState<PoolData>();
  const makeInvoke = useMakeInvoke();

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const cacheTxs = CACHED_TOKEN_ADDRESSES.reduce((allTxs, tokenAddress) => {
        const invoke = makeInvoke(tokenAddress);
        return [
          ...allTxs,
          invoke<string>('name'),
          invoke<string>('symbol'),
          invoke<u32>('decimals'),
        ];
      }, []);
      const poolInvoke = makeInvoke(networks.futurenet.contractId);
      const marketTxs = CACHED_POOL_ADDRESSES.map((asset) =>
        poolInvoke<ReserveData>('get_reserve', [addressToScVal(asset)]),
      );
      const [restValues, marketValues] = (await Promise.all([
        Promise.all(cacheTxs),
        Promise.all(marketTxs),
      ])) as [[...Rest, ...Rest[]], ReserveData[]];

      const newCachedTokens = CACHED_TOKEN_ADDRESSES.reduce<CachedTokens>(
        (cached, tokenAddress) => {
          const title = restValues.shift() as string;
          const symbol = restValues.shift() as string;
          const decimals = restValues.shift() as number;
          cached[tokenAddress] = {
            title: title === NATIVE_ID ? NATIVE_TITLE : title,
            symbol: symbol === NATIVE_ID ? NATIVE_SYMBOL : symbol,
            decimals,
          };
          return cached;
        },
        {} as CachedTokens,
      );
      setCachedTokens(newCachedTokens);

      const newMarketData = marketValues.reduce<PoolData>((cached, poolReserve, currentIndex) => {
        cached[CACHED_POOL_ADDRESSES[currentIndex]!] = {
          // @ts-ignore
          discount: poolReserve.configuration.get('discount'),
          // @ts-ignore
          liquidationPenalty: poolReserve.configuration.get('liq_bonus') - PERCENT_PRECISION,
          // @ts-ignore
          utilizationCapacity: poolReserve.configuration.get('util_cap'),
          borrowInterestRate: formatInterestRate(poolReserve.borrower_ir),
          lendInterestRate: formatInterestRate(poolReserve.lender_ir),
        };
        return cached;
      }, {} as PoolData);
      setMarketData(newMarketData);
    })();
  }, [makeInvoke]);

  return (
    <MarketContext.Provider value={{ tokens: cachedTokens, pool: marketData }}>
      {children}
    </MarketContext.Provider>
  );
}

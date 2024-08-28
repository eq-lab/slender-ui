import { useEffect, useRef, useState } from 'react';
import { useMakeInvoke } from '@/shared/stellar/hooks/use-make-invoke';
import { TokenAddress } from '@/shared/stellar/constants/tokens';
import { addressToScVal } from '@/shared/stellar/encoders';
import { useWalletAddress } from '@/shared/contexts/use-wallet-address';
import BigNumber from 'bignumber.js';
import { CachedTokens } from '../context/context';
import { useTokenCache } from '../context/hooks';

export interface SorobanTokenRecord {
  balance: BigNumber;
  title: string;
  symbol: string;
  decimals: number;
}

const defaultTokenRecord = { title: '', symbol: '', decimals: 0 };

const isArraysEqual = <T>(a?: T[], b?: T[]) =>
  a?.length === b?.length && a?.every((value, index) => value === b?.[index]);

export const useGetBalance = (
  tokenAddresses: TokenAddress[],
  numberUpdate?: number,
): { value: SorobanTokenRecord[]; isFetched: boolean } => {
  const [balanceInfo, setBalanceInfo] = useState<SorobanTokenRecord[]>([]);
  const [isFetched, setFetchedStatus] = useState(false);
  const makeInvoke = useMakeInvoke();
  const tokensCache = useTokenCache();
  const { address: userAddress } = useWalletAddress();

  const previousTokenAddresses = useRef<TokenAddress[]>();
  const previousUserAddress = useRef<string>();
  const previousTokensCache = useRef<Partial<CachedTokens>>();
  const previousUpdateNumber = useRef<number>();

  useEffect(() => {
    async function updateBalances() {
      if (!userAddress) {
        setBalanceInfo([]);
        setFetchedStatus(false);
        return;
      }
      const balanceTxParams = [addressToScVal(userAddress)];

      const balances: SorobanTokenRecord[] = await Promise.all(
        tokenAddresses.map(async (tokenAddress) => {
          try {
            const invoke = makeInvoke(tokenAddress);
            const balance = await invoke<string>('balance', balanceTxParams);

            const tokenCache = tokensCache?.[tokenAddress as TokenAddress] ?? defaultTokenRecord;

            return {
              balance: BigNumber(balance ?? 0).div(10 ** tokenCache.decimals),
              ...tokenCache,
            };
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Error fetching balance for tokenAddress ${tokenAddress}`, error);
            const tokenCache = tokensCache?.[tokenAddress as TokenAddress] ?? defaultTokenRecord;
            return {
              balance: BigNumber(0),
              ...tokenCache,
            };
          }
        }),
      );

      setBalanceInfo(balances);
      setFetchedStatus(true);
    }
    if (
      !isArraysEqual(tokenAddresses, previousTokenAddresses.current) ||
      userAddress !== previousUserAddress.current ||
      tokensCache !== previousTokensCache.current ||
      numberUpdate !== previousUpdateNumber.current
    ) {
      updateBalances();
    }
  }, [makeInvoke, tokenAddresses, userAddress, tokensCache, numberUpdate]);

  useEffect(() => {
    previousTokenAddresses.current = tokenAddresses;
    previousUserAddress.current = userAddress;
    previousTokensCache.current = tokensCache;
    previousUpdateNumber.current = numberUpdate;
  });

  return { value: balanceInfo, isFetched };
};

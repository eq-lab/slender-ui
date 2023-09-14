import * as SorobanClient from 'soroban-client'
import { useContextSelector } from 'use-context-selector'
import { WalletContext } from '@/entities/wallet/context/context'
import { useCallback, useMemo } from 'react'
import { server } from '@/shared/stellar/server'
import { FUTURENET_NETWORK_DETAILS } from '../constants/networks'

const FEE = '100'
const PLACEHOLDER_NULL_ACCOUNT = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
const ACCOUNT_SEQUENCE = '0'

export function useMakeInvoke() {
  const userAddress =
    useContextSelector(WalletContext, (state) => state.address) || PLACEHOLDER_NULL_ACCOUNT
  const sourceAccount = useMemo(
    () => new SorobanClient.Account(userAddress, ACCOUNT_SEQUENCE),
    [userAddress],
  )

  const newTxBuilder = useCallback(
    () =>
      new SorobanClient.TransactionBuilder(sourceAccount, {
        fee: FEE,
        networkPassphrase: FUTURENET_NETWORK_DETAILS.networkPassphrase,
      }),
    [sourceAccount],
  )

  return useCallback(
    (contractAddress: string) => {
      const contract = new SorobanClient.Contract(contractAddress)
      return async <T>(
        methodName: string,
        decoder: (xdr: string) => T,
        txParams: SorobanClient.xdr.ScVal[] = [],
      ): Promise<T> => {
        const tx = newTxBuilder()
          .addOperation(contract.call(methodName, ...txParams))
          .setTimeout(SorobanClient.TimeoutInfinite)
          .build()
        const { results } = await server.simulateTransaction(tx)
        const [result] = results ?? []
        return decoder(result?.xdr ?? '')
      }
    },
    [newTxBuilder],
  )
}

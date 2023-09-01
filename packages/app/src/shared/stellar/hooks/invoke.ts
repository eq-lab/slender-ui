import * as SorobanClient from 'soroban-client'
import { useContextSelector } from 'use-context-selector'
import { WalletContext } from '@/entities/wallet/context/context'
import { useCallback, useMemo } from 'react'
import { FUTURENET_NETWORK_DETAILS } from '../constants/networks'

const FEE = '100'
const PLACEHOLDER_NULL_ACCOUNT = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
const ACCOUNT_SEQUENCE = '0'

const server = new SorobanClient.Server(FUTURENET_NETWORK_DETAILS.rpcUrl, {
  allowHttp: FUTURENET_NETWORK_DETAILS.networkUrl.startsWith('http://'),
})

export function useMakeGetTx(contractAddress: string) {
  const userAddress =
    useContextSelector(WalletContext, (state) => state.address) ?? PLACEHOLDER_NULL_ACCOUNT
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
  const contract = useMemo(() => new SorobanClient.Contract(contractAddress), [contractAddress])

  return useCallback(
    (methodName: string, txParams: SorobanClient.xdr.ScVal[] = []) =>
      newTxBuilder()
        .addOperation(contract.call(methodName, ...txParams))
        .setTimeout(SorobanClient.TimeoutInfinite)
        .build(),
    [newTxBuilder, contract],
  )
}

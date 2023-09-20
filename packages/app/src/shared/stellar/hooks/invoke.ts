import * as SorobanClient from 'soroban-client'
import { SorobanRpc } from 'soroban-client'
import { useContextSelector } from 'use-context-selector'
import { WalletContext } from '@/shared/contexts/wallet'
import { useCallback, useMemo } from 'react'
import { server } from '@/shared/stellar/server'
import { scValToJs } from '@/shared/stellar/decoders'
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
        txParams: SorobanClient.xdr.ScVal[] = [],
      ): Promise<T> => {
        const tx = newTxBuilder()
          .addOperation(contract.call(methodName, ...txParams))
          .setTimeout(SorobanClient.TimeoutInfinite)
          .build()
        const simulated = await server.simulateTransaction(tx)

        if (SorobanRpc.isSimulationError(simulated)) {
          throw new Error(simulated.error)
        } else if (!simulated.result) {
          throw new Error(`invalid simulation: no result in ${simulated}`)
        }

        return scValToJs(simulated.result.retval)
      }
    },
    [newTxBuilder],
  )
}

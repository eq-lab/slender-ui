// from contract-bindings/pool/src/invoke.ts
import freighter from '@stellar/freighter-api'
import * as SorobanClient from 'soroban-client'
import { CONTRACT_ID, NotImplementedError, signTx, Tx, sendTx } from '@bindings/pool'
import { FUTURENET_NETWORK_DETAILS } from '@/shared/stellar/constants/networks'
import { logError } from '@/shared/logger'
import { server } from '@/shared/stellar/server'
import { ResponseTypes } from './types'

const { isConnected, isAllowed, getUserInfo } = freighter

type Simulation = SorobanClient.SorobanRpc.SimulateTransactionResponse
type SendTx = SorobanClient.SorobanRpc.SendTransactionResponse
type GetTx = SorobanClient.SorobanRpc.GetTransactionResponse

let someRpcResponse: Simulation | SendTx | GetTx
type SomeRpcResponse = typeof someRpcResponse

/**
 * Get account details from the Soroban network for the publicKey currently
 * selected in Freighter. If not connected to Freighter, return null.
 */
async function getAccount(): Promise<SorobanClient.Account | null> {
  if (!(await isConnected()) || !(await isAllowed())) {
    return null
  }
  const { publicKey } = await getUserInfo()
  if (!publicKey) {
    return null
  }
  return server.getAccount(publicKey)
}

export async function invoke<R extends ResponseTypes, T = string>({
  method,
  args = [],
  fee = 100,
  responseType,
  parseResultXdr,
  secondsToWait = 10,
}: {
  fee?: number
  responseType?: R
  secondsToWait?: number
  method: string
  args?: any[]
  parseResultXdr?: (xdr: string) => T
}): Promise<T | string | SomeRpcResponse> {
  const freighterAccount = await getAccount()

  const account =
    freighterAccount ??
    new SorobanClient.Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0')

  const contract = new SorobanClient.Contract(CONTRACT_ID)

  let tx = new SorobanClient.TransactionBuilder(account, {
    fee: fee.toString(10),
    networkPassphrase: FUTURENET_NETWORK_DETAILS.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build()

  const simulated = await server.simulateTransaction(tx)

  if (responseType === 'simulated') return simulated

  const auths = simulated.results?.[0]?.auth
  const authsCount = auths?.length ?? 0

  const writeLength = SorobanClient.xdr.SorobanTransactionData.fromXDR(
    simulated.transactionData,
    'base64',
  )
    .resources()
    .footprint()
    .readWrite().length

  const parse = parseResultXdr ?? ((xdr) => xdr)

  const isViewCall = authsCount === 0 && writeLength === 0

  if (isViewCall) {
    if (responseType === 'full') return simulated

    const { results } = simulated
    if (!results || results[0] === undefined) {
      if (simulated.error) {
        throw new Error(simulated.error as unknown as string)
      }
      throw new Error(`Invalid response from simulateTransaction:\n{simulated}`)
    }
    return parse(results[0].xdr)
  }

  if (authsCount > 1) {
    throw new NotImplementedError('Multiple auths not yet supported')
  }
  if (authsCount === 1) {
    // doesn't work with new SorobanClient
  }

  if (!freighterAccount) {
    throw new Error('Not connected to Freighter')
  }

  tx = await signTx(
    SorobanClient.assembleTransaction(
      tx,
      FUTURENET_NETWORK_DETAILS.networkPassphrase,
      simulated,
    ) as Tx,
  )

  const raw = await sendTx(tx, secondsToWait)

  if (responseType === 'full') return raw

  // improved with `resultMetaXdr` property
  if ('resultXdr' in raw) return parse(raw.resultMetaXdr ?? '')

  if ('errorResultXdr' in raw) return parse(raw.errorResultXdr ?? '')

  logError("Don't know how to parse result! Returning full RPC response.")
  return raw
}

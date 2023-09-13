// from contract-bindings/pool/src/index.ts
import { Address, Err, Error_, i128, MintBurn, Ok } from '@bindings/pool'
import { addressToScVal, bigintToScVal } from '@/shared/stellar/encoders'
import * as SorobanClient from 'soroban-client'
import { scValToJs } from '@/shared/stellar/decoders'
import { ResponseTypes } from '@/features/borrow-flow/soroban/binding/types'
import { invoke } from './invoke'

function parseMetaXdrToJs<T>(value: string): T {
  const val = SorobanClient.xdr.TransactionMeta.fromXDR(value, 'base64')
    .v3()
    .sorobanMeta()!
    .returnValue()

  return scValToJs(val)
}

function getError(err: string): Err<Error_> | undefined {
  const match = err.match(/ContractError\((\d+)\)/)
  if (!match) {
    return undefined
  }
  return new Err({ message: 'unknown error' })
}

export async function borrow<R extends ResponseTypes = undefined>(
  { who, asset, amount }: { who: Address; asset: Address; amount: i128 },
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `Ok<Array<MintBurn>> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
  } = {},
) {
  return invoke({
    method: 'borrow',
    args: [addressToScVal(who), addressToScVal(asset), bigintToScVal(amount)],
    ...options,
    parseResultXdr: (xdr): Ok<Array<MintBurn>> | Err<Error_> | undefined => {
      try {
        return new Ok(parseMetaXdrToJs(xdr))
      } catch (e) {
        // @ts-ignore
        const err = getError(e.message)
        if (err) {
          return err
        }
        throw e
      }
    },
  })
}

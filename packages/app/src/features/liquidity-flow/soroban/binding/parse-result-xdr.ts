import * as SorobanClient from 'soroban-client'
import { scValToJs } from '@/shared/stellar/decoders'
import { Err, Error_, MintBurn, Ok } from '@bindings/pool'

export function parseMetaXdrToJs<T>(value: string): T {
  const val = SorobanClient.xdr.TransactionMeta.fromXDR(value, 'base64')
    .v3()
    .sorobanMeta()!
    .returnValue()

  return scValToJs(val)
}

export function getError(err: string): Err<Error_> | undefined {
  const match = err.match(/ContractError\((\d+)\)/)
  if (!match) {
    return undefined
  }
  return new Err({ message: 'unknown error' })
}

export function parseResultXdr(xdr: string): Ok<Array<MintBurn>> | Err<Error_> | undefined {
  try {
    // improved with meta parsing
    return new Ok(parseMetaXdrToJs(xdr))
  } catch (e) {
    // @ts-ignore
    const err = getError(e.message)
    if (err) {
      return err
    }
    throw e
  }
}

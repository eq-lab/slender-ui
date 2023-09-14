import * as SorobanClient from 'soroban-client'

export const addressToScVal = (account: string) => new SorobanClient.Address(account).toScVal()

export function bigintToScVal(i: bigint): SorobanClient.xdr.ScVal {
  return new SorobanClient.ScInt(i).toI128()
}

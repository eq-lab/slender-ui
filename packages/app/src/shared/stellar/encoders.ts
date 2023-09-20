import * as SorobanClient from 'soroban-client'

export const addressToScVal = (account: string) =>
  SorobanClient.nativeToScVal(account, { type: 'address' })
export function bigintToScVal(i: bigint): SorobanClient.xdr.ScVal {
  return new SorobanClient.ScInt(i).toI128()
}

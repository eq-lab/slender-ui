import * as SorobanClient from 'soroban-client'

export const addressToScVal = (account: string) =>
  SorobanClient.nativeToScVal(account, { type: 'address' })

export const bigintToScVal = (i: bigint): SorobanClient.xdr.ScVal =>
  new SorobanClient.ScInt(i).toI128()

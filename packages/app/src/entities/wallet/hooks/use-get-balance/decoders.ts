import * as SorobanClient from 'soroban-client'

const valueToI128String = (value: SorobanClient.xdr.ScVal) =>
  SorobanClient.scValToBigInt(value).toString()

export const decodei128 = (b64: string) => {
  const value = SorobanClient.xdr.ScVal.fromXDR(b64, 'base64')
  try {
    return valueToI128String(value)
  } catch (error) {
    return 0
  }
}

export const decodeStr = (b64: string) =>
  SorobanClient.xdr.ScVal.fromXDR(b64, 'base64').str().toString()

export const decodeU32 = (b64: string) => SorobanClient.xdr.ScVal.fromXDR(b64, 'base64').u32()

export const accountIdentifier = (account: string) => new SorobanClient.Address(account).toScVal()

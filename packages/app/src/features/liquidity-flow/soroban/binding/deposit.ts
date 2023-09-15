// from contract-bindings/pool/src/index.ts
import { Address, i128 } from '@bindings/pool'
import { addressToScVal, bigintToScVal } from '@/shared/stellar/encoders'
import { ResponseTypes } from './types'
import { parseResultXdr } from './parse-result-xdr'
import { invoke } from './invoke'

export const deposit = async <R extends ResponseTypes = undefined>(
  { who, asset, amount }: { who: Address; asset: Address; amount: i128 },
  options: { fee?: number; responseType?: R; secondsToWait?: number } = {},
) =>
  invoke({
    method: 'deposit',
    args: [addressToScVal(who), addressToScVal(asset), bigintToScVal(amount)],
    ...options,
    parseResultXdr,
  })

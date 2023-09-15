// from contract-bindings/pool/src/index.ts
import { Address, i128 } from '@bindings/pool'
import { addressToScVal, bigintToScVal } from '@/shared/stellar/encoders'
import { ResponseTypes } from './types'
import { invoke } from './invoke'
import { parseResultXdr } from './parse-result-xdr'

export const makeLiquidityBinding =
  (methodName: 'borrow' | 'deposit' | 'repay') =>
  async <R extends ResponseTypes = undefined>(
    { who, asset, amount }: { who: Address; asset: Address; amount: i128 },
    options: {
      fee?: number
      responseType?: R
      secondsToWait?: number
    } = {},
  ) =>
    invoke({
      method: methodName,
      args: [addressToScVal(who), addressToScVal(asset), bigintToScVal(amount)],
      ...options,
      parseResultXdr,
    })

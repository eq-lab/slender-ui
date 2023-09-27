import * as SorobanClient from 'soroban-client'
import BigNumber from 'bignumber.js'

type ElementType<T> = T extends Array<infer U> ? U : never
type KeyType<T> = T extends Map<infer K, any> ? K : never
type ValueType<T> = T extends Map<any, infer V> ? V : never
export function scValToJs<T>(val: SorobanClient.xdr.ScVal): T {
  switch (val?.switch()) {
    case SorobanClient.xdr.ScValType.scvBool(): {
      return val.b() as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvVoid():
    case undefined: {
      return 0 as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvU32(): {
      return val.u32() as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvI32(): {
      return val.i32() as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvU64():
    case SorobanClient.xdr.ScValType.scvI64():
    case SorobanClient.xdr.ScValType.scvU128():
    case SorobanClient.xdr.ScValType.scvI128():
    case SorobanClient.xdr.ScValType.scvU256():
    case SorobanClient.xdr.ScValType.scvI256(): {
      return BigNumber(SorobanClient.scValToBigInt(val).toString()) as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvAddress(): {
      return SorobanClient.Address.fromScVal(val).toString() as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvString(): {
      return val.str().toString() as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvSymbol(): {
      return val.sym().toString() as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvBytes(): {
      return val.bytes() as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvVec(): {
      type Element = ElementType<T>
      return val.vec()?.map((v) => scValToJs<Element>(v)) as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvMap(): {
      type Key = KeyType<T>
      type Value = ValueType<T>
      const res: any = {}
      val.map()?.forEach((e) => {
        const key = scValToJs<Key>(e.key())
        let value
        const v: SorobanClient.xdr.ScVal = e.val()
        // For now, we assume second level maps are real maps. Not perfect but better.
        switch (v?.switch()) {
          case SorobanClient.xdr.ScValType.scvMap(): {
            const innerMap = new Map() as Map<any, any>
            v.map()?.forEach((element) => {
              const elementKey = scValToJs<Key>(element.key())
              const elementValue = scValToJs<Value>(element.val())
              innerMap.set(elementKey, elementValue)
            })
            value = innerMap
            break
          }
          default: {
            value = scValToJs<Value>(e.val())
          }
        }
        // @ts-ignore
        res[key as Key] = value as Value
      })
      return res as unknown as T
    }
    case SorobanClient.xdr.ScValType.scvContractInstance():
    case SorobanClient.xdr.ScValType.scvLedgerKeyNonce():
    case SorobanClient.xdr.ScValType.scvTimepoint():
    case SorobanClient.xdr.ScValType.scvDuration():
      return val.value() as unknown as T
    default: {
      throw new Error(`type not implemented yet: ${val?.switch().name}`)
    }
  }
}

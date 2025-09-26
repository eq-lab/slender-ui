import * as StellarSdk from '@stellar/stellar-sdk';

import BigNumber from 'bignumber.js';

type ElementType<T> = T extends Array<infer U> ? U : never;
type KeyType<T> = T extends Map<infer K, any> ? K : never;
type ValueType<T> = T extends Map<any, infer V> ? V : never;
export function scValToJs<T>(val: StellarSdk.xdr.ScVal): T {
  switch (val?.switch().name) {
    case StellarSdk.xdr.ScValType.scvBool().name: {
      return val.b() as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvVoid().name:
    case undefined: {
      return 0 as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvU32().name: {
      return val.u32() as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvI32().name: {
      return val.i32() as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvU64().name:
    case StellarSdk.xdr.ScValType.scvI64().name:
    case StellarSdk.xdr.ScValType.scvU128().name:
    case StellarSdk.xdr.ScValType.scvI128().name:
    case StellarSdk.xdr.ScValType.scvU256().name:
    case StellarSdk.xdr.ScValType.scvI256().name: {
      return BigNumber(StellarSdk.scValToBigInt(val).toString()) as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvAddress().name: {
      return StellarSdk.Address.fromScVal(val).toString() as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvString().name: {
      return val.str().toString() as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvSymbol().name: {
      return val.sym().toString() as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvBytes().name: {
      return val.bytes() as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvVec().name: {
      type Element = ElementType<T>;
      return val.vec()?.map((v) => scValToJs<Element>(v)) as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvMap().name: {
      type Key = KeyType<T>;
      type Value = ValueType<T>;
      const res: any = {};
      val.map()?.forEach((e) => {
        const key = scValToJs<Key>(e.key());
        let value;
        const v: StellarSdk.xdr.ScVal = e.val();
        // For now, we assume second level maps are real maps. Not perfect but better.
        switch (v?.switch()) {
          case StellarSdk.xdr.ScValType.scvMap(): {
            const innerMap = new Map() as Map<any, any>;
            v.map()?.forEach((element) => {
              const elementKey = scValToJs<Key>(element.key());
              const elementValue = scValToJs<Value>(element.val());
              innerMap.set(elementKey, elementValue);
            });
            value = innerMap;
            break;
          }
          default: {
            value = scValToJs<Value>(e.val());
          }
        }
        // @ts-ignore
        res[key as Key] = value as Value;
      });
      return res as unknown as T;
    }
    case StellarSdk.xdr.ScValType.scvContractInstance().name:
    case StellarSdk.xdr.ScValType.scvLedgerKeyNonce().name:
    case StellarSdk.xdr.ScValType.scvTimepoint().name:
    case StellarSdk.xdr.ScValType.scvDuration().name:
      return val.value() as unknown as T;
    default: {
      throw new Error(`type not implemented yet: ${val?.switch().name}`);
    }
  }
}

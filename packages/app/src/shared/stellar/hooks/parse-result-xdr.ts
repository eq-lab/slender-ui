import * as StellarSdk from '@stellar/stellar-sdk';

import { scValToJs } from '../decoders';

export function parseMetaXdrToJs<T>(meta: StellarSdk.xdr.TransactionMeta): T | null | undefined {
  const value = meta.v4().sorobanMeta()?.returnValue();

  return value && scValToJs(value);
}

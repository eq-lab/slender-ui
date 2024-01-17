import * as StellarSdk from '@stellar/stellar-sdk';

import { scValToJs } from '../decoders';

export function parseMetaXdrToJs<T>(meta: StellarSdk.xdr.TransactionMeta): T | undefined {
  const value = meta.v3().sorobanMeta()?.returnValue();

  return value && scValToJs(value);
}

import * as SorobanClient from 'soroban-client';
import { scValToJs } from '../decoders';

export function parseMetaXdrToJs<T>(meta: SorobanClient.xdr.TransactionMeta): T | undefined {
  const value = meta.v3().sorobanMeta()?.returnValue();

  return value && scValToJs(value);
}

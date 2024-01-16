import * as SorobanClient from 'soroban-client';
import BigNumber from 'bignumber.js';

export const addressToScVal = (account: string): SorobanClient.xdr.ScVal =>
  SorobanClient.nativeToScVal(account, { type: 'address' });

export const bigintToScVal = (i: BigNumber): SorobanClient.xdr.ScVal =>
  new SorobanClient.ScInt(i.toFixed(0)).toI128();

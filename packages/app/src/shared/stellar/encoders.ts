import BigNumber from 'bignumber.js'
import * as StellarSdk from '@stellar/stellar-sdk'

export const addressToScVal = (account: string): StellarSdk.xdr.ScVal =>
  StellarSdk.nativeToScVal(account, { type: 'address' })

export const bigintToScVal = (i: BigNumber): StellarSdk.xdr.ScVal =>
  new StellarSdk.ScInt(i.toFixed(0)).toI128()

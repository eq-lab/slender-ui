import * as SorobanClient from 'soroban-client';
import { ContractSpec, Address } from 'soroban-client';
import { Buffer } from "buffer";
import { invoke } from './invoke.js';
import type { ResponseTypes, Wallet, ClassOptions } from './method-options.js'

export * from './invoke.js'
export * from './method-options.js'

export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Option<T> = T | undefined;
export type Typepoint = bigint;
export type Duration = bigint;
export {Address};

/// Error interface containing the error message
export interface Error_ { message: string };

export interface Result<T, E extends Error_> {
    unwrap(): T,
    unwrapErr(): E,
    isOk(): boolean,
    isErr(): boolean,
};

export class Ok<T, E extends Error_ = Error_> implements Result<T, E> {
    constructor(readonly value: T) { }
    unwrapErr(): E {
        throw new Error('No error');
    }
    unwrap(): T {
        return this.value;
    }

    isOk(): boolean {
        return true;
    }

    isErr(): boolean {
        return !this.isOk()
    }
}

export class Err<E extends Error_ = Error_> implements Result<any, E> {
    constructor(readonly error: E) { }
    unwrapErr(): E {
        return this.error;
    }
    unwrap(): never {
        throw new Error(this.error.message);
    }

    isOk(): boolean {
        return false;
    }

    isErr(): boolean {
        return !this.isOk()
    }
}

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}

const regex = /Error\(Contract, #(\d+)\)/;

function parseError(message: string): Err | undefined {
    const match = message.match(regex);
    if (!match) {
        return undefined;
    }
    if (Errors === undefined) {
        return undefined;
    }
    let i = parseInt(match[1], 10);
    let err = Errors[i];
    if (err) {
        return new Err(err);
    }
    return undefined;
}

export const networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "CABDHBZBFUOMDVVYE2ZYZKAYNUSFXSDUVM4G6LDL47PFCU4BIMPP63GD",
    }
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "BaseAsset", values: void} | {tag: "Reserves", values: void} | {tag: "ReserveAssetKey", values: readonly [Address]} | {tag: "ReserveTimestampWindow", values: void} | {tag: "Treasury", values: void} | {tag: "IRParams", values: void} | {tag: "UserConfig", values: readonly [Address]} | {tag: "PriceFeed", values: readonly [Address]} | {tag: "Pause", values: void} | {tag: "FlashLoanFee", values: void} | {tag: "STokenUnderlyingBalance", values: readonly [Address]} | {tag: "TokenSupply", values: readonly [Address]} | {tag: "TokenBalance", values: readonly [Address, Address]};

export interface LiquidationCollateral {
  asset: Address;
  collat_coeff: i128;
  compounded_collat: i128;
  is_last_collateral: boolean;
  reserve_data: ReserveData;
  s_token_balance: i128;
}

export interface Asset {
  amount: i128;
  asset: Address;
  borrow: boolean;
  premium: i128;
}

export interface AccountPosition {
  debt: i128;
  discounted_collateral: i128;
  npv: i128;
}

export interface AssetBalance {
  asset: Address;
  balance: i128;
}

export interface BaseAssetConfig {
  address: Address;
  decimals: u32;
}

/**
 * Collateralization parameters
 */
export interface CollateralParamsInput {
  /**
 * Specifies what fraction of the underlying asset counts toward
 * the portfolio collateral value [0%, 100%].
 */
discount: u32;
  /**
 * The bonus liquidators receive to liquidate this asset. The values is always above 100%. A value of 105% means the liquidator will receive a 5% bonus
 */
liq_bonus: u32;
  /**
 * The total amount of an asset the protocol accepts into the market.
 */
liq_cap: i128;
  util_cap: u32;
}

const Errors = {
0: {message:""},
  1: {message:""},
  2: {message:""},
  3: {message:""},
  100: {message:""},
  101: {message:""},
  102: {message:""},
  103: {message:""},
  104: {message:""},
  105: {message:""},
  106: {message:""},
  107: {message:""},
  200: {message:""},
  201: {message:""},
  202: {message:""},
  203: {message:""},
  204: {message:""},
  300: {message:""},
  301: {message:""},
  302: {message:""},
  303: {message:""},
  304: {message:""},
  305: {message:""},
  306: {message:""},
  307: {message:""},
  308: {message:""},
  309: {message:""},
  310: {message:""},
  311: {message:""},
  312: {message:""},
  313: {message:""},
  400: {message:""},
  401: {message:""},
  402: {message:""},
  403: {message:""},
  404: {message:""},
  500: {message:""},
  501: {message:""},
  502: {message:""}
}
export interface FlashLoanAsset {
  amount: i128;
  asset: Address;
  borrow: boolean;
}

export interface InitReserveInput {
  debt_token_address: Address;
  s_token_address: Address;
}

/**
 * Interest rate parameters
 */
export interface IRParams {
  alpha: u32;
  initial_rate: u32;
  max_rate: u32;
  scaling_coeff: u32;
}

export interface PriceFeedConfig {
  asset_decimals: u32;
  feed: Address;
  feed_decimals: u32;
}

export interface PriceFeedInput {
  asset: Address;
  asset_decimals: u32;
  feed: Address;
  feed_decimals: u32;
}

export interface ReserveConfiguration {
  borrowing_enabled: boolean;
  /**
 * Specifies what fraction of the underlying asset counts toward
 * the portfolio collateral value [0%, 100%].
 */
discount: u32;
  is_active: boolean;
  liq_bonus: u32;
  liq_cap: i128;
  util_cap: u32;
}

export interface ReserveData {
  borrower_ar: i128;
  borrower_ir: i128;
  configuration: ReserveConfiguration;
  debt_token_address: Address;
  /**
 * The id of the reserve (position in the list of the active reserves).
 */
id: Buffer;
  last_update_timestamp: u64;
  lender_ar: i128;
  lender_ir: i128;
  s_token_address: Address;
}

/**
 * Implements the bitmap logic to handle the user configuration.
 * Even positions is collateral flags and uneven is borrowing flags.
 */
export type UserConfiguration = readonly [u128];
/**
 * Price data for an asset at a specific timestamp
 */
export interface PriceData {
  price: i128;
  timestamp: u64;
}


export class Contract {
            spec: ContractSpec;
    constructor(public readonly options: ClassOptions) {
        this.spec = new ContractSpec([
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAADgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAJQmFzZUFzc2V0AAAAAAAAAAAAAAAAAAAIUmVzZXJ2ZXMAAAABAAAAAAAAAA9SZXNlcnZlQXNzZXRLZXkAAAAAAQAAABMAAAAAAAAAAAAAABZSZXNlcnZlVGltZXN0YW1wV2luZG93AAAAAAAAAAAAAAAAAAhUcmVhc3VyeQAAAAAAAAAAAAAACElSUGFyYW1zAAAAAQAAAAAAAAAKVXNlckNvbmZpZwAAAAAAAQAAABMAAAABAAAAAAAAAAlQcmljZUZlZWQAAAAAAAABAAAAEwAAAAAAAAAAAAAABVBhdXNlAAAAAAAAAAAAAAAAAAAMRmxhc2hMb2FuRmVlAAAAAQAAAAAAAAAXU1Rva2VuVW5kZXJseWluZ0JhbGFuY2UAAAAAAQAAABMAAAABAAAAAAAAAAtUb2tlblN1cHBseQAAAAABAAAAEwAAAAEAAAAAAAAADFRva2VuQmFsYW5jZQAAAAIAAAATAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAFUxpcXVpZGF0aW9uQ29sbGF0ZXJhbAAAAAAAAAYAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAMY29sbGF0X2NvZWZmAAAACwAAAAAAAAARY29tcG91bmRlZF9jb2xsYXQAAAAAAAALAAAAAAAAABJpc19sYXN0X2NvbGxhdGVyYWwAAAAAAAEAAAAAAAAADHJlc2VydmVfZGF0YQAAB9AAAAALUmVzZXJ2ZURhdGEAAAAAAAAAAA9zX3Rva2VuX2JhbGFuY2UAAAAACw==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAh0cmVhc3VyeQAAABMAAAAAAAAADmZsYXNoX2xvYW5fZmVlAAAAAAAEAAAAAAAAAAlpcl9wYXJhbXMAAAAAAAfQAAAACElSUGFyYW1zAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAPdXBncmFkZV9zX3Rva2VuAAAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAANbmV3X3dhc21faGFzaAAAAAAAA+4AAAAgAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAASdXBncmFkZV9kZWJ0X3Rva2VuAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAADW5ld193YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAHdmVyc2lvbgAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAMaW5pdF9yZXNlcnZlAAAAAgAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAVpbnB1dAAAAAAAB9AAAAAQSW5pdFJlc2VydmVJbnB1dAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAASc2V0X3Jlc2VydmVfc3RhdHVzAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAACWlzX2FjdGl2ZQAAAAAAAAEAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAANc2V0X2lyX3BhcmFtcwAAAAAAAAEAAAAAAAAABWlucHV0AAAAAAAH0AAAAAhJUlBhcmFtcwAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAYcmVzZXJ2ZV90aW1lc3RhbXBfd2luZG93AAAAAAAAAAEAAAAG",
        "AAAAAAAAAAAAAAAcc2V0X3Jlc2VydmVfdGltZXN0YW1wX3dpbmRvdwAAAAEAAAAAAAAABndpbmRvdwAAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAJaXJfcGFyYW1zAAAAAAAAAAAAAAEAAAPoAAAH0AAAAAhJUlBhcmFtcw==",
        "AAAAAAAAAAAAAAAbZW5hYmxlX2JvcnJvd2luZ19vbl9yZXNlcnZlAAAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAHZW5hYmxlZAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAXY29uZmlndXJlX2FzX2NvbGxhdGVyYWwAAAAAAgAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZwYXJhbXMAAAAAB9AAAAAVQ29sbGF0ZXJhbFBhcmFtc0lucHV0AAAAAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAALZ2V0X3Jlc2VydmUAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+gAAAfQAAAAC1Jlc2VydmVEYXRhAA==",
        "AAAAAAAAAAAAAAAMY29sbGF0X2NvZWZmAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+kAAAALAAAAAw==",
        "AAAAAAAAAAAAAAAKZGVidF9jb2VmZgAAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+kAAAALAAAAAw==",
        "AAAAAAAAAAAAAAAKYmFzZV9hc3NldAAAAAAAAAAAAAEAAAPpAAAH0AAAAA9CYXNlQXNzZXRDb25maWcAAAAAAw==",
        "AAAAAAAAAAAAAAAOc2V0X2Jhc2VfYXNzZXQAAAAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAIZGVjaW1hbHMAAAAEAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAOc2V0X3ByaWNlX2ZlZWQAAAAAAAEAAAAAAAAABmlucHV0cwAAAAAD6gAAB9AAAAAOUHJpY2VGZWVkSW5wdXQAAAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAKcHJpY2VfZmVlZAAAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+gAAAfQAAAAD1ByaWNlRmVlZENvbmZpZwA=",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAFcmVwYXkAAAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAARZmluYWxpemVfdHJhbnNmZXIAAAAAAAAHAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAABNiYWxhbmNlX2Zyb21fYmVmb3JlAAAAAAsAAAAAAAAAEWJhbGFuY2VfdG9fYmVmb3JlAAAAAAAACwAAAAAAAAAOc190b2tlbl9zdXBwbHkAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAEAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAnRvAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAGYm9ycm93AAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAJc2V0X3BhdXNlAAAAAAAAAQAAAAAAAAAFdmFsdWUAAAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAGcGF1c2VkAAAAAAAAAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAIdHJlYXN1cnkAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAQYWNjb3VudF9wb3NpdGlvbgAAAAEAAAAAAAAAA3dobwAAAAATAAAAAQAAA+kAAAfQAAAAD0FjY291bnRQb3NpdGlvbgAAAAAD",
        "AAAAAAAAAAAAAAAJbGlxdWlkYXRlAAAAAAAABAAAAAAAAAAKbGlxdWlkYXRvcgAAAAAAEwAAAAAAAAADd2hvAAAAABMAAAAAAAAACmRlYnRfYXNzZXQAAAAAABMAAAAAAAAADnJlY2VpdmVfc3Rva2VuAAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAARc2V0X2FzX2NvbGxhdGVyYWwAAAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAABF1c2VfYXNfY29sbGF0ZXJhbAAAAAAAAAEAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAASdXNlcl9jb25maWd1cmF0aW9uAAAAAAABAAAAAAAAAAN3aG8AAAAAEwAAAAEAAAPpAAAH0AAAABFVc2VyQ29uZmlndXJhdGlvbgAAAAAAAAM=",
        "AAAAAAAAAAAAAAAZc3Rva2VuX3VuZGVybHlpbmdfYmFsYW5jZQAAAAAAAAEAAAAAAAAADnN0b2tlbl9hZGRyZXNzAAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAANdG9rZW5fYmFsYW5jZQAAAAAAAAIAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAASdG9rZW5fdG90YWxfc3VwcGx5AAAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAASc2V0X2ZsYXNoX2xvYW5fZmVlAAAAAAABAAAAAAAAAANmZWUAAAAABAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAOZmxhc2hfbG9hbl9mZWUAAAAAAAAAAAABAAAABA==",
        "AAAAAAAAAAAAAAAKZmxhc2hfbG9hbgAAAAAABAAAAAAAAAADd2hvAAAAABMAAAAAAAAACHJlY2VpdmVyAAAAEwAAAAAAAAALbG9hbl9hc3NldHMAAAAD6gAAB9AAAAAORmxhc2hMb2FuQXNzZXQAAAAAAAAAAAAGcGFyYW1zAAAAAAAOAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAABAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABmJvcnJvdwAAAAAAAQAAAAAAAAAHcHJlbWl1bQAAAAAL",
        "AAAAAQAAAAAAAAAAAAAAD0FjY291bnRQb3NpdGlvbgAAAAADAAAAAAAAAARkZWJ0AAAACwAAAAAAAAAVZGlzY291bnRlZF9jb2xsYXRlcmFsAAAAAAAACwAAAAAAAAADbnB2AAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAADEFzc2V0QmFsYW5jZQAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAHYmFsYW5jZQAAAAAL",
        "AAAAAQAAAAAAAAAAAAAAD0Jhc2VBc3NldENvbmZpZwAAAAACAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAACGRlY2ltYWxzAAAABA==",
        "AAAAAQAAABxDb2xsYXRlcmFsaXphdGlvbiBwYXJhbWV0ZXJzAAAAAAAAABVDb2xsYXRlcmFsUGFyYW1zSW5wdXQAAAAAAAAEAAAAaFNwZWNpZmllcyB3aGF0IGZyYWN0aW9uIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGNvdW50cyB0b3dhcmQKdGhlIHBvcnRmb2xpbyBjb2xsYXRlcmFsIHZhbHVlIFswJSwgMTAwJV0uAAAACGRpc2NvdW50AAAABAAAAJRUaGUgYm9udXMgbGlxdWlkYXRvcnMgcmVjZWl2ZSB0byBsaXF1aWRhdGUgdGhpcyBhc3NldC4gVGhlIHZhbHVlcyBpcyBhbHdheXMgYWJvdmUgMTAwJS4gQSB2YWx1ZSBvZiAxMDUlIG1lYW5zIHRoZSBsaXF1aWRhdG9yIHdpbGwgcmVjZWl2ZSBhIDUlIGJvbnVzAAAACWxpcV9ib251cwAAAAAAAAQAAABCVGhlIHRvdGFsIGFtb3VudCBvZiBhbiBhc3NldCB0aGUgcHJvdG9jb2wgYWNjZXB0cyBpbnRvIHRoZSBtYXJrZXQuAAAAAAAHbGlxX2NhcAAAAAALAAAAAAAAAAh1dGlsX2NhcAAAAAQ=",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAJwAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAAAAAAAAAAAAA1VbmluaXRpYWxpemVkAAAAAAAAAQAAAAAAAAALTm9QcmljZUZlZWQAAAAAAgAAAAAAAAAGUGF1c2VkAAAAAAADAAAAAAAAABZOb1Jlc2VydmVFeGlzdEZvckFzc2V0AAAAAABkAAAAAAAAAA9Ob0FjdGl2ZVJlc2VydmUAAAAAZQAAAAAAAAANUmVzZXJ2ZUZyb3plbgAAAAAAAGYAAAAAAAAAG1Jlc2VydmVzTWF4Q2FwYWNpdHlFeGNlZWRlZAAAAABnAAAAAAAAAA9Ob1ByaWNlRm9yQXNzZXQAAAAAaAAAAAAAAAAZUmVzZXJ2ZUFscmVhZHlJbml0aWFsaXplZAAAAAAAAGkAAAAAAAAAEUludmFsaWRBc3NldFByaWNlAAAAAAAAagAAAAAAAAAXQmFzZUFzc2V0Tm90SW5pdGlhbGl6ZWQAAAAAawAAAAAAAAAWVXNlckNvbmZpZ0ludmFsaWRJbmRleAAAAAAAyAAAAAAAAAAdTm90RW5vdWdoQXZhaWxhYmxlVXNlckJhbGFuY2UAAAAAAADJAAAAAAAAABNVc2VyQ29uZmlnTm90RXhpc3RzAAAAAMoAAAAAAAAADE11c3RIYXZlRGVidAAAAMsAAAAAAAAAD011c3ROb3RIYXZlRGVidAAAAADMAAAAAAAAABNCb3Jyb3dpbmdOb3RFbmFibGVkAAAAASwAAAAAAAAAG0NvbGxhdGVyYWxOb3RDb3Zlck5ld0JvcnJvdwAAAAEtAAAAAAAAAAtCYWRQb3NpdGlvbgAAAAEuAAAAAAAAAAxHb29kUG9zaXRpb24AAAEvAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAABMAAAAAAAAAAXVmFsaWRhdGVCb3Jyb3dNYXRoRXJyb3IAAAABMQAAAAAAAAAYQ2FsY0FjY291bnREYXRhTWF0aEVycm9yAAABMgAAAAAAAAATQXNzZXRQcmljZU1hdGhFcnJvcgAAAAEzAAAAAAAAABNOb3RFbm91Z2hDb2xsYXRlcmFsAAAAATQAAAAAAAAAEkxpcXVpZGF0ZU1hdGhFcnJvcgAAAAABNQAAAAAAAAAaTXVzdE5vdEJlSW5Db2xsYXRlcmFsQXNzZXQAAAAAATYAAAAAAAAAFlV0aWxpemF0aW9uQ2FwRXhjZWVkZWQAAAAAATcAAAAAAAAADkxpcUNhcEV4Y2VlZGVkAAAAAAE4AAAAAAAAABZGbGFzaExvYW5SZWNlaXZlckVycm9yAAAAAAE5AAAAAAAAABFNYXRoT3ZlcmZsb3dFcnJvcgAAAAAAAZAAAAAAAAAAGU11c3RCZUx0ZVBlcmNlbnRhZ2VGYWN0b3IAAAAAAAGRAAAAAAAAABhNdXN0QmVMdFBlcmNlbnRhZ2VGYWN0b3IAAAGSAAAAAAAAABhNdXN0QmVHdFBlcmNlbnRhZ2VGYWN0b3IAAAGTAAAAAAAAAA5NdXN0QmVQb3NpdGl2ZQAAAAABlAAAAAAAAAAUQWNjcnVlZFJhdGVNYXRoRXJyb3IAAAH0AAAAAAAAABhDb2xsYXRlcmFsQ29lZmZNYXRoRXJyb3IAAAH1AAAAAAAAABJEZWJ0Q29lZmZNYXRoRXJyb3IAAAAAAfY=",
        "AAAAAQAAAAAAAAAAAAAADkZsYXNoTG9hbkFzc2V0AAAAAAADAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAGYm9ycm93AAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAAEEluaXRSZXNlcnZlSW5wdXQAAAACAAAAAAAAABJkZWJ0X3Rva2VuX2FkZHJlc3MAAAAAABMAAAAAAAAAD3NfdG9rZW5fYWRkcmVzcwAAAAAT",
        "AAAAAQAAABhJbnRlcmVzdCByYXRlIHBhcmFtZXRlcnMAAAAAAAAACElSUGFyYW1zAAAABAAAAAAAAAAFYWxwaGEAAAAAAAAEAAAAAAAAAAxpbml0aWFsX3JhdGUAAAAEAAAAAAAAAAhtYXhfcmF0ZQAAAAQAAAAAAAAADXNjYWxpbmdfY29lZmYAAAAAAAAE",
        "AAAAAQAAAAAAAAAAAAAAD1ByaWNlRmVlZENvbmZpZwAAAAADAAAAAAAAAA5hc3NldF9kZWNpbWFscwAAAAAABAAAAAAAAAAEZmVlZAAAABMAAAAAAAAADWZlZWRfZGVjaW1hbHMAAAAAAAAE",
        "AAAAAQAAAAAAAAAAAAAADlByaWNlRmVlZElucHV0AAAAAAAEAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAADmFzc2V0X2RlY2ltYWxzAAAAAAAEAAAAAAAAAARmZWVkAAAAEwAAAAAAAAANZmVlZF9kZWNpbWFscwAAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAABgAAAAAAAAARYm9ycm93aW5nX2VuYWJsZWQAAAAAAAABAAAAaFNwZWNpZmllcyB3aGF0IGZyYWN0aW9uIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGNvdW50cyB0b3dhcmQKdGhlIHBvcnRmb2xpbyBjb2xsYXRlcmFsIHZhbHVlIFswJSwgMTAwJV0uAAAACGRpc2NvdW50AAAABAAAAAAAAAAJaXNfYWN0aXZlAAAAAAAAAQAAAAAAAAAJbGlxX2JvbnVzAAAAAAAABAAAAAAAAAAHbGlxX2NhcAAAAAALAAAAAAAAAAh1dGlsX2NhcAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAC1Jlc2VydmVEYXRhAAAAAAkAAAAAAAAAC2JvcnJvd2VyX2FyAAAAAAsAAAAAAAAAC2JvcnJvd2VyX2lyAAAAAAsAAAAAAAAADWNvbmZpZ3VyYXRpb24AAAAAAAfQAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAAAAAAABJkZWJ0X3Rva2VuX2FkZHJlc3MAAAAAABMAAABEVGhlIGlkIG9mIHRoZSByZXNlcnZlIChwb3NpdGlvbiBpbiB0aGUgbGlzdCBvZiB0aGUgYWN0aXZlIHJlc2VydmVzKS4AAAACaWQAAAAAA+4AAAABAAAAAAAAABVsYXN0X3VwZGF0ZV90aW1lc3RhbXAAAAAAAAAGAAAAAAAAAAlsZW5kZXJfYXIAAAAAAAALAAAAAAAAAAlsZW5kZXJfaXIAAAAAAAALAAAAAAAAAA9zX3Rva2VuX2FkZHJlc3MAAAAAEw==",
        "AAAAAQAAAH9JbXBsZW1lbnRzIHRoZSBiaXRtYXAgbG9naWMgdG8gaGFuZGxlIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24uCkV2ZW4gcG9zaXRpb25zIGlzIGNvbGxhdGVyYWwgZmxhZ3MgYW5kIHVuZXZlbiBpcyBib3Jyb3dpbmcgZmxhZ3MuAAAAAAAAAAARVXNlckNvbmZpZ3VyYXRpb24AAAAAAAABAAAAAAAAAAEwAAAAAAAACg==",
        "AAAAAQAAAC9QcmljZSBkYXRhIGZvciBhbiBhc3NldCBhdCBhIHNwZWNpZmljIHRpbWVzdGFtcAAAAAAAAAAACVByaWNlRGF0YQAAAAAAAAIAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg=="
            ]);
    }
    async initialize<R extends ResponseTypes = undefined>({admin, treasury, flash_loan_fee, ir_params}: {admin: Address, treasury: Address, flash_loan_fee: u32, ir_params: IRParams}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", {admin, treasury, flash_loan_fee, ir_params}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("initialize", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async upgrade<R extends ResponseTypes = undefined>({new_wasm_hash}: {new_wasm_hash: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'upgrade',
            args: this.spec.funcArgsToScVals("upgrade", {new_wasm_hash}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("upgrade", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async upgradeSToken<R extends ResponseTypes = undefined>({asset, new_wasm_hash}: {asset: Address, new_wasm_hash: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'upgrade_s_token',
            args: this.spec.funcArgsToScVals("upgrade_s_token", {asset, new_wasm_hash}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("upgrade_s_token", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async upgradeDebtToken<R extends ResponseTypes = undefined>({asset, new_wasm_hash}: {asset: Address, new_wasm_hash: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'upgrade_debt_token',
            args: this.spec.funcArgsToScVals("upgrade_debt_token", {asset, new_wasm_hash}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("upgrade_debt_token", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async version<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `u32`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'version',
            args: this.spec.funcArgsToScVals("version", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): u32 => {
                return this.spec.funcResToNative("version", xdr);
            },
        });
    }


    async initReserve<R extends ResponseTypes = undefined>({asset, input}: {asset: Address, input: InitReserveInput}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'init_reserve',
            args: this.spec.funcArgsToScVals("init_reserve", {asset, input}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("init_reserve", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async setReserveStatus<R extends ResponseTypes = undefined>({asset, is_active}: {asset: Address, is_active: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'set_reserve_status',
            args: this.spec.funcArgsToScVals("set_reserve_status", {asset, is_active}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("set_reserve_status", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async setIrParams<R extends ResponseTypes = undefined>({input}: {input: IRParams}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'set_ir_params',
            args: this.spec.funcArgsToScVals("set_ir_params", {input}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("set_ir_params", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async reserveTimestampWindow<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `u64`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'reserve_timestamp_window',
            args: this.spec.funcArgsToScVals("reserve_timestamp_window", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): u64 => {
                return this.spec.funcResToNative("reserve_timestamp_window", xdr);
            },
        });
    }


    async setReserveTimestampWindow<R extends ResponseTypes = undefined>({window}: {window: u64}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'set_reserve_timestamp_window',
            args: this.spec.funcArgsToScVals("set_reserve_timestamp_window", {window}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("set_reserve_timestamp_window", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async irParams<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Option<IRParams>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'ir_params',
            args: this.spec.funcArgsToScVals("ir_params", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Option<IRParams> => {
                return this.spec.funcResToNative("ir_params", xdr);
            },
        });
    }


    async enableBorrowingOnReserve<R extends ResponseTypes = undefined>({asset, enabled}: {asset: Address, enabled: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'enable_borrowing_on_reserve',
            args: this.spec.funcArgsToScVals("enable_borrowing_on_reserve", {asset, enabled}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("enable_borrowing_on_reserve", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async configureAsCollateral<R extends ResponseTypes = undefined>({asset, params}: {asset: Address, params: CollateralParamsInput}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'configure_as_collateral',
            args: this.spec.funcArgsToScVals("configure_as_collateral", {asset, params}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("configure_as_collateral", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async getReserve<R extends ResponseTypes = undefined>({asset}: {asset: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Option<ReserveData>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'get_reserve',
            args: this.spec.funcArgsToScVals("get_reserve", {asset}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Option<ReserveData> => {
                return this.spec.funcResToNative("get_reserve", xdr);
            },
        });
    }


    async collatCoeff<R extends ResponseTypes = undefined>({asset}: {asset: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<i128> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'collat_coeff',
            args: this.spec.funcArgsToScVals("collat_coeff", {asset}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<i128> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("collat_coeff", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async debtCoeff<R extends ResponseTypes = undefined>({asset}: {asset: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<i128> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'debt_coeff',
            args: this.spec.funcArgsToScVals("debt_coeff", {asset}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<i128> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("debt_coeff", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async baseAsset<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<BaseAssetConfig> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'base_asset',
            args: this.spec.funcArgsToScVals("base_asset", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<BaseAssetConfig> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("base_asset", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async setBaseAsset<R extends ResponseTypes = undefined>({asset, decimals}: {asset: Address, decimals: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'set_base_asset',
            args: this.spec.funcArgsToScVals("set_base_asset", {asset, decimals}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("set_base_asset", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async setPriceFeed<R extends ResponseTypes = undefined>({inputs}: {inputs: Array<PriceFeedInput>}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'set_price_feed',
            args: this.spec.funcArgsToScVals("set_price_feed", {inputs}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("set_price_feed", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async priceFeed<R extends ResponseTypes = undefined>({asset}: {asset: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Option<PriceFeedConfig>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'price_feed',
            args: this.spec.funcArgsToScVals("price_feed", {asset}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Option<PriceFeedConfig> => {
                return this.spec.funcResToNative("price_feed", xdr);
            },
        });
    }


    async deposit<R extends ResponseTypes = undefined>({who, asset, amount}: {who: Address, asset: Address, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'deposit',
            args: this.spec.funcArgsToScVals("deposit", {who, asset, amount}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("deposit", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async repay<R extends ResponseTypes = undefined>({who, asset, amount}: {who: Address, asset: Address, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'repay',
            args: this.spec.funcArgsToScVals("repay", {who, asset, amount}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("repay", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async finalizeTransfer<R extends ResponseTypes = undefined>({asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply}: {asset: Address, from: Address, to: Address, amount: i128, balance_from_before: i128, balance_to_before: i128, s_token_supply: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'finalize_transfer',
            args: this.spec.funcArgsToScVals("finalize_transfer", {asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("finalize_transfer", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async withdraw<R extends ResponseTypes = undefined>({who, asset, amount, to}: {who: Address, asset: Address, amount: i128, to: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'withdraw',
            args: this.spec.funcArgsToScVals("withdraw", {who, asset, amount, to}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("withdraw", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async borrow<R extends ResponseTypes = undefined>({who, asset, amount}: {who: Address, asset: Address, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'borrow',
            args: this.spec.funcArgsToScVals("borrow", {who, asset, amount}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("borrow", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async setPause<R extends ResponseTypes = undefined>({value}: {value: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'set_pause',
            args: this.spec.funcArgsToScVals("set_pause", {value}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("set_pause", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async paused<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `boolean`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'paused',
            args: this.spec.funcArgsToScVals("paused", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): boolean => {
                return this.spec.funcResToNative("paused", xdr);
            },
        });
    }


    async treasury<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Address`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'treasury',
            args: this.spec.funcArgsToScVals("treasury", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Address => {
                return this.spec.funcResToNative("treasury", xdr);
            },
        });
    }


    async accountPosition<R extends ResponseTypes = undefined>({who}: {who: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<AccountPosition> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'account_position',
            args: this.spec.funcArgsToScVals("account_position", {who}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<AccountPosition> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("account_position", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async liquidate<R extends ResponseTypes = undefined>({liquidator, who, debt_asset, receive_stoken}: {liquidator: Address, who: Address, debt_asset: Address, receive_stoken: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'liquidate',
            args: this.spec.funcArgsToScVals("liquidate", {liquidator, who, debt_asset, receive_stoken}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("liquidate", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async setAsCollateral<R extends ResponseTypes = undefined>({who, asset, use_as_collateral}: {who: Address, asset: Address, use_as_collateral: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'set_as_collateral',
            args: this.spec.funcArgsToScVals("set_as_collateral", {who, asset, use_as_collateral}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("set_as_collateral", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async userConfiguration<R extends ResponseTypes = undefined>({who}: {who: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<UserConfiguration> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'user_configuration',
            args: this.spec.funcArgsToScVals("user_configuration", {who}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<UserConfiguration> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("user_configuration", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async stokenUnderlyingBalance<R extends ResponseTypes = undefined>({stoken_address}: {stoken_address: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'stoken_underlying_balance',
            args: this.spec.funcArgsToScVals("stoken_underlying_balance", {stoken_address}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): i128 => {
                return this.spec.funcResToNative("stoken_underlying_balance", xdr);
            },
        });
    }


    async tokenBalance<R extends ResponseTypes = undefined>({token, account}: {token: Address, account: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'token_balance',
            args: this.spec.funcArgsToScVals("token_balance", {token, account}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): i128 => {
                return this.spec.funcResToNative("token_balance", xdr);
            },
        });
    }


    async tokenTotalSupply<R extends ResponseTypes = undefined>({token}: {token: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'token_total_supply',
            args: this.spec.funcArgsToScVals("token_total_supply", {token}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): i128 => {
                return this.spec.funcResToNative("token_total_supply", xdr);
            },
        });
    }


    async setFlashLoanFee<R extends ResponseTypes = undefined>({fee}: {fee: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'set_flash_loan_fee',
            args: this.spec.funcArgsToScVals("set_flash_loan_fee", {fee}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("set_flash_loan_fee", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }


    async flashLoanFee<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `u32`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'flash_loan_fee',
            args: this.spec.funcArgsToScVals("flash_loan_fee", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): u32 => {
                return this.spec.funcResToNative("flash_loan_fee", xdr);
            },
        });
    }


    async flashLoan<R extends ResponseTypes = undefined>({who, receiver, loan_assets, params}: {who: Address, receiver: Address, loan_assets: Array<FlashLoanAsset>, params: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    try {
            return await invoke({
            method: 'flash_loan',
            args: this.spec.funcArgsToScVals("flash_loan", {who, receiver, loan_assets, params}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
                return new Ok(this.spec.funcResToNative("flash_loan", xdr));
            },
        });
        } catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err) return err;
            }
            throw e;
        }
    }

}

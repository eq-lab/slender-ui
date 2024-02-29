import { ContractSpec, Address } from '@stellar/stellar-sdk';
import { Buffer } from "buffer";
import { AssembledTransaction, Ok, Err } from './assembled-tx.js';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
  Error_,
  Result,
} from './assembled-tx.js';
import type { ClassOptions, XDR_BASE64 } from './method-options.js';

export * from './assembled-tx.js';
export * from './method-options.js';

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}


export const networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "CBUN7Z2OU3W7O5G6CRQW2J6V4CVLFSBWQPKD5NWIHGRYRT6N6TUQM2YI",
    }
} as const

/**
    
    */
export type DataKey = {tag: "Admin", values: void} | {tag: "BaseAsset", values: void} | {tag: "Reserves", values: void} | {tag: "ReserveAssetKey", values: readonly [string]} | {tag: "ReserveTimestampWindow", values: void} | {tag: "Treasury", values: void} | {tag: "IRParams", values: void} | {tag: "UserConfig", values: readonly [string]} | {tag: "PriceFeed", values: readonly [string]} | {tag: "Pause", values: void} | {tag: "FlashLoanFee", values: void} | {tag: "STokenUnderlyingBalance", values: readonly [string]} | {tag: "TokenSupply", values: readonly [string]} | {tag: "TokenBalance", values: readonly [string, string]} | {tag: "InitialHealth", values: void};

/**
    
    */
export interface LiquidationAsset {
  /**
    
    */
asset: string;
  /**
    
    */
coeff: Option<i128>;
  /**
    
    */
comp_balance: i128;
  /**
    
    */
lp_balance: Option<i128>;
  /**
    
    */
reserve: ReserveData;
}

/**
    
    */
export interface LoanAsset {
  /**
    
    */
amount: i128;
  /**
    
    */
asset: string;
  /**
    
    */
borrow: boolean;
  /**
    
    */
premium: i128;
}

/**
    
    */
export interface AccountPosition {
  /**
    
    */
debt: i128;
  /**
    
    */
discounted_collateral: i128;
  /**
    
    */
npv: i128;
}

/**
    
    */
export interface AssetBalance {
  /**
    
    */
asset: string;
  /**
    
    */
balance: i128;
}

/**
    
    */
export interface BaseAssetConfig {
  /**
    
    */
address: string;
  /**
    
    */
decimals: u32;
}

/**
    Collateralization parameters
    */
export interface CollateralParamsInput {
  /**
    Specifies what fraction of the underlying asset counts toward
    * the portfolio collateral value [0%, 100%].
    */
discount: u32;
  /**
    The total amount of an asset the protocol accepts into the market.
    */
liq_cap: i128;
  /**
    Liquidation order
    */
pen_order: u32;
  /**
    
    */
util_cap: u32;
}

/**
    
    */
export const Errors = {
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
  108: {message:""},
  109: {message:""},
  110: {message:""},
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
/**
    
    */
export interface FlashLoanAsset {
  /**
    
    */
amount: i128;
  /**
    
    */
asset: string;
  /**
    
    */
borrow: boolean;
}

/**
    Interest rate parameters
    */
export interface IRParams {
  /**
    
    */
alpha: u32;
  /**
    
    */
initial_rate: u32;
  /**
    
    */
max_rate: u32;
  /**
    
    */
scaling_coeff: u32;
}

/**
    
    */
export type OracleAsset = {tag: "Stellar", values: readonly [string]} | {tag: "Other", values: readonly [string]};

/**
    
    */
export interface PriceFeed {
  /**
    
    */
feed: string;
  /**
    
    */
feed_asset: OracleAsset;
  /**
    
    */
feed_decimals: u32;
  /**
    
    */
twap_records: u32;
}

/**
    
    */
export interface PriceFeedConfig {
  /**
    
    */
asset_decimals: u32;
  /**
    
    */
feeds: Array<PriceFeed>;
}

/**
    
    */
export interface PriceFeedConfigInput {
  /**
    
    */
asset: string;
  /**
    
    */
asset_decimals: u32;
  /**
    
    */
feeds: Array<PriceFeed>;
}

/**
    
    */
export interface ReserveConfiguration {
  /**
    
    */
borrowing_enabled: boolean;
  /**
    Specifies what fraction of the underlying asset counts toward
    * the portfolio collateral value [0%, 100%].
    */
discount: u32;
  /**
    
    */
is_active: boolean;
  /**
    
    */
liquidity_cap: i128;
  /**
    
    */
pen_order: u32;
  /**
    
    */
util_cap: u32;
}

/**
    
    */
export interface ReserveData {
  /**
    
    */
borrower_ar: i128;
  /**
    
    */
borrower_ir: i128;
  /**
    
    */
configuration: ReserveConfiguration;
  /**
    The id of the reserve (position in the list of the active reserves).
    */
id: Buffer;
  /**
    
    */
last_update_timestamp: u64;
  /**
    
    */
lender_ar: i128;
  /**
    
    */
lender_ir: i128;
  /**
    
    */
reserve_type: ReserveType;
}

/**
    
    */
export type ReserveType = {tag: "Fungible", values: readonly [string, string]} | {tag: "RWA", values: void};

/**
    Implements the bitmap logic to handle the user configuration.
    * Even positions is collateral flags and uneven is borrowing flags.
    */
export type UserConfiguration = readonly [u128];
/**
    
    */
export type Asset = {tag: "Stellar", values: readonly [string]} | {tag: "Other", values: readonly [string]};

/**
    
    */
export interface PriceData {
  /**
    
    */
price: i128;
  /**
    
    */
timestamp: u64;
}


export class Contract {
    spec: ContractSpec;
    constructor(public readonly options: ClassOptions) {
        this.spec = new ContractSpec([
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAADwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAJQmFzZUFzc2V0AAAAAAAAAAAAAAAAAAAIUmVzZXJ2ZXMAAAABAAAAAAAAAA9SZXNlcnZlQXNzZXRLZXkAAAAAAQAAABMAAAAAAAAAAAAAABZSZXNlcnZlVGltZXN0YW1wV2luZG93AAAAAAAAAAAAAAAAAAhUcmVhc3VyeQAAAAAAAAAAAAAACElSUGFyYW1zAAAAAQAAAAAAAAAKVXNlckNvbmZpZwAAAAAAAQAAABMAAAABAAAAAAAAAAlQcmljZUZlZWQAAAAAAAABAAAAEwAAAAAAAAAAAAAABVBhdXNlAAAAAAAAAAAAAAAAAAAMRmxhc2hMb2FuRmVlAAAAAQAAAAAAAAAXU1Rva2VuVW5kZXJseWluZ0JhbGFuY2UAAAAAAQAAABMAAAABAAAAAAAAAAtUb2tlblN1cHBseQAAAAABAAAAEwAAAAEAAAAAAAAADFRva2VuQmFsYW5jZQAAAAIAAAATAAAAEwAAAAAAAAAAAAAADUluaXRpYWxIZWFsdGgAAAA=",
        "AAAAAQAAAAAAAAAAAAAAEExpcXVpZGF0aW9uQXNzZXQAAAAFAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABWNvZWZmAAAAAAAD6AAAAAsAAAAAAAAADGNvbXBfYmFsYW5jZQAAAAsAAAAAAAAACmxwX2JhbGFuY2UAAAAAA+gAAAALAAAAAAAAAAdyZXNlcnZlAAAAB9AAAAALUmVzZXJ2ZURhdGEA",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAh0cmVhc3VyeQAAABMAAAAAAAAADmZsYXNoX2xvYW5fZmVlAAAAAAAEAAAAAAAAAA5pbml0aWFsX2hlYWx0aAAAAAAABAAAAAAAAAAJaXJfcGFyYW1zAAAAAAAH0AAAAAhJUlBhcmFtcwAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAPdXBncmFkZV9zX3Rva2VuAAAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAANbmV3X3dhc21faGFzaAAAAAAAA+4AAAAgAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAASdXBncmFkZV9kZWJ0X3Rva2VuAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAADW5ld193YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAHdmVyc2lvbgAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAMaW5pdF9yZXNlcnZlAAAAAgAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAxyZXNlcnZlX3R5cGUAAAfQAAAAC1Jlc2VydmVUeXBlAAAAAAEAAAPpAAAD7QAAAAAAAAAD",
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
        "AAAAAAAAAAAAAAAOaW5pdGlhbF9oZWFsdGgAAAAAAAAAAAABAAAD6QAAAAQAAAAD",
        "AAAAAAAAAAAAAAASc2V0X2luaXRpYWxfaGVhbHRoAAAAAAABAAAAAAAAAAV2YWx1ZQAAAAAAAAQAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAPc2V0X3ByaWNlX2ZlZWRzAAAAAAEAAAAAAAAABmlucHV0cwAAAAAD6gAAB9AAAAAUUHJpY2VGZWVkQ29uZmlnSW5wdXQAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAALcHJpY2VfZmVlZHMAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+gAAAfQAAAAD1ByaWNlRmVlZENvbmZpZwA=",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAFcmVwYXkAAAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAARZmluYWxpemVfdHJhbnNmZXIAAAAAAAAHAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAABNiYWxhbmNlX2Zyb21fYmVmb3JlAAAAAAsAAAAAAAAAEWJhbGFuY2VfdG9fYmVmb3JlAAAAAAAACwAAAAAAAAAOc190b2tlbl9zdXBwbHkAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAEAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAnRvAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAGYm9ycm93AAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAJc2V0X3BhdXNlAAAAAAAAAQAAAAAAAAAFdmFsdWUAAAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAGcGF1c2VkAAAAAAAAAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAIdHJlYXN1cnkAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAQYWNjb3VudF9wb3NpdGlvbgAAAAEAAAAAAAAAA3dobwAAAAATAAAAAQAAA+kAAAfQAAAAD0FjY291bnRQb3NpdGlvbgAAAAAD",
        "AAAAAAAAAAAAAAAJbGlxdWlkYXRlAAAAAAAAAwAAAAAAAAAKbGlxdWlkYXRvcgAAAAAAEwAAAAAAAAADd2hvAAAAABMAAAAAAAAADnJlY2VpdmVfc3Rva2VuAAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAARc2V0X2FzX2NvbGxhdGVyYWwAAAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAABF1c2VfYXNfY29sbGF0ZXJhbAAAAAAAAAEAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAASdXNlcl9jb25maWd1cmF0aW9uAAAAAAABAAAAAAAAAAN3aG8AAAAAEwAAAAEAAAPpAAAH0AAAABFVc2VyQ29uZmlndXJhdGlvbgAAAAAAAAM=",
        "AAAAAAAAAAAAAAAZc3Rva2VuX3VuZGVybHlpbmdfYmFsYW5jZQAAAAAAAAEAAAAAAAAADnN0b2tlbl9hZGRyZXNzAAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAANdG9rZW5fYmFsYW5jZQAAAAAAAAIAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAASdG9rZW5fdG90YWxfc3VwcGx5AAAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAASc2V0X2ZsYXNoX2xvYW5fZmVlAAAAAAABAAAAAAAAAANmZWUAAAAABAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAOZmxhc2hfbG9hbl9mZWUAAAAAAAAAAAABAAAABA==",
        "AAAAAAAAAAAAAAAKZmxhc2hfbG9hbgAAAAAABAAAAAAAAAADd2hvAAAAABMAAAAAAAAACHJlY2VpdmVyAAAAEwAAAAAAAAALbG9hbl9hc3NldHMAAAAD6gAAB9AAAAAORmxhc2hMb2FuQXNzZXQAAAAAAAAAAAAGcGFyYW1zAAAAAAAOAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAARdHdhcF9tZWRpYW5fcHJpY2UAAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAPpAAAACwAAAAM=",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAACAAAAAAAAAAJpZAAAAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAAAs=",
        "AAAAAQAAAAAAAAAAAAAACUxvYW5Bc3NldAAAAAAAAAQAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZib3Jyb3cAAAAAAAEAAAAAAAAAB3ByZW1pdW0AAAAACw==",
        "AAAAAQAAAAAAAAAAAAAAD0FjY291bnRQb3NpdGlvbgAAAAADAAAAAAAAAARkZWJ0AAAACwAAAAAAAAAVZGlzY291bnRlZF9jb2xsYXRlcmFsAAAAAAAACwAAAAAAAAADbnB2AAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAADEFzc2V0QmFsYW5jZQAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAHYmFsYW5jZQAAAAAL",
        "AAAAAQAAAAAAAAAAAAAAD0Jhc2VBc3NldENvbmZpZwAAAAACAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAACGRlY2ltYWxzAAAABA==",
        "AAAAAQAAABxDb2xsYXRlcmFsaXphdGlvbiBwYXJhbWV0ZXJzAAAAAAAAABVDb2xsYXRlcmFsUGFyYW1zSW5wdXQAAAAAAAAEAAAAaFNwZWNpZmllcyB3aGF0IGZyYWN0aW9uIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGNvdW50cyB0b3dhcmQKdGhlIHBvcnRmb2xpbyBjb2xsYXRlcmFsIHZhbHVlIFswJSwgMTAwJV0uAAAACGRpc2NvdW50AAAABAAAAEJUaGUgdG90YWwgYW1vdW50IG9mIGFuIGFzc2V0IHRoZSBwcm90b2NvbCBhY2NlcHRzIGludG8gdGhlIG1hcmtldC4AAAAAAAdsaXFfY2FwAAAAAAsAAAARTGlxdWlkYXRpb24gb3JkZXIAAAAAAAAJcGVuX29yZGVyAAAAAAAABAAAAAAAAAAIdXRpbF9jYXAAAAAE",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAKAAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAAAAAAAAAAAAA1VbmluaXRpYWxpemVkAAAAAAAAAQAAAAAAAAALTm9QcmljZUZlZWQAAAAAAgAAAAAAAAAGUGF1c2VkAAAAAAADAAAAAAAAABZOb1Jlc2VydmVFeGlzdEZvckFzc2V0AAAAAABkAAAAAAAAAA9Ob0FjdGl2ZVJlc2VydmUAAAAAZQAAAAAAAAANUmVzZXJ2ZUZyb3plbgAAAAAAAGYAAAAAAAAAG1Jlc2VydmVzTWF4Q2FwYWNpdHlFeGNlZWRlZAAAAABnAAAAAAAAAA9Ob1ByaWNlRm9yQXNzZXQAAAAAaAAAAAAAAAAZUmVzZXJ2ZUFscmVhZHlJbml0aWFsaXplZAAAAAAAAGkAAAAAAAAAEUludmFsaWRBc3NldFByaWNlAAAAAAAAagAAAAAAAAAXQmFzZUFzc2V0Tm90SW5pdGlhbGl6ZWQAAAAAawAAAAAAAAAbSW5pdGlhbEhlYWx0aE5vdEluaXRpYWxpemVkAAAAAGwAAAAAAAAAHExpcXVpZGF0aW9uT3JkZXJNdXN0QmVVbmlxdWUAAABtAAAAAAAAAAtOb3RGdW5naWJsZQAAAABuAAAAAAAAABZVc2VyQ29uZmlnSW52YWxpZEluZGV4AAAAAADIAAAAAAAAAB1Ob3RFbm91Z2hBdmFpbGFibGVVc2VyQmFsYW5jZQAAAAAAAMkAAAAAAAAAE1VzZXJDb25maWdOb3RFeGlzdHMAAAAAygAAAAAAAAAMTXVzdEhhdmVEZWJ0AAAAywAAAAAAAAAPTXVzdE5vdEhhdmVEZWJ0AAAAAMwAAAAAAAAAE0JvcnJvd2luZ05vdEVuYWJsZWQAAAABLAAAAAAAAAASQmVsb3dJbml0aWFsSGVhbHRoAAAAAAEtAAAAAAAAAAtCYWRQb3NpdGlvbgAAAAEuAAAAAAAAAAxHb29kUG9zaXRpb24AAAEvAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAABMAAAAAAAAAAXVmFsaWRhdGVCb3Jyb3dNYXRoRXJyb3IAAAABMQAAAAAAAAAYQ2FsY0FjY291bnREYXRhTWF0aEVycm9yAAABMgAAAAAAAAASTGlxdWlkYXRlTWF0aEVycm9yAAAAAAE1AAAAAAAAABpNdXN0Tm90QmVJbkNvbGxhdGVyYWxBc3NldAAAAAABNgAAAAAAAAAWVXRpbGl6YXRpb25DYXBFeGNlZWRlZAAAAAABNwAAAAAAAAAOTGlxQ2FwRXhjZWVkZWQAAAAAATgAAAAAAAAAFkZsYXNoTG9hblJlY2VpdmVyRXJyb3IAAAAAATkAAAAAAAAAEU1hdGhPdmVyZmxvd0Vycm9yAAAAAAABkAAAAAAAAAAZTXVzdEJlTHRlUGVyY2VudGFnZUZhY3RvcgAAAAAAAZEAAAAAAAAAGE11c3RCZUx0UGVyY2VudGFnZUZhY3RvcgAAAZIAAAAAAAAAGE11c3RCZUd0UGVyY2VudGFnZUZhY3RvcgAAAZMAAAAAAAAADk11c3RCZVBvc2l0aXZlAAAAAAGUAAAAAAAAABRBY2NydWVkUmF0ZU1hdGhFcnJvcgAAAfQAAAAAAAAAGENvbGxhdGVyYWxDb2VmZk1hdGhFcnJvcgAAAfUAAAAAAAAAEkRlYnRDb2VmZk1hdGhFcnJvcgAAAAAB9g==",
        "AAAAAQAAAAAAAAAAAAAADkZsYXNoTG9hbkFzc2V0AAAAAAADAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAGYm9ycm93AAAAAAAB",
        "AAAAAQAAABhJbnRlcmVzdCByYXRlIHBhcmFtZXRlcnMAAAAAAAAACElSUGFyYW1zAAAABAAAAAAAAAAFYWxwaGEAAAAAAAAEAAAAAAAAAAxpbml0aWFsX3JhdGUAAAAEAAAAAAAAAAhtYXhfcmF0ZQAAAAQAAAAAAAAADXNjYWxpbmdfY29lZmYAAAAAAAAE",
        "AAAAAgAAAAAAAAAAAAAAC09yYWNsZUFzc2V0AAAAAAIAAAABAAAAAAAAAAdTdGVsbGFyAAAAAAEAAAATAAAAAQAAAAAAAAAFT3RoZXIAAAAAAAABAAAAEQ==",
        "AAAAAQAAAAAAAAAAAAAACVByaWNlRmVlZAAAAAAAAAQAAAAAAAAABGZlZWQAAAATAAAAAAAAAApmZWVkX2Fzc2V0AAAAAAfQAAAAC09yYWNsZUFzc2V0AAAAAAAAAAANZmVlZF9kZWNpbWFscwAAAAAAAAQAAAAAAAAADHR3YXBfcmVjb3JkcwAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAD1ByaWNlRmVlZENvbmZpZwAAAAACAAAAAAAAAA5hc3NldF9kZWNpbWFscwAAAAAABAAAAAAAAAAFZmVlZHMAAAAAAAPqAAAH0AAAAAlQcmljZUZlZWQAAAA=",
        "AAAAAQAAAAAAAAAAAAAAFFByaWNlRmVlZENvbmZpZ0lucHV0AAAAAwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAA5hc3NldF9kZWNpbWFscwAAAAAABAAAAAAAAAAFZmVlZHMAAAAAAAPqAAAH0AAAAAlQcmljZUZlZWQAAAA=",
        "AAAAAQAAAAAAAAAAAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAABgAAAAAAAAARYm9ycm93aW5nX2VuYWJsZWQAAAAAAAABAAAAaFNwZWNpZmllcyB3aGF0IGZyYWN0aW9uIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGNvdW50cyB0b3dhcmQKdGhlIHBvcnRmb2xpbyBjb2xsYXRlcmFsIHZhbHVlIFswJSwgMTAwJV0uAAAACGRpc2NvdW50AAAABAAAAAAAAAAJaXNfYWN0aXZlAAAAAAAAAQAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAsAAAAAAAAACXBlbl9vcmRlcgAAAAAAAAQAAAAAAAAACHV0aWxfY2FwAAAABA==",
        "AAAAAQAAAAAAAAAAAAAAC1Jlc2VydmVEYXRhAAAAAAgAAAAAAAAAC2JvcnJvd2VyX2FyAAAAAAsAAAAAAAAAC2JvcnJvd2VyX2lyAAAAAAsAAAAAAAAADWNvbmZpZ3VyYXRpb24AAAAAAAfQAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAARFRoZSBpZCBvZiB0aGUgcmVzZXJ2ZSAocG9zaXRpb24gaW4gdGhlIGxpc3Qgb2YgdGhlIGFjdGl2ZSByZXNlcnZlcykuAAAAAmlkAAAAAAPuAAAAAQAAAAAAAAAVbGFzdF91cGRhdGVfdGltZXN0YW1wAAAAAAAABgAAAAAAAAAJbGVuZGVyX2FyAAAAAAAACwAAAAAAAAAJbGVuZGVyX2lyAAAAAAAACwAAAAAAAAAMcmVzZXJ2ZV90eXBlAAAH0AAAAAtSZXNlcnZlVHlwZQA=",
        "AAAAAgAAAAAAAAAAAAAAC1Jlc2VydmVUeXBlAAAAAAIAAAABAAAAN0Z1bmdpYmxlIHJlc2VydmUgZm9yIHdoaWNoIGNyZWF0ZWQgc1Rva2VuIGFuZCBkZWJ0VG9rZW4AAAAACEZ1bmdpYmxlAAAAAgAAABMAAAATAAAAAAAAAAtSV0EgcmVzZXJ2ZQAAAAADUldBAA==",
        "AAAAAQAAAH9JbXBsZW1lbnRzIHRoZSBiaXRtYXAgbG9naWMgdG8gaGFuZGxlIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24uCkV2ZW4gcG9zaXRpb25zIGlzIGNvbGxhdGVyYWwgZmxhZ3MgYW5kIHVuZXZlbiBpcyBib3Jyb3dpbmcgZmxhZ3MuAAAAAAAAAAARVXNlckNvbmZpZ3VyYXRpb24AAAAAAAABAAAAAAAAAAEwAAAAAAAACg==",
        "AAAAAgAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAAAEAAAAAAAAAB1N0ZWxsYXIAAAAAAQAAABMAAAABAAAAAAAAAAVPdGhlcgAAAAAAAAEAAAAR",
        "AAAAAQAAAAAAAAAAAAAACVByaWNlRGF0YQAAAAAAAAIAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg=="
        ]);
    }
    private readonly parsers = {
        initialize: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("initialize", result))
        },
        upgrade: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("upgrade", result))
        },
        upgradeSToken: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("upgrade_s_token", result))
        },
        upgradeDebtToken: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("upgrade_debt_token", result))
        },
        version: (result: XDR_BASE64): u32 => this.spec.funcResToNative("version", result),
        initReserve: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("init_reserve", result))
        },
        setReserveStatus: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("set_reserve_status", result))
        },
        setIrParams: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("set_ir_params", result))
        },
        reserveTimestampWindow: (result: XDR_BASE64): u64 => this.spec.funcResToNative("reserve_timestamp_window", result),
        setReserveTimestampWindow: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("set_reserve_timestamp_window", result))
        },
        irParams: (result: XDR_BASE64): Option<IRParams> => this.spec.funcResToNative("ir_params", result),
        enableBorrowingOnReserve: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("enable_borrowing_on_reserve", result))
        },
        configureAsCollateral: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("configure_as_collateral", result))
        },
        getReserve: (result: XDR_BASE64): Option<ReserveData> => this.spec.funcResToNative("get_reserve", result),
        collatCoeff: (result: XDR_BASE64 | Err): Ok<i128> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("collat_coeff", result))
        },
        debtCoeff: (result: XDR_BASE64 | Err): Ok<i128> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("debt_coeff", result))
        },
        baseAsset: (result: XDR_BASE64 | Err): Ok<BaseAssetConfig> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("base_asset", result))
        },
        setBaseAsset: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("set_base_asset", result))
        },
        initialHealth: (result: XDR_BASE64 | Err): Ok<u32> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("initial_health", result))
        },
        setInitialHealth: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("set_initial_health", result))
        },
        setPriceFeeds: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("set_price_feeds", result))
        },
        priceFeeds: (result: XDR_BASE64): Option<PriceFeedConfig> => this.spec.funcResToNative("price_feeds", result),
        deposit: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("deposit", result))
        },
        repay: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("repay", result))
        },
        finalizeTransfer: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("finalize_transfer", result))
        },
        withdraw: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("withdraw", result))
        },
        borrow: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("borrow", result))
        },
        setPause: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("set_pause", result))
        },
        paused: (result: XDR_BASE64): boolean => this.spec.funcResToNative("paused", result),
        treasury: (result: XDR_BASE64): string => this.spec.funcResToNative("treasury", result),
        accountPosition: (result: XDR_BASE64 | Err): Ok<AccountPosition> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("account_position", result))
        },
        liquidate: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("liquidate", result))
        },
        setAsCollateral: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("set_as_collateral", result))
        },
        userConfiguration: (result: XDR_BASE64 | Err): Ok<UserConfiguration> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("user_configuration", result))
        },
        stokenUnderlyingBalance: (result: XDR_BASE64): i128 => this.spec.funcResToNative("stoken_underlying_balance", result),
        tokenBalance: (result: XDR_BASE64): i128 => this.spec.funcResToNative("token_balance", result),
        tokenTotalSupply: (result: XDR_BASE64): i128 => this.spec.funcResToNative("token_total_supply", result),
        setFlashLoanFee: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("set_flash_loan_fee", result))
        },
        flashLoanFee: (result: XDR_BASE64): u32 => this.spec.funcResToNative("flash_loan_fee", result),
        flashLoan: (result: XDR_BASE64 | Err): Ok<void> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("flash_loan", result))
        },
        twapMedianPrice: (result: XDR_BASE64 | Err): Ok<i128> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("twap_median_price", result))
        },
        balance: (result: XDR_BASE64): i128 => this.spec.funcResToNative("balance", result)
    };
    private txFromJSON = <T>(json: string): AssembledTransaction<T> => {
        const { method, ...tx } = JSON.parse(json)
        return AssembledTransaction.fromJSON(
            {
                ...this.options,
                method,
                parseResultXdr: this.parsers[method],
            },
            tx,
        );
    }
    public readonly fromJSON = {
        initialize: this.txFromJSON<ReturnType<typeof this.parsers['initialize']>>,
        upgrade: this.txFromJSON<ReturnType<typeof this.parsers['upgrade']>>,
        upgradeSToken: this.txFromJSON<ReturnType<typeof this.parsers['upgradeSToken']>>,
        upgradeDebtToken: this.txFromJSON<ReturnType<typeof this.parsers['upgradeDebtToken']>>,
        version: this.txFromJSON<ReturnType<typeof this.parsers['version']>>,
        initReserve: this.txFromJSON<ReturnType<typeof this.parsers['initReserve']>>,
        setReserveStatus: this.txFromJSON<ReturnType<typeof this.parsers['setReserveStatus']>>,
        setIrParams: this.txFromJSON<ReturnType<typeof this.parsers['setIrParams']>>,
        reserveTimestampWindow: this.txFromJSON<ReturnType<typeof this.parsers['reserveTimestampWindow']>>,
        setReserveTimestampWindow: this.txFromJSON<ReturnType<typeof this.parsers['setReserveTimestampWindow']>>,
        irParams: this.txFromJSON<ReturnType<typeof this.parsers['irParams']>>,
        enableBorrowingOnReserve: this.txFromJSON<ReturnType<typeof this.parsers['enableBorrowingOnReserve']>>,
        configureAsCollateral: this.txFromJSON<ReturnType<typeof this.parsers['configureAsCollateral']>>,
        getReserve: this.txFromJSON<ReturnType<typeof this.parsers['getReserve']>>,
        collatCoeff: this.txFromJSON<ReturnType<typeof this.parsers['collatCoeff']>>,
        debtCoeff: this.txFromJSON<ReturnType<typeof this.parsers['debtCoeff']>>,
        baseAsset: this.txFromJSON<ReturnType<typeof this.parsers['baseAsset']>>,
        setBaseAsset: this.txFromJSON<ReturnType<typeof this.parsers['setBaseAsset']>>,
        initialHealth: this.txFromJSON<ReturnType<typeof this.parsers['initialHealth']>>,
        setInitialHealth: this.txFromJSON<ReturnType<typeof this.parsers['setInitialHealth']>>,
        setPriceFeeds: this.txFromJSON<ReturnType<typeof this.parsers['setPriceFeeds']>>,
        priceFeeds: this.txFromJSON<ReturnType<typeof this.parsers['priceFeeds']>>,
        deposit: this.txFromJSON<ReturnType<typeof this.parsers['deposit']>>,
        repay: this.txFromJSON<ReturnType<typeof this.parsers['repay']>>,
        finalizeTransfer: this.txFromJSON<ReturnType<typeof this.parsers['finalizeTransfer']>>,
        withdraw: this.txFromJSON<ReturnType<typeof this.parsers['withdraw']>>,
        borrow: this.txFromJSON<ReturnType<typeof this.parsers['borrow']>>,
        setPause: this.txFromJSON<ReturnType<typeof this.parsers['setPause']>>,
        paused: this.txFromJSON<ReturnType<typeof this.parsers['paused']>>,
        treasury: this.txFromJSON<ReturnType<typeof this.parsers['treasury']>>,
        accountPosition: this.txFromJSON<ReturnType<typeof this.parsers['accountPosition']>>,
        liquidate: this.txFromJSON<ReturnType<typeof this.parsers['liquidate']>>,
        setAsCollateral: this.txFromJSON<ReturnType<typeof this.parsers['setAsCollateral']>>,
        userConfiguration: this.txFromJSON<ReturnType<typeof this.parsers['userConfiguration']>>,
        stokenUnderlyingBalance: this.txFromJSON<ReturnType<typeof this.parsers['stokenUnderlyingBalance']>>,
        tokenBalance: this.txFromJSON<ReturnType<typeof this.parsers['tokenBalance']>>,
        tokenTotalSupply: this.txFromJSON<ReturnType<typeof this.parsers['tokenTotalSupply']>>,
        setFlashLoanFee: this.txFromJSON<ReturnType<typeof this.parsers['setFlashLoanFee']>>,
        flashLoanFee: this.txFromJSON<ReturnType<typeof this.parsers['flashLoanFee']>>,
        flashLoan: this.txFromJSON<ReturnType<typeof this.parsers['flashLoan']>>,
        twapMedianPrice: this.txFromJSON<ReturnType<typeof this.parsers['twapMedianPrice']>>,
        balance: this.txFromJSON<ReturnType<typeof this.parsers['balance']>>
    }
        /**
    * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    initialize = async ({admin, treasury, flash_loan_fee, initial_health, ir_params}: {admin: string, treasury: string, flash_loan_fee: u32, initial_health: u32, ir_params: IRParams}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", {admin: new Address(admin), treasury: new Address(treasury), flash_loan_fee, initial_health, ir_params}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['initialize'],
        });
    }


        /**
    * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    upgrade = async ({new_wasm_hash}: {new_wasm_hash: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'upgrade',
            args: this.spec.funcArgsToScVals("upgrade", {new_wasm_hash}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['upgrade'],
        });
    }


        /**
    * Construct and simulate a upgrade_s_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    upgradeSToken = async ({asset, new_wasm_hash}: {asset: string, new_wasm_hash: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'upgrade_s_token',
            args: this.spec.funcArgsToScVals("upgrade_s_token", {asset: new Address(asset), new_wasm_hash}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['upgradeSToken'],
        });
    }


        /**
    * Construct and simulate a upgrade_debt_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    upgradeDebtToken = async ({asset, new_wasm_hash}: {asset: string, new_wasm_hash: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'upgrade_debt_token',
            args: this.spec.funcArgsToScVals("upgrade_debt_token", {asset: new Address(asset), new_wasm_hash}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['upgradeDebtToken'],
        });
    }


        /**
    * Construct and simulate a version transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    version = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'version',
            args: this.spec.funcArgsToScVals("version", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['version'],
        });
    }


        /**
    * Construct and simulate a init_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    initReserve = async ({asset, reserve_type}: {asset: string, reserve_type: ReserveType}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'init_reserve',
            args: this.spec.funcArgsToScVals("init_reserve", {asset: new Address(asset), reserve_type}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['initReserve'],
        });
    }


        /**
    * Construct and simulate a set_reserve_status transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setReserveStatus = async ({asset, is_active}: {asset: string, is_active: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_reserve_status',
            args: this.spec.funcArgsToScVals("set_reserve_status", {asset: new Address(asset), is_active}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setReserveStatus'],
        });
    }


        /**
    * Construct and simulate a set_ir_params transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setIrParams = async ({input}: {input: IRParams}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_ir_params',
            args: this.spec.funcArgsToScVals("set_ir_params", {input}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setIrParams'],
        });
    }


        /**
    * Construct and simulate a reserve_timestamp_window transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    reserveTimestampWindow = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'reserve_timestamp_window',
            args: this.spec.funcArgsToScVals("reserve_timestamp_window", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['reserveTimestampWindow'],
        });
    }


        /**
    * Construct and simulate a set_reserve_timestamp_window transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setReserveTimestampWindow = async ({window}: {window: u64}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_reserve_timestamp_window',
            args: this.spec.funcArgsToScVals("set_reserve_timestamp_window", {window}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setReserveTimestampWindow'],
        });
    }


        /**
    * Construct and simulate a ir_params transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    irParams = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'ir_params',
            args: this.spec.funcArgsToScVals("ir_params", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['irParams'],
        });
    }


        /**
    * Construct and simulate a enable_borrowing_on_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    enableBorrowingOnReserve = async ({asset, enabled}: {asset: string, enabled: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'enable_borrowing_on_reserve',
            args: this.spec.funcArgsToScVals("enable_borrowing_on_reserve", {asset: new Address(asset), enabled}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['enableBorrowingOnReserve'],
        });
    }


        /**
    * Construct and simulate a configure_as_collateral transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    configureAsCollateral = async ({asset, params}: {asset: string, params: CollateralParamsInput}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'configure_as_collateral',
            args: this.spec.funcArgsToScVals("configure_as_collateral", {asset: new Address(asset), params}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['configureAsCollateral'],
        });
    }


        /**
    * Construct and simulate a get_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    getReserve = async ({asset}: {asset: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'get_reserve',
            args: this.spec.funcArgsToScVals("get_reserve", {asset: new Address(asset)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['getReserve'],
        });
    }


        /**
    * Construct and simulate a collat_coeff transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    collatCoeff = async ({asset}: {asset: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'collat_coeff',
            args: this.spec.funcArgsToScVals("collat_coeff", {asset: new Address(asset)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['collatCoeff'],
        });
    }


        /**
    * Construct and simulate a debt_coeff transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    debtCoeff = async ({asset}: {asset: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'debt_coeff',
            args: this.spec.funcArgsToScVals("debt_coeff", {asset: new Address(asset)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['debtCoeff'],
        });
    }


        /**
    * Construct and simulate a base_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    baseAsset = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'base_asset',
            args: this.spec.funcArgsToScVals("base_asset", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['baseAsset'],
        });
    }


        /**
    * Construct and simulate a set_base_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setBaseAsset = async ({asset, decimals}: {asset: string, decimals: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_base_asset',
            args: this.spec.funcArgsToScVals("set_base_asset", {asset: new Address(asset), decimals}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setBaseAsset'],
        });
    }


        /**
    * Construct and simulate a initial_health transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    initialHealth = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'initial_health',
            args: this.spec.funcArgsToScVals("initial_health", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['initialHealth'],
        });
    }


        /**
    * Construct and simulate a set_initial_health transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setInitialHealth = async ({value}: {value: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_initial_health',
            args: this.spec.funcArgsToScVals("set_initial_health", {value}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setInitialHealth'],
        });
    }


        /**
    * Construct and simulate a set_price_feeds transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setPriceFeeds = async ({inputs}: {inputs: Array<PriceFeedConfigInput>}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_price_feeds',
            args: this.spec.funcArgsToScVals("set_price_feeds", {inputs}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setPriceFeeds'],
        });
    }


        /**
    * Construct and simulate a price_feeds transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    priceFeeds = async ({asset}: {asset: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'price_feeds',
            args: this.spec.funcArgsToScVals("price_feeds", {asset: new Address(asset)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['priceFeeds'],
        });
    }


        /**
    * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    deposit = async ({who, asset, amount}: {who: string, asset: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'deposit',
            args: this.spec.funcArgsToScVals("deposit", {who: new Address(who), asset: new Address(asset), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['deposit'],
        });
    }


        /**
    * Construct and simulate a repay transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    repay = async ({who, asset, amount}: {who: string, asset: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'repay',
            args: this.spec.funcArgsToScVals("repay", {who: new Address(who), asset: new Address(asset), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['repay'],
        });
    }


        /**
    * Construct and simulate a finalize_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    finalizeTransfer = async ({asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply}: {asset: string, from: string, to: string, amount: i128, balance_from_before: i128, balance_to_before: i128, s_token_supply: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'finalize_transfer',
            args: this.spec.funcArgsToScVals("finalize_transfer", {asset: new Address(asset), from: new Address(from), to: new Address(to), amount, balance_from_before, balance_to_before, s_token_supply}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['finalizeTransfer'],
        });
    }


        /**
    * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    withdraw = async ({who, asset, amount, to}: {who: string, asset: string, amount: i128, to: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'withdraw',
            args: this.spec.funcArgsToScVals("withdraw", {who: new Address(who), asset: new Address(asset), amount, to: new Address(to)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['withdraw'],
        });
    }


        /**
    * Construct and simulate a borrow transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    borrow = async ({who, asset, amount}: {who: string, asset: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'borrow',
            args: this.spec.funcArgsToScVals("borrow", {who: new Address(who), asset: new Address(asset), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['borrow'],
        });
    }


        /**
    * Construct and simulate a set_pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setPause = async ({value}: {value: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_pause',
            args: this.spec.funcArgsToScVals("set_pause", {value}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setPause'],
        });
    }


        /**
    * Construct and simulate a paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    paused = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'paused',
            args: this.spec.funcArgsToScVals("paused", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['paused'],
        });
    }


        /**
    * Construct and simulate a treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    treasury = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'treasury',
            args: this.spec.funcArgsToScVals("treasury", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['treasury'],
        });
    }


        /**
    * Construct and simulate a account_position transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    accountPosition = async ({who}: {who: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'account_position',
            args: this.spec.funcArgsToScVals("account_position", {who: new Address(who)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['accountPosition'],
        });
    }


        /**
    * Construct and simulate a liquidate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    liquidate = async ({liquidator, who, receive_stoken}: {liquidator: string, who: string, receive_stoken: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'liquidate',
            args: this.spec.funcArgsToScVals("liquidate", {liquidator: new Address(liquidator), who: new Address(who), receive_stoken}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['liquidate'],
        });
    }


        /**
    * Construct and simulate a set_as_collateral transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setAsCollateral = async ({who, asset, use_as_collateral}: {who: string, asset: string, use_as_collateral: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_as_collateral',
            args: this.spec.funcArgsToScVals("set_as_collateral", {who: new Address(who), asset: new Address(asset), use_as_collateral}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setAsCollateral'],
        });
    }


        /**
    * Construct and simulate a user_configuration transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    userConfiguration = async ({who}: {who: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'user_configuration',
            args: this.spec.funcArgsToScVals("user_configuration", {who: new Address(who)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['userConfiguration'],
        });
    }


        /**
    * Construct and simulate a stoken_underlying_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    stokenUnderlyingBalance = async ({stoken_address}: {stoken_address: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'stoken_underlying_balance',
            args: this.spec.funcArgsToScVals("stoken_underlying_balance", {stoken_address: new Address(stoken_address)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['stokenUnderlyingBalance'],
        });
    }


        /**
    * Construct and simulate a token_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    tokenBalance = async ({token, account}: {token: string, account: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'token_balance',
            args: this.spec.funcArgsToScVals("token_balance", {token: new Address(token), account: new Address(account)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['tokenBalance'],
        });
    }


        /**
    * Construct and simulate a token_total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    tokenTotalSupply = async ({token}: {token: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'token_total_supply',
            args: this.spec.funcArgsToScVals("token_total_supply", {token: new Address(token)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['tokenTotalSupply'],
        });
    }


        /**
    * Construct and simulate a set_flash_loan_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setFlashLoanFee = async ({fee}: {fee: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_flash_loan_fee',
            args: this.spec.funcArgsToScVals("set_flash_loan_fee", {fee}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setFlashLoanFee'],
        });
    }


        /**
    * Construct and simulate a flash_loan_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    flashLoanFee = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'flash_loan_fee',
            args: this.spec.funcArgsToScVals("flash_loan_fee", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['flashLoanFee'],
        });
    }


        /**
    * Construct and simulate a flash_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    flashLoan = async ({who, receiver, loan_assets, params}: {who: string, receiver: string, loan_assets: Array<FlashLoanAsset>, params: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'flash_loan',
            args: this.spec.funcArgsToScVals("flash_loan", {who: new Address(who), receiver: new Address(receiver), loan_assets, params}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['flashLoan'],
        });
    }


        /**
    * Construct and simulate a twap_median_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    twapMedianPrice = async ({asset, amount}: {asset: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'twap_median_price',
            args: this.spec.funcArgsToScVals("twap_median_price", {asset: new Address(asset), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['twapMedianPrice'],
        });
    }


        /**
    * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    balance = async ({id, asset}: {id: string, asset: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'balance',
            args: this.spec.funcArgsToScVals("balance", {id: new Address(id), asset: new Address(asset)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['balance'],
        });
    }

}
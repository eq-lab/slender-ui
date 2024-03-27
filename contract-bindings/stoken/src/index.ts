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
    unknown: {
        networkPassphrase: "Public Global Stellar Network ; September 2015",
        contractId: "CASA3IFJJZ3U3F3INH3J7BQR3WH4TWCCJL7WNAH6YZXYRVK23UFZLR2I",
    }
} as const

/**
    
    */
export interface AllowanceValue {
  /**
    
    */
amount: i128;
  /**
    
    */
expiration_ledger: u32;
}

/**
    
    */
export interface AllowanceDataKey {
  /**
    
    */
from: string;
  /**
    
    */
spender: string;
}

/**
    
    */
export type DataKey = {tag: "Allowance", values: readonly [AllowanceDataKey]} | {tag: "UnderlyingAsset", values: void};

/**
    
    */
export type CommonDataKey = {tag: "Balance", values: readonly [string]} | {tag: "State", values: readonly [string]} | {tag: "Pool", values: void} | {tag: "TotalSupply", values: void};

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
timestamp_precision: TimestampPrecision;
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
    
    */
export type TimestampPrecision = {tag: "Msec", values: void} | {tag: "Sec", values: void};

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

/**
    
    */
export interface TokenMetadata {
  /**
    
    */
decimal: u32;
  /**
    
    */
name: string;
  /**
    
    */
symbol: string;
}


export class Contract {
    spec: ContractSpec;
    constructor(public readonly options: ClassOptions) {
        this.spec = new ContractSpec([
            "AAAAAQAAAAAAAAAAAAAADkFsbG93YW5jZVZhbHVlAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABA==",
        "AAAAAQAAAAAAAAAAAAAAEEFsbG93YW5jZURhdGFLZXkAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAAT",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAACUFsbG93YW5jZQAAAAAAAAEAAAfQAAAAEEFsbG93YW5jZURhdGFLZXkAAAAAAAAAAAAAAA9VbmRlcmx5aW5nQXNzZXQA",
        "AAAAAAAAAaVJbml0aWFsaXplcyB0aGUgU3Rva2VuIGNvbnRyYWN0LgoKIyBBcmd1bWVudHMKCi0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSB0b2tlbi4KLSBzeW1ib2wgLSBUaGUgc3ltYm9sIG9mIHRoZSB0b2tlbi4KLSBwb29sIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHBvb2wgY29udHJhY3QuCi0gdW5kZXJseWluZ19hc3NldCAtIFRoZSBhZGRyZXNzIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGFzc29jaWF0ZWQgd2l0aCB0aGUgdG9rZW4uCgojIFBhbmljcwoKUGFuaWNzIHdpdGggaWYgdGhlIHNwZWNpZmllZCBkZWNpbWFsIHZhbHVlIGV4Y2VlZHMgdGhlIG1heGltdW0gdmFsdWUgb2YgdTguClBhbmljcyB3aXRoIGlmIHRoZSBjb250cmFjdCBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkLgpQYW5pY3MgaWYgbmFtZSBvciBzeW1ib2wgaXMgZW1wdHkKAAAAAAAACmluaXRpYWxpemUAAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABAAAAAAAAAABHBvb2wAAAATAAAAAAAAABB1bmRlcmx5aW5nX2Fzc2V0AAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAHdmVyc2lvbgAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAASNSZXR1cm5zIHRoZSBhbW91bnQgb2YgdG9rZW5zIHRoYXQgdGhlIGBzcGVuZGVyYCBpcyBhbGxvd2VkIHRvIHdpdGhkcmF3IGZyb20gdGhlIGBmcm9tYCBhZGRyZXNzLgoKIyBBcmd1bWVudHMKCi0gZnJvbSAtIFRoZSBhZGRyZXNzIG9mIHRoZSB0b2tlbiBvd25lci4KLSBzcGVuZGVyIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHNwZW5kZXIuCgojIFJldHVybnMKClRoZSBhbW91bnQgb2YgdG9rZW5zIHRoYXQgdGhlIGBzcGVuZGVyYCBpcyBhbGxvd2VkIHRvIHdpdGhkcmF3IGZyb20gdGhlIGBmcm9tYCBhZGRyZXNzLgoAAAAACWFsbG93YW5jZQAAAAAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAdzcGVuZGVyAAAAABMAAAABAAAACw==",
        "AAAAAAAAAdlTZXQgdGhlIGFsbG93YW5jZSBmb3IgYSBzcGVuZGVyIHRvIHdpdGhkcmF3IGZyb20gdGhlIGBmcm9tYCBhZGRyZXNzIGJ5IGEgc3BlY2lmaWVkIGFtb3VudCBvZiB0b2tlbnMuCgojIEFyZ3VtZW50cwoKLSBmcm9tIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHRva2VuIG93bmVyLgotIHNwZW5kZXIgLSBUaGUgYWRkcmVzcyBvZiB0aGUgc3BlbmRlci4KLSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBpbmNyZWFzZSB0aGUgYWxsb3dhbmNlIGJ5LgotIGV4cGlyYXRpb25fbGVkZ2VyIC0gVGhlIHRpbWUgd2hlbiBhbGxvd2FuY2Ugd2lsbCBiZSBleHBpcmVkLgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgY2FsbGVyIGlzIG5vdCBhdXRob3JpemVkLgpQYW5pY3MgaWYgdGhlIGFtb3VudCBpcyBuZWdhdGl2ZS4KUGFuaWNzIGlmIHRoZSB1cGRhdGVkIGFsbG93YW5jZSBleGNlZWRzIHRoZSBtYXhpbXVtIHZhbHVlIG9mIGkxMjguCgAAAAAAAAdhcHByb3ZlAAAAAAQAAAAAAAAABGZyb20AAAATAAAAAAAAAAdzcGVuZGVyAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAARZXhwaXJhdGlvbl9sZWRnZXIAAAAAAAAEAAAAAA==",
        "AAAAAAAAAJ9SZXR1cm5zIHRoZSBiYWxhbmNlIG9mIHRva2VucyBmb3IgYSBzcGVjaWZpZWQgYGlkYC4KCiMgQXJndW1lbnRzCgotIGlkIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGFjY291bnQuCgojIFJldHVybnMKClRoZSBiYWxhbmNlIG9mIHRva2VucyBmb3IgdGhlIHNwZWNpZmllZCBgaWRgLgoAAAAAB2JhbGFuY2UAAAAAAQAAAAAAAAACaWQAAAAAABMAAAABAAAACw==",
        "AAAAAAAAANNSZXR1cm5zIHRoZSBzcGVuZGFibGUgYmFsYW5jZSBvZiB0b2tlbnMgZm9yIGEgc3BlY2lmaWVkIGlkLgoKIyBBcmd1bWVudHMKCi0gaWQgLSBUaGUgYWRkcmVzcyBvZiB0aGUgYWNjb3VudC4KCiMgUmV0dXJucwoKVGhlIHNwZW5kYWJsZSBiYWxhbmNlIG9mIHRva2VucyBmb3IgdGhlIHNwZWNpZmllZCBpZC4KCkN1cnJlbnRseSB0aGUgc2FtZSBhcyBgYmFsYW5jZShpZClgAAAAABFzcGVuZGFibGVfYmFsYW5jZQAAAAAAAAEAAAAAAAAAAmlkAAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAALVDaGVja3Mgd2hldGhlciBhIHNwZWNpZmllZCBgaWRgIGlzIGF1dGhvcml6ZWQuCgojIEFyZ3VtZW50cwoKLSBpZCAtIFRoZSBhZGRyZXNzIHRvIGNoZWNrIGZvciBhdXRob3JpemF0aW9uLgoKIyBSZXR1cm5zCgpSZXR1cm5zIHRydWUgaWYgdGhlIGlkIGlzIGF1dGhvcml6ZWQsIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlAAAAAAAACmF1dGhvcml6ZWQAAAAAAAEAAAAAAAAAAmlkAAAAAAATAAAAAQAAAAE=",
        "AAAAAAAAAUpUcmFuc2ZlcnMgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRva2VucyBmcm9tIG9uZSBhY2NvdW50IChgZnJvbWApIHRvIGFub3RoZXIgYWNjb3VudCAoYHRvYCkuCgojIEFyZ3VtZW50cwoKLSBmcm9tIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHRva2VuIHNlbmRlci4KLSB0byAtIFRoZSBhZGRyZXNzIG9mIHRoZSB0b2tlbiByZWNpcGllbnQuCi0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiB0b2tlbnMgdG8gdHJhbnNmZXIuCgojIFBhbmljcwoKUGFuaWNzIGlmIHRoZSBjYWxsZXIgKGBmcm9tYCkgaXMgbm90IGF1dGhvcml6ZWQuClBhbmljcyBpZiB0aGUgYW1vdW50IGlzIG5lZ2F0aXZlLgoAAAAAAAh0cmFuc2ZlcgAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAdpUcmFuc2ZlcnMgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRva2VucyBmcm9tIHRoZSBmcm9tIGFjY291bnQgdG8gdGhlIHRvIGFjY291bnQgb24gYmVoYWxmIG9mIHRoZSBzcGVuZGVyIGFjY291bnQuCgojIEFyZ3VtZW50cwoKLSBzcGVuZGVyIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGFjY291bnQgdGhhdCBpcyBhdXRob3JpemVkIHRvIHNwZW5kIHRva2Vucy4KLSBmcm9tIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHRva2VuIHNlbmRlci4KLSB0byAtIFRoZSBhZGRyZXNzIG9mIHRoZSB0b2tlbiByZWNpcGllbnQuCi0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiB0b2tlbnMgdG8gdHJhbnNmZXIuCgojIFBhbmljcwoKUGFuaWNzIGlmIHRoZSBzcGVuZGVyIGlzIG5vdCBhdXRob3JpemVkLgpQYW5pY3MgaWYgdGhlIHNwZW5kZXIgaXMgbm90IGFsbG93ZWQgdG8gc3BlbmQgYGFtb3VudGAuClBhbmljcyBpZiB0aGUgYW1vdW50IGlzIG5lZ2F0aXZlLgoAAAAAAA10cmFuc2Zlcl9mcm9tAAAAAAAABAAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAIX3NwZW5kZXIAAAATAAAAAAAAAAVfZnJvbQAAAAAAABMAAAAAAAAAB19hbW91bnQAAAAACwAAAAA=",
        "AAAAAAAAAURDbGF3YmFja3MgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRva2VucyBmcm9tIHRoZSBmcm9tIGFjY291bnQuCgojIEFyZ3VtZW50cwoKLSBmcm9tIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHRva2VuIGhvbGRlciB0byBjbGF3YmFjayB0b2tlbnMgZnJvbS4KLSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBjbGF3YmFjay4KCiMgUGFuaWNzCgpQYW5pY3MgaWYgdGhlIGFtb3VudCBpcyBuZWdhdGl2ZS4KUGFuaWNzIGlmIHRoZSBjYWxsZXIgaXMgbm90IHRoZSBwb29sIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHRva2VuLgpQYW5pY3MgaWYgb3ZlcmZsb3cgaGFwcGVucwoAAAAIY2xhd2JhY2sAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAASpTZXRzIHRoZSBhdXRob3JpemF0aW9uIHN0YXR1cyBmb3IgYSBzcGVjaWZpZWQgYGlkYC4KCiMgQXJndW1lbnRzCgotIGlkIC0gVGhlIGFkZHJlc3MgdG8gc2V0IHRoZSBhdXRob3JpemF0aW9uIHN0YXR1cyBmb3IuCi0gYXV0aG9yaXplIC0gQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0byBhdXRob3JpemUgKHRydWUpIG9yIGRlYXV0aG9yaXplIChmYWxzZSkgdGhlIGlkLgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgY2FsbGVyIGlzIG5vdCB0aGUgcG9vbCBhc3NvY2lhdGVkIHdpdGggdGhpcyB0b2tlbi4KAAAAAAAOc2V0X2F1dGhvcml6ZWQAAAAAAAIAAAAAAAAAAmlkAAAAAAATAAAAAAAAAAlhdXRob3JpemUAAAAAAAABAAAAAA==",
        "AAAAAAAAASVNaW50cyBhIHNwZWNpZmllZCBhbW91bnQgb2YgdG9rZW5zIGZvciBhIGdpdmVuIGBpZGAgYW5kIHJldHVybnMgdG90YWwgc3VwcGx5CgojIEFyZ3VtZW50cwoKLSBpZCAtIFRoZSBhZGRyZXNzIG9mIHRoZSB1c2VyIHRvIG1pbnQgdG9rZW5zIGZvci4KLSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBtaW50LgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgYW1vdW50IGlzIG5lZ2F0aXZlLgpQYW5pY3MgaWYgdGhlIGNhbGxlciBpcyBub3QgdGhlIHBvb2wgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdG9rZW4uCgAAAAAAAARtaW50AAAAAgAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAblCdXJucyBhIHNwZWNpZmllZCBhbW91bnQgb2YgdG9rZW5zIGZyb20gdGhlIGZyb20gYWNjb3VudCBhbmQgcmV0dXJucyB0b3RhbCBzdXBwbHkKCiMgQXJndW1lbnRzCgotIGZyb20gLSBUaGUgYWRkcmVzcyBvZiB0aGUgdG9rZW4gaG9sZGVyIHRvIGJ1cm4gdG9rZW5zIGZyb20uCi0gYW1vdW50X3RvX2J1cm4gLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBidXJuLgotIGFtb3VudF90b193aXRoZHJhdyAtIFRoZSBhbW91bnQgb2YgdW5kZXJseWluZyB0b2tlbiB0byB3aXRoZHJhdy4KLSB0byAtIFRoZSBhZGRyZXNzIHdobyBhY2NlcHRzIHVuZGVybHlpbmcgdG9rZW4uCgojIFBhbmljcwoKUGFuaWNzIGlmIHRoZSBhbW91bnRfdG9fYnVybiBpcyBuZWdhdGl2ZS4KUGFuaWNzIGlmIHRoZSBjYWxsZXIgaXMgbm90IHRoZSBwb29sIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHRva2VuLgoAAAAAAAAEYnVybgAAAAQAAAAAAAAABGZyb20AAAATAAAAAAAAAA5hbW91bnRfdG9fYnVybgAAAAAACwAAAAAAAAASYW1vdW50X3RvX3dpdGhkcmF3AAAAAAALAAAAAAAAAAJ0bwAAAAAAEwAAAAA=",
        "AAAAAAAAAHRSZXR1cm5zIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgdXNlZCBieSB0aGUgdG9rZW4uCgojIFJldHVybnMKClRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgdXNlZCBieSB0aGUgdG9rZW4uCgAAAAhkZWNpbWFscwAAAAAAAAABAAAABA==",
        "AAAAAAAAAGJSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSB0b2tlbi4KCiMgUmV0dXJucwoKVGhlIG5hbWUgb2YgdGhlIHRva2VuIGFzIGEgYHNvcm9iYW5fc2RrOjpCeXRlc2AgdmFsdWUuCgAAAAAABG5hbWUAAAAAAAAAAQAAABA=",
        "AAAAAAAAAGZSZXR1cm5zIHRoZSBzeW1ib2wgb2YgdGhlIHRva2VuLgoKIyBSZXR1cm5zCgpUaGUgc3ltYm9sIG9mIHRoZSB0b2tlbiBhcyBhIGBzb3JvYmFuX3Nkazo6Qnl0ZXNgIHZhbHVlLgoAAAAAAAZzeW1ib2wAAAAAAAAAAAABAAAAEA==",
        "AAAAAAAAAExSZXR1cm5zIHRoZSB0b3RhbCBzdXBwbHkgb2YgdG9rZW5zLgoKIyBSZXR1cm5zCgpUaGUgdG90YWwgc3VwcGx5IG9mIHRva2Vucy4KAAAADHRvdGFsX3N1cHBseQAAAAAAAAABAAAACw==",
        "AAAAAAAAAN9UcmFuc2ZlcnMgdG9rZW5zIGR1cmluZyBhIGxpcXVpZGF0aW9uLgoKIyBBcmd1bWVudHMKCi0gZnJvbSAtIFRoZSBhZGRyZXNzIG9mIHRoZSBzZW5kZXIuCi0gdG8gLSBUaGUgYWRkcmVzcyBvZiB0aGUgcmVjaXBpZW50LgotIGFtb3VudCAtIFRoZSBhbW91bnQgb2YgdG9rZW5zIHRvIHRyYW5zZmVyLgoKIyBQYW5pY3MKClBhbmljcyBpZiBjYWxsZXIgaXMgbm90IGFzc29jaWF0ZWQgcG9vbC4KAAAAABd0cmFuc2Zlcl9vbl9saXF1aWRhdGlvbgAAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAPtUcmFuc2ZlcnMgdGhlIHVuZGVybHlpbmcgYXNzZXQgdG8gdGhlIHNwZWNpZmllZCByZWNpcGllbnQuCgojIEFyZ3VtZW50cwoKLSB0byAtIFRoZSBhZGRyZXNzIG9mIHRoZSByZWNpcGllbnQuCi0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiB1bmRlcmx5aW5nIGFzc2V0IHRvIHRyYW5zZmVyLgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgYW1vdW50IGlzIG5lZ2F0aXZlLgpQYW5pY3MgaWYgY2FsbGVyIGlzIG5vdCBhc3NvY2lhdGVkIHBvb2wuCgAAAAAWdHJhbnNmZXJfdW5kZXJseWluZ190bwAAAAAAAgAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAGBSZXRyaWV2ZXMgdGhlIGFkZHJlc3Mgb2YgdGhlIHVuZGVybHlpbmcgYXNzZXQuCgojIFJldHVybnMKClRoZSBhZGRyZXNzIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0LgoAAAAQdW5kZXJseWluZ19hc3NldAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAFNSZXRyaWV2ZXMgdGhlIGFkZHJlc3Mgb2YgdGhlIHBvb2wuCgojIFJldHVybnMKClRoZSBhZGRyZXNzIG9mIHRoZSBhc3NvY2lhdGVkIHBvb2wuCgAAAAAEcG9vbAAAAAAAAAABAAAAEw==",
        "AAAAAgAAAAAAAAAAAAAADUNvbW1vbkRhdGFLZXkAAAAAAAAEAAAAAQAAAAAAAAAHQmFsYW5jZQAAAAABAAAAEwAAAAEAAAAAAAAABVN0YXRlAAAAAAAAAQAAABMAAAAAAAAAAAAAAARQb29sAAAAAAAAAAAAAAALVG90YWxTdXBwbHkA",
        "AAAAAQAAAAAAAAAAAAAAD0FjY291bnRQb3NpdGlvbgAAAAADAAAAAAAAAARkZWJ0AAAACwAAAAAAAAAVZGlzY291bnRlZF9jb2xsYXRlcmFsAAAAAAAACwAAAAAAAAADbnB2AAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAADEFzc2V0QmFsYW5jZQAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAHYmFsYW5jZQAAAAAL",
        "AAAAAQAAAAAAAAAAAAAAD0Jhc2VBc3NldENvbmZpZwAAAAACAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAACGRlY2ltYWxzAAAABA==",
        "AAAAAQAAABxDb2xsYXRlcmFsaXphdGlvbiBwYXJhbWV0ZXJzAAAAAAAAABVDb2xsYXRlcmFsUGFyYW1zSW5wdXQAAAAAAAAEAAAAaFNwZWNpZmllcyB3aGF0IGZyYWN0aW9uIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGNvdW50cyB0b3dhcmQKdGhlIHBvcnRmb2xpbyBjb2xsYXRlcmFsIHZhbHVlIFswJSwgMTAwJV0uAAAACGRpc2NvdW50AAAABAAAAEJUaGUgdG90YWwgYW1vdW50IG9mIGFuIGFzc2V0IHRoZSBwcm90b2NvbCBhY2NlcHRzIGludG8gdGhlIG1hcmtldC4AAAAAAAdsaXFfY2FwAAAAAAsAAAARTGlxdWlkYXRpb24gb3JkZXIAAAAAAAAJcGVuX29yZGVyAAAAAAAABAAAAAAAAAAIdXRpbF9jYXAAAAAE",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAKAAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAAAAAAAAAAAAA1VbmluaXRpYWxpemVkAAAAAAAAAQAAAAAAAAALTm9QcmljZUZlZWQAAAAAAgAAAAAAAAAGUGF1c2VkAAAAAAADAAAAAAAAABZOb1Jlc2VydmVFeGlzdEZvckFzc2V0AAAAAABkAAAAAAAAAA9Ob0FjdGl2ZVJlc2VydmUAAAAAZQAAAAAAAAANUmVzZXJ2ZUZyb3plbgAAAAAAAGYAAAAAAAAAG1Jlc2VydmVzTWF4Q2FwYWNpdHlFeGNlZWRlZAAAAABnAAAAAAAAAA9Ob1ByaWNlRm9yQXNzZXQAAAAAaAAAAAAAAAAZUmVzZXJ2ZUFscmVhZHlJbml0aWFsaXplZAAAAAAAAGkAAAAAAAAAEUludmFsaWRBc3NldFByaWNlAAAAAAAAagAAAAAAAAAXQmFzZUFzc2V0Tm90SW5pdGlhbGl6ZWQAAAAAawAAAAAAAAAbSW5pdGlhbEhlYWx0aE5vdEluaXRpYWxpemVkAAAAAGwAAAAAAAAAHExpcXVpZGF0aW9uT3JkZXJNdXN0QmVVbmlxdWUAAABtAAAAAAAAAAtOb3RGdW5naWJsZQAAAABuAAAAAAAAABZVc2VyQ29uZmlnSW52YWxpZEluZGV4AAAAAADIAAAAAAAAAB1Ob3RFbm91Z2hBdmFpbGFibGVVc2VyQmFsYW5jZQAAAAAAAMkAAAAAAAAAE1VzZXJDb25maWdOb3RFeGlzdHMAAAAAygAAAAAAAAAMTXVzdEhhdmVEZWJ0AAAAywAAAAAAAAAPTXVzdE5vdEhhdmVEZWJ0AAAAAMwAAAAAAAAAE0JvcnJvd2luZ05vdEVuYWJsZWQAAAABLAAAAAAAAAASQmVsb3dJbml0aWFsSGVhbHRoAAAAAAEtAAAAAAAAAAtCYWRQb3NpdGlvbgAAAAEuAAAAAAAAAAxHb29kUG9zaXRpb24AAAEvAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAABMAAAAAAAAAAXVmFsaWRhdGVCb3Jyb3dNYXRoRXJyb3IAAAABMQAAAAAAAAAYQ2FsY0FjY291bnREYXRhTWF0aEVycm9yAAABMgAAAAAAAAASTGlxdWlkYXRlTWF0aEVycm9yAAAAAAE1AAAAAAAAABpNdXN0Tm90QmVJbkNvbGxhdGVyYWxBc3NldAAAAAABNgAAAAAAAAAWVXRpbGl6YXRpb25DYXBFeGNlZWRlZAAAAAABNwAAAAAAAAAOTGlxQ2FwRXhjZWVkZWQAAAAAATgAAAAAAAAAFkZsYXNoTG9hblJlY2VpdmVyRXJyb3IAAAAAATkAAAAAAAAAEU1hdGhPdmVyZmxvd0Vycm9yAAAAAAABkAAAAAAAAAAZTXVzdEJlTHRlUGVyY2VudGFnZUZhY3RvcgAAAAAAAZEAAAAAAAAAGE11c3RCZUx0UGVyY2VudGFnZUZhY3RvcgAAAZIAAAAAAAAAGE11c3RCZUd0UGVyY2VudGFnZUZhY3RvcgAAAZMAAAAAAAAADk11c3RCZVBvc2l0aXZlAAAAAAGUAAAAAAAAABRBY2NydWVkUmF0ZU1hdGhFcnJvcgAAAfQAAAAAAAAAGENvbGxhdGVyYWxDb2VmZk1hdGhFcnJvcgAAAfUAAAAAAAAAEkRlYnRDb2VmZk1hdGhFcnJvcgAAAAAB9g==",
        "AAAAAQAAAAAAAAAAAAAADkZsYXNoTG9hbkFzc2V0AAAAAAADAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAGYm9ycm93AAAAAAAB",
        "AAAAAQAAABhJbnRlcmVzdCByYXRlIHBhcmFtZXRlcnMAAAAAAAAACElSUGFyYW1zAAAABAAAAAAAAAAFYWxwaGEAAAAAAAAEAAAAAAAAAAxpbml0aWFsX3JhdGUAAAAEAAAAAAAAAAhtYXhfcmF0ZQAAAAQAAAAAAAAADXNjYWxpbmdfY29lZmYAAAAAAAAE",
        "AAAAAgAAAAAAAAAAAAAAC09yYWNsZUFzc2V0AAAAAAIAAAABAAAAAAAAAAdTdGVsbGFyAAAAAAEAAAATAAAAAQAAAAAAAAAFT3RoZXIAAAAAAAABAAAAEQ==",
        "AAAAAQAAAAAAAAAAAAAACVByaWNlRmVlZAAAAAAAAAUAAAAAAAAABGZlZWQAAAATAAAAAAAAAApmZWVkX2Fzc2V0AAAAAAfQAAAAC09yYWNsZUFzc2V0AAAAAAAAAAANZmVlZF9kZWNpbWFscwAAAAAAAAQAAAAAAAAAE3RpbWVzdGFtcF9wcmVjaXNpb24AAAAH0AAAABJUaW1lc3RhbXBQcmVjaXNpb24AAAAAAAAAAAAMdHdhcF9yZWNvcmRzAAAABA==",
        "AAAAAQAAAAAAAAAAAAAAD1ByaWNlRmVlZENvbmZpZwAAAAACAAAAAAAAAA5hc3NldF9kZWNpbWFscwAAAAAABAAAAAAAAAAFZmVlZHMAAAAAAAPqAAAH0AAAAAlQcmljZUZlZWQAAAA=",
        "AAAAAQAAAAAAAAAAAAAAFFByaWNlRmVlZENvbmZpZ0lucHV0AAAAAwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAA5hc3NldF9kZWNpbWFscwAAAAAABAAAAAAAAAAFZmVlZHMAAAAAAAPqAAAH0AAAAAlQcmljZUZlZWQAAAA=",
        "AAAAAQAAAAAAAAAAAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAABgAAAAAAAAARYm9ycm93aW5nX2VuYWJsZWQAAAAAAAABAAAAaFNwZWNpZmllcyB3aGF0IGZyYWN0aW9uIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGNvdW50cyB0b3dhcmQKdGhlIHBvcnRmb2xpbyBjb2xsYXRlcmFsIHZhbHVlIFswJSwgMTAwJV0uAAAACGRpc2NvdW50AAAABAAAAAAAAAAJaXNfYWN0aXZlAAAAAAAAAQAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAsAAAAAAAAACXBlbl9vcmRlcgAAAAAAAAQAAAAAAAAACHV0aWxfY2FwAAAABA==",
        "AAAAAQAAAAAAAAAAAAAAC1Jlc2VydmVEYXRhAAAAAAgAAAAAAAAAC2JvcnJvd2VyX2FyAAAAAAsAAAAAAAAAC2JvcnJvd2VyX2lyAAAAAAsAAAAAAAAADWNvbmZpZ3VyYXRpb24AAAAAAAfQAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAARFRoZSBpZCBvZiB0aGUgcmVzZXJ2ZSAocG9zaXRpb24gaW4gdGhlIGxpc3Qgb2YgdGhlIGFjdGl2ZSByZXNlcnZlcykuAAAAAmlkAAAAAAPuAAAAAQAAAAAAAAAVbGFzdF91cGRhdGVfdGltZXN0YW1wAAAAAAAABgAAAAAAAAAJbGVuZGVyX2FyAAAAAAAACwAAAAAAAAAJbGVuZGVyX2lyAAAAAAAACwAAAAAAAAAMcmVzZXJ2ZV90eXBlAAAH0AAAAAtSZXNlcnZlVHlwZQA=",
        "AAAAAgAAAAAAAAAAAAAAC1Jlc2VydmVUeXBlAAAAAAIAAAABAAAAN0Z1bmdpYmxlIHJlc2VydmUgZm9yIHdoaWNoIGNyZWF0ZWQgc1Rva2VuIGFuZCBkZWJ0VG9rZW4AAAAACEZ1bmdpYmxlAAAAAgAAABMAAAATAAAAAAAAAAtSV0EgcmVzZXJ2ZQAAAAADUldBAA==",
        "AAAAAgAAAAAAAAAAAAAAElRpbWVzdGFtcFByZWNpc2lvbgAAAAAAAgAAAAAAAAAAAAAABE1zZWMAAAAAAAAAAAAAAANTZWMA",
        "AAAAAQAAAH9JbXBsZW1lbnRzIHRoZSBiaXRtYXAgbG9naWMgdG8gaGFuZGxlIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24uCkV2ZW4gcG9zaXRpb25zIGlzIGNvbGxhdGVyYWwgZmxhZ3MgYW5kIHVuZXZlbiBpcyBib3Jyb3dpbmcgZmxhZ3MuAAAAAAAAAAARVXNlckNvbmZpZ3VyYXRpb24AAAAAAAABAAAAAAAAAAEwAAAAAAAACg==",
        "AAAAAgAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAAAEAAAAAAAAAB1N0ZWxsYXIAAAAAAQAAABMAAAABAAAAAAAAAAVPdGhlcgAAAAAAAAEAAAAR",
        "AAAAAQAAAAAAAAAAAAAACVByaWNlRGF0YQAAAAAAAAIAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==",
        "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA="
        ]);
    }
    private readonly parsers = {
        initialize: () => {},
        upgrade: () => {},
        version: (result: XDR_BASE64): u32 => this.spec.funcResToNative("version", result),
        allowance: (result: XDR_BASE64): i128 => this.spec.funcResToNative("allowance", result),
        approve: () => {},
        balance: (result: XDR_BASE64): i128 => this.spec.funcResToNative("balance", result),
        spendableBalance: (result: XDR_BASE64): i128 => this.spec.funcResToNative("spendable_balance", result),
        authorized: (result: XDR_BASE64): boolean => this.spec.funcResToNative("authorized", result),
        transfer: () => {},
        transferFrom: () => {},
        burnFrom: () => {},
        clawback: () => {},
        setAuthorized: () => {},
        mint: () => {},
        burn: () => {},
        decimals: (result: XDR_BASE64): u32 => this.spec.funcResToNative("decimals", result),
        name: (result: XDR_BASE64): string => this.spec.funcResToNative("name", result),
        symbol: (result: XDR_BASE64): string => this.spec.funcResToNative("symbol", result),
        totalSupply: (result: XDR_BASE64): i128 => this.spec.funcResToNative("total_supply", result),
        transferOnLiquidation: () => {},
        transferUnderlyingTo: () => {},
        underlyingAsset: (result: XDR_BASE64): string => this.spec.funcResToNative("underlying_asset", result),
        pool: (result: XDR_BASE64): string => this.spec.funcResToNative("pool", result)
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
        version: this.txFromJSON<ReturnType<typeof this.parsers['version']>>,
        allowance: this.txFromJSON<ReturnType<typeof this.parsers['allowance']>>,
        approve: this.txFromJSON<ReturnType<typeof this.parsers['approve']>>,
        balance: this.txFromJSON<ReturnType<typeof this.parsers['balance']>>,
        spendableBalance: this.txFromJSON<ReturnType<typeof this.parsers['spendableBalance']>>,
        authorized: this.txFromJSON<ReturnType<typeof this.parsers['authorized']>>,
        transfer: this.txFromJSON<ReturnType<typeof this.parsers['transfer']>>,
        transferFrom: this.txFromJSON<ReturnType<typeof this.parsers['transferFrom']>>,
        burnFrom: this.txFromJSON<ReturnType<typeof this.parsers['burnFrom']>>,
        clawback: this.txFromJSON<ReturnType<typeof this.parsers['clawback']>>,
        setAuthorized: this.txFromJSON<ReturnType<typeof this.parsers['setAuthorized']>>,
        mint: this.txFromJSON<ReturnType<typeof this.parsers['mint']>>,
        burn: this.txFromJSON<ReturnType<typeof this.parsers['burn']>>,
        decimals: this.txFromJSON<ReturnType<typeof this.parsers['decimals']>>,
        name: this.txFromJSON<ReturnType<typeof this.parsers['name']>>,
        symbol: this.txFromJSON<ReturnType<typeof this.parsers['symbol']>>,
        totalSupply: this.txFromJSON<ReturnType<typeof this.parsers['totalSupply']>>,
        transferOnLiquidation: this.txFromJSON<ReturnType<typeof this.parsers['transferOnLiquidation']>>,
        transferUnderlyingTo: this.txFromJSON<ReturnType<typeof this.parsers['transferUnderlyingTo']>>,
        underlyingAsset: this.txFromJSON<ReturnType<typeof this.parsers['underlyingAsset']>>,
        pool: this.txFromJSON<ReturnType<typeof this.parsers['pool']>>
    }
        /**
    * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Initializes the Stoken contract.
    * 
    * # Arguments
    * 
    * - name - The name of the token.
    * - symbol - The symbol of the token.
    * - pool - The address of the pool contract.
    * - underlying_asset - The address of the underlying asset associated with the token.
    * 
    * # Panics
    * 
    * Panics with if the specified decimal value exceeds the maximum value of u8.
    * Panics with if the contract has already been initialized.
    * Panics if name or symbol is empty
    * 
    */
    initialize = async ({name, symbol, pool, underlying_asset}: {name: string, symbol: string, pool: string, underlying_asset: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", {name, symbol, pool: new Address(pool), underlying_asset: new Address(underlying_asset)}),
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
    * Construct and simulate a allowance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Returns the amount of tokens that the `spender` is allowed to withdraw from the `from` address.
    * 
    * # Arguments
    * 
    * - from - The address of the token owner.
    * - spender - The address of the spender.
    * 
    * # Returns
    * 
    * The amount of tokens that the `spender` is allowed to withdraw from the `from` address.
    * 
    */
    allowance = async ({from, spender}: {from: string, spender: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'allowance',
            args: this.spec.funcArgsToScVals("allowance", {from: new Address(from), spender: new Address(spender)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['allowance'],
        });
    }


        /**
    * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Set the allowance for a spender to withdraw from the `from` address by a specified amount of tokens.
    * 
    * # Arguments
    * 
    * - from - The address of the token owner.
    * - spender - The address of the spender.
    * - amount - The amount of tokens to increase the allowance by.
    * - expiration_ledger - The time when allowance will be expired.
    * 
    * # Panics
    * 
    * Panics if the caller is not authorized.
    * Panics if the amount is negative.
    * Panics if the updated allowance exceeds the maximum value of i128.
    * 
    */
    approve = async ({from, spender, amount, expiration_ledger}: {from: string, spender: string, amount: i128, expiration_ledger: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'approve',
            args: this.spec.funcArgsToScVals("approve", {from: new Address(from), spender: new Address(spender), amount, expiration_ledger}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['approve'],
        });
    }


        /**
    * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Returns the balance of tokens for a specified `id`.
    * 
    * # Arguments
    * 
    * - id - The address of the account.
    * 
    * # Returns
    * 
    * The balance of tokens for the specified `id`.
    * 
    */
    balance = async ({id}: {id: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'balance',
            args: this.spec.funcArgsToScVals("balance", {id: new Address(id)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['balance'],
        });
    }


        /**
    * Construct and simulate a spendable_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Returns the spendable balance of tokens for a specified id.
    * 
    * # Arguments
    * 
    * - id - The address of the account.
    * 
    * # Returns
    * 
    * The spendable balance of tokens for the specified id.
    * 
    * Currently the same as `balance(id)`
    */
    spendableBalance = async ({id}: {id: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'spendable_balance',
            args: this.spec.funcArgsToScVals("spendable_balance", {id: new Address(id)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['spendableBalance'],
        });
    }


        /**
    * Construct and simulate a authorized transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Checks whether a specified `id` is authorized.
    * 
    * # Arguments
    * 
    * - id - The address to check for authorization.
    * 
    * # Returns
    * 
    * Returns true if the id is authorized, otherwise returns false
    */
    authorized = async ({id}: {id: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'authorized',
            args: this.spec.funcArgsToScVals("authorized", {id: new Address(id)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['authorized'],
        });
    }


        /**
    * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Transfers a specified amount of tokens from one account (`from`) to another account (`to`).
    * 
    * # Arguments
    * 
    * - from - The address of the token sender.
    * - to - The address of the token recipient.
    * - amount - The amount of tokens to transfer.
    * 
    * # Panics
    * 
    * Panics if the caller (`from`) is not authorized.
    * Panics if the amount is negative.
    * 
    */
    transfer = async ({from, to, amount}: {from: string, to: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'transfer',
            args: this.spec.funcArgsToScVals("transfer", {from: new Address(from), to: new Address(to), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['transfer'],
        });
    }


        /**
    * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Transfers a specified amount of tokens from the from account to the to account on behalf of the spender account.
    * 
    * # Arguments
    * 
    * - spender - The address of the account that is authorized to spend tokens.
    * - from - The address of the token sender.
    * - to - The address of the token recipient.
    * - amount - The amount of tokens to transfer.
    * 
    * # Panics
    * 
    * Panics if the spender is not authorized.
    * Panics if the spender is not allowed to spend `amount`.
    * Panics if the amount is negative.
    * 
    */
    transferFrom = async ({spender, from, to, amount}: {spender: string, from: string, to: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'transfer_from',
            args: this.spec.funcArgsToScVals("transfer_from", {spender: new Address(spender), from: new Address(from), to: new Address(to), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['transferFrom'],
        });
    }


        /**
    * Construct and simulate a burn_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    burnFrom = async ({_spender, _from, _amount}: {_spender: string, _from: string, _amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'burn_from',
            args: this.spec.funcArgsToScVals("burn_from", {_spender: new Address(_spender), _from: new Address(_from), _amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['burnFrom'],
        });
    }


        /**
    * Construct and simulate a clawback transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Clawbacks a specified amount of tokens from the from account.
    * 
    * # Arguments
    * 
    * - from - The address of the token holder to clawback tokens from.
    * - amount - The amount of tokens to clawback.
    * 
    * # Panics
    * 
    * Panics if the amount is negative.
    * Panics if the caller is not the pool associated with this token.
    * Panics if overflow happens
    * 
    */
    clawback = async ({from, amount}: {from: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'clawback',
            args: this.spec.funcArgsToScVals("clawback", {from: new Address(from), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['clawback'],
        });
    }


        /**
    * Construct and simulate a set_authorized transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Sets the authorization status for a specified `id`.
    * 
    * # Arguments
    * 
    * - id - The address to set the authorization status for.
    * - authorize - A boolean value indicating whether to authorize (true) or deauthorize (false) the id.
    * 
    * # Panics
    * 
    * Panics if the caller is not the pool associated with this token.
    * 
    */
    setAuthorized = async ({id, authorize}: {id: string, authorize: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_authorized',
            args: this.spec.funcArgsToScVals("set_authorized", {id: new Address(id), authorize}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setAuthorized'],
        });
    }


        /**
    * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Mints a specified amount of tokens for a given `id` and returns total supply
    * 
    * # Arguments
    * 
    * - id - The address of the user to mint tokens for.
    * - amount - The amount of tokens to mint.
    * 
    * # Panics
    * 
    * Panics if the amount is negative.
    * Panics if the caller is not the pool associated with this token.
    * 
    */
    mint = async ({to, amount}: {to: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'mint',
            args: this.spec.funcArgsToScVals("mint", {to: new Address(to), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['mint'],
        });
    }


        /**
    * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Burns a specified amount of tokens from the from account and returns total supply
    * 
    * # Arguments
    * 
    * - from - The address of the token holder to burn tokens from.
    * - amount_to_burn - The amount of tokens to burn.
    * - amount_to_withdraw - The amount of underlying token to withdraw.
    * - to - The address who accepts underlying token.
    * 
    * # Panics
    * 
    * Panics if the amount_to_burn is negative.
    * Panics if the caller is not the pool associated with this token.
    * 
    */
    burn = async ({from, amount_to_burn, amount_to_withdraw, to}: {from: string, amount_to_burn: i128, amount_to_withdraw: i128, to: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'burn',
            args: this.spec.funcArgsToScVals("burn", {from: new Address(from), amount_to_burn, amount_to_withdraw, to: new Address(to)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['burn'],
        });
    }


        /**
    * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Returns the number of decimal places used by the token.
    * 
    * # Returns
    * 
    * The number of decimal places used by the token.
    * 
    */
    decimals = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'decimals',
            args: this.spec.funcArgsToScVals("decimals", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['decimals'],
        });
    }


        /**
    * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Returns the name of the token.
    * 
    * # Returns
    * 
    * The name of the token as a `soroban_sdk::Bytes` value.
    * 
    */
    name = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'name',
            args: this.spec.funcArgsToScVals("name", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['name'],
        });
    }


        /**
    * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Returns the symbol of the token.
    * 
    * # Returns
    * 
    * The symbol of the token as a `soroban_sdk::Bytes` value.
    * 
    */
    symbol = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'symbol',
            args: this.spec.funcArgsToScVals("symbol", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['symbol'],
        });
    }


        /**
    * Construct and simulate a total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Returns the total supply of tokens.
    * 
    * # Returns
    * 
    * The total supply of tokens.
    * 
    */
    totalSupply = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'total_supply',
            args: this.spec.funcArgsToScVals("total_supply", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['totalSupply'],
        });
    }


        /**
    * Construct and simulate a transfer_on_liquidation transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Transfers tokens during a liquidation.
    * 
    * # Arguments
    * 
    * - from - The address of the sender.
    * - to - The address of the recipient.
    * - amount - The amount of tokens to transfer.
    * 
    * # Panics
    * 
    * Panics if caller is not associated pool.
    * 
    */
    transferOnLiquidation = async ({from, to, amount}: {from: string, to: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'transfer_on_liquidation',
            args: this.spec.funcArgsToScVals("transfer_on_liquidation", {from: new Address(from), to: new Address(to), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['transferOnLiquidation'],
        });
    }


        /**
    * Construct and simulate a transfer_underlying_to transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Transfers the underlying asset to the specified recipient.
    * 
    * # Arguments
    * 
    * - to - The address of the recipient.
    * - amount - The amount of underlying asset to transfer.
    * 
    * # Panics
    * 
    * Panics if the amount is negative.
    * Panics if caller is not associated pool.
    * 
    */
    transferUnderlyingTo = async ({to, amount}: {to: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'transfer_underlying_to',
            args: this.spec.funcArgsToScVals("transfer_underlying_to", {to: new Address(to), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['transferUnderlyingTo'],
        });
    }


        /**
    * Construct and simulate a underlying_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Retrieves the address of the underlying asset.
    * 
    * # Returns
    * 
    * The address of the underlying asset.
    * 
    */
    underlyingAsset = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'underlying_asset',
            args: this.spec.funcArgsToScVals("underlying_asset", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['underlyingAsset'],
        });
    }


        /**
    * Construct and simulate a pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Retrieves the address of the pool.
    * 
    * # Returns
    * 
    * The address of the associated pool.
    * 
    */
    pool = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'pool',
            args: this.spec.funcArgsToScVals("pool", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['pool'],
        });
    }

}
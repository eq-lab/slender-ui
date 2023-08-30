import { Buffer } from "buffer";
export * from './constants.js';
export * from './server.js';
export * from './invoke.js';
export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Address = string;
export type Option<T> = T | undefined;
export type Typepoint = bigint;
export type Duration = bigint;
export interface Error_ {
    message: string;
}
export interface Result<T, E = Error_> {
    unwrap(): T;
    unwrapErr(): E;
    isOk(): boolean;
    isErr(): boolean;
}
export declare class Ok<T> implements Result<T> {
    readonly value: T;
    constructor(value: T);
    unwrapErr(): Error_;
    unwrap(): T;
    isOk(): boolean;
    isErr(): boolean;
}
export declare class Err<T> implements Result<T> {
    readonly error: Error_;
    constructor(error: Error_);
    unwrapErr(): Error_;
    unwrap(): never;
    isOk(): boolean;
    isErr(): boolean;
}
/**
 * Initializes the Debt token contract.
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
 * Panics if the specified decimal value exceeds the maximum value of u8.
 * Panics if the contract has already been initialized.
 * Panics if name or symbol is empty
 *
 */
export declare function initialize({ name, symbol, pool, underlying_asset }: {
    name: string;
    symbol: string;
    pool: Address;
    underlying_asset: Address;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
/**
 * Upgrades the deployed contract wasm preserving the contract id.
 *
 * # Arguments
 *
 * - new_wasm_hash - The new version of the WASM hash.
 *
 * # Panics
 *
 * Panics if the caller is not the pool associated with this token.
 *
 */
export declare function upgrade({ new_wasm_hash }: {
    new_wasm_hash: Buffer;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
/**
 * Returns the current version of the contract.
 */
export declare function version({ signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<u32>;
/**
 * Returns the balance of tokens for a specified `id`.
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
export declare function balance({ id }: {
    id: Address;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<i128>;
/**
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
export declare function spendable_balance({ id }: {
    id: Address;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<i128>;
/**
 * Checks whether a specified `id` is authorized.
 *
 * # Arguments
 *
 * - id - The address to check for authorization.
 *
 * # Returns
 *
 * Returns true if the id is authorized, otherwise returns false
 */
export declare function authorized({ id }: {
    id: Address;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<boolean>;
/**
 * Burns a specified amount of tokens from the from account.
 *
 * # Arguments
 *
 * - from - The address of the token holder to burn tokens from.
 * - amount - The amount of tokens to burn.
 *
 * # Panics
 *
 * Panics if the amount is negative.
 * Panics if the caller is not the pool associated with this token.
 * Panics if overflow happens
 *
 */
export declare function burn({ from, amount }: {
    from: Address;
    amount: i128;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
export declare function burn_from({ _spender, _from, _amount }: {
    _spender: Address;
    _from: Address;
    _amount: i128;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
/**
 * Sets the authorization status for a specified `id`.
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
export declare function set_authorized({ id, authorize }: {
    id: Address;
    authorize: boolean;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
/**
 * Mints a specified amount of tokens for a given `id`.
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
export declare function mint({ to, amount }: {
    to: Address;
    amount: i128;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
/**
 * Clawbacks a specified amount of tokens from the from account.
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
export declare function clawback({ from, amount }: {
    from: Address;
    amount: i128;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
/**
 * Returns the number of decimal places used by the token.
 *
 * # Returns
 *
 * The number o
 */
export declare function decimals({ signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<u32>;
/**
 * Returns the name of the token.
 *
 * # Returns
 *
 * The name of the token as a `soroban_sdk::Bytes` value.
 *
 */
export declare function name({ signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<string>;
/**
 * Returns the symbol of the token.
 *
 * # Returns
 *
 * The symbol of the token as a `soroban_sdk::Bytes` value.
 *
 */
export declare function symbol({ signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<string>;
/**
 * Returns the total supply of tokens.
 *
 * # Returns
 *
 * The total supply of tokens.
 *
 */
export declare function total_supply({ signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<i128>;
export type CommonDataKey = {
    tag: "Balance";
    values: [Address];
} | {
    tag: "State";
    values: [Address];
} | {
    tag: "Pool";
    values: void;
} | {
    tag: "TotalSupply";
    values: void;
};
export interface TokenMetadata {
    decimal: u32;
    name: string;
    symbol: string;
}

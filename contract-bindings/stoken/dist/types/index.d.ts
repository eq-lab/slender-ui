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
export interface AllowanceValue {
    amount: i128;
    expiration_ledger: u32;
}
export interface AllowanceDataKey {
    from: Address;
    spender: Address;
}
export type DataKey = {
    tag: "Allowance";
    values: [AllowanceDataKey];
} | {
    tag: "UnderlyingAsset";
    values: void;
};
/**
 * Initializes the Stoken contract.
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
export declare function initialize({ name, symbol, pool, underlying_asset }: {
    name: string;
    symbol: string;
    pool: Address;
    underlying_asset: Address;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
export declare function upgrade({ new_wasm_hash }: {
    new_wasm_hash: Buffer;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
export declare function version({ signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<u32>;
/**
 * Returns the amount of tokens that the `spender` is allowed to withdraw from the `from` address.
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
export declare function allowance({ from, spender }: {
    from: Address;
    spender: Address;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<i128>;
/**
 * Set the allowance for a spender to withdraw from the `from` address by a specified amount of tokens.
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
export declare function approve({ from, spender, amount, expiration_ledger }: {
    from: Address;
    spender: Address;
    amount: i128;
    expiration_ledger: u32;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
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
 * Returns the spendable balance of tokens for a specified id.
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
 * Transfers a specified amount of tokens from one account (`from`) to another account (`to`).
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
export declare function transfer({ from, to, amount }: {
    from: Address;
    to: Address;
    amount: i128;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
/**
 * Transfers a specified amount of tokens from the from account to the to account on behalf of the spender account.
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
export declare function transfer_from({ spender, from, to, amount }: {
    spender: Address;
    from: Address;
    to: Address;
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
 * Mints a specified amount of tokens for a given `id` and returns total supply
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
 * Burns a specified amount of tokens from the from account and returns total supply
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
export declare function burn({ from, amount_to_burn, amount_to_withdraw, to }: {
    from: Address;
    amount_to_burn: i128;
    amount_to_withdraw: i128;
    to: Address;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
/**
 * Returns the number of decimal places used by the token.
 *
 * # Returns
 *
 * The number of decimal places used by the token.
 *
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
/**
 * Transfers tokens during a liquidation.
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
export declare function transfer_on_liquidation({ from, to, amount }: {
    from: Address;
    to: Address;
    amount: i128;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
/**
 * Transfers the underlying asset to the specified recipient.
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
export declare function transfer_underlying_to({ to, amount }: {
    to: Address;
    amount: i128;
}, { signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<void>;
/**
 * Retrieves the address of the underlying asset.
 *
 * # Returns
 *
 * The address of the underlying asset.
 *
 */
export declare function underlying_asset({ signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<Address>;
/**
 * Retrieves the address of the pool.
 *
 * # Returns
 *
 * The address of the associated pool.
 *
 */
export declare function pool({ signAndSend, fee }?: {
    signAndSend?: boolean;
    fee?: number;
}): Promise<Address>;
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
export interface ReserveConfiguration {
    borrowing_enabled: boolean;
    decimals: u32;
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
/**
 * Interest rate parameters
 */
export interface IRParams {
    alpha: u32;
    initial_rate: u32;
    max_rate: u32;
    scaling_coeff: u32;
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
export interface InitReserveInput {
    debt_token_address: Address;
    s_token_address: Address;
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
/**
 * Implements the bitmap logic to handle the user configuration.
 * Even positions is collateral flags and uneven is borrowing flags.
 */
export type UserConfiguration = [u128];
export interface AccountPosition {
    debt: i128;
    discounted_collateral: i128;
    npv: i128;
}
export interface TokenMetadata {
    decimal: u32;
    name: string;
    symbol: string;
}

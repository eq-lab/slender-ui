import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
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
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  unknown: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: "CAUE3RVG6QPXZJHHI6VW24SCCRA2DIYEDAAPSUGZ2PRPCF6EM74U3CUU",
  }
} as const


export interface AllowanceValue {
  amount: i128;
  expiration_ledger: u32;
}


export interface AllowanceDataKey {
  from: string;
  spender: string;
}

export type DataKey = {tag: "Allowance", values: readonly [AllowanceDataKey]} | {tag: "UnderlyingAsset", values: void};

export type CommonDataKey = {tag: "Balance", values: readonly [string]} | {tag: "State", values: readonly [string]} | {tag: "Pool", values: void} | {tag: "TotalSupply", values: void};


export interface AccountPosition {
  debt: i128;
  discounted_collateral: i128;
  npv: i128;
}


export interface AssetBalance {
  asset: string;
  balance: i128;
}


export interface BaseAssetConfig {
  address: string;
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
 * The total amount of an asset the protocol accepts into the market.
 */
liq_cap: i128;
  /**
 * Liquidation order
 */
pen_order: u32;
  util_cap: u32;
}

export const Errors = {
  0: {message:"AlreadyInitialized"},

  1: {message:"Uninitialized"},

  2: {message:"Paused"},

  3: {message:"BellowMinValue"},

  4: {message:"ExceededMaxValue"},

  5: {message:"GracePeriod"},

  100: {message:"NoActiveReserve"},

  101: {message:"ReservesMaxCapacityExceeded"},

  102: {message:"NoPriceForAsset"},

  103: {message:"InvalidAssetPrice"},

  104: {message:"LiquidationOrderMustBeUnique"},

  105: {message:"NotFungible"},

  200: {message:"NotEnoughAvailableUserBalance"},

  201: {message:"DebtError"},

  300: {message:"BorrowingDisabled"},

  301: {message:"GoodPosition"},

  302: {message:"InvalidAmount"},

  303: {message:"ValidateBorrowMathError"},

  304: {message:"CalcAccountDataMathError"},

  305: {message:"LiquidateMathError"},

  306: {message:"MustNotBeInCollateralAsset"},

  307: {message:"FlashLoanReceiverError"},

  400: {message:"MathOverflowError"},

  401: {message:"MustBeLtePercentageFactor"},

  402: {message:"MustBeLtPercentageFactor"},

  403: {message:"MustBeGtPercentageFactor"},

  404: {message:"MustBeNonNegative"},

  500: {message:"AccruedRateMathError"},

  501: {message:"CollateralCoeffMathError"},

  502: {message:"DebtCoeffMathError"}
}

export interface FlashLoanAsset {
  amount: i128;
  asset: string;
  borrow: boolean;
}

export type OracleAsset = {tag: "Stellar", values: readonly [string]} | {tag: "Other", values: readonly [string]};


export interface PauseInfo {
  grace_period_secs: u64;
  paused: boolean;
  unpaused_at: u64;
}


export interface PoolConfig {
  base_asset_address: string;
  base_asset_decimals: u32;
  flash_loan_fee: u32;
  grace_period: u64;
  initial_health: u32;
  ir_alpha: u32;
  ir_initial_rate: u32;
  ir_max_rate: u32;
  ir_scaling_coeff: u32;
  liquidation_protocol_fee: u32;
  min_collat_amount: i128;
  min_debt_amount: i128;
  timestamp_window: u64;
  user_assets_limit: u32;
}


export interface PriceFeed {
  feed: string;
  feed_asset: OracleAsset;
  feed_decimals: u32;
  min_timestamp_delta: u64;
  timestamp_precision: TimestampPrecision;
  twap_records: u32;
}


export interface PriceFeedConfig {
  asset_decimals: u32;
  feeds: Array<PriceFeed>;
  max_sanity_price_in_base: i128;
  min_sanity_price_in_base: i128;
}


export interface PriceFeedConfigInput {
  asset: string;
  asset_decimals: u32;
  feeds: Array<PriceFeed>;
  max_sanity_price_in_base: i128;
  min_sanity_price_in_base: i128;
}


export interface ReserveConfiguration {
  borrowing_enabled: boolean;
  /**
 * Specifies what fraction of the underlying asset counts toward
 * the portfolio collateral value [0%, 100%].
 */
discount: u32;
  is_active: boolean;
  liquidity_cap: i128;
  pen_order: u32;
  util_cap: u32;
}


export interface ReserveData {
  borrower_ar: i128;
  borrower_ir: i128;
  configuration: ReserveConfiguration;
  /**
 * The id of the reserve (position in the list of the active reserves).
 */
id: Buffer;
  last_update_timestamp: u64;
  lender_ar: i128;
  lender_ir: i128;
  reserve_type: ReserveType;
}

export type ReserveType = {tag: "Fungible", values: readonly [string, string]} | {tag: "RWA", values: void};

export type TimestampPrecision = {tag: "Msec", values: void} | {tag: "Sec", values: void};

export type UserConfiguration = readonly [u128,  u32];
export type Asset = {tag: "Stellar", values: readonly [string]} | {tag: "Other", values: readonly [string]};


export interface PriceData {
  price: i128;
  timestamp: u64;
}


export interface TokenMetadata {
  decimal: u32;
  name: string;
  symbol: string;
}


export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  initialize: ({name, symbol, pool, underlying_asset}: {name: string, symbol: string, pool: string, underlying_asset: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: ({new_wasm_hash}: {new_wasm_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a version transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  version: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a allowance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  allowance: ({from, spender}: {from: string, spender: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  approve: ({from, spender, amount, expiration_ledger}: {from: string, spender: string, amount: i128, expiration_ledger: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  balance: ({id}: {id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a spendable_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  spendable_balance: ({id}: {id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a authorized transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  authorized: ({id}: {id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  transfer: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  transfer_from: ({spender, from, to, amount}: {spender: string, from: string, to: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a burn_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn_from: ({_spender, _from, _amount}: {_spender: string, _from: string, _amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a clawback transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  clawback: ({from, amount}: {from: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_authorized transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  set_authorized: ({id, authorize}: {id: string, authorize: boolean}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  mint: ({to, amount}: {to: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  burn: ({from, amount_to_burn, amount_to_withdraw, to}: {from: string, amount_to_burn: i128, amount_to_withdraw: i128, to: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the number of decimal places used by the token.
   * 
   * # Returns
   * 
   * The number of decimal places used by the token.
   * 
   */
  decimals: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the name of the token.
   * 
   * # Returns
   * 
   * The name of the token as a `soroban_sdk::Bytes` value.
   * 
   */
  name: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the symbol of the token.
   * 
   * # Returns
   * 
   * The symbol of the token as a `soroban_sdk::Bytes` value.
   * 
   */
  symbol: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the total supply of tokens.
   * 
   * # Returns
   * 
   * The total supply of tokens.
   * 
   */
  total_supply: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a transfer_on_liquidation transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  transfer_on_liquidation: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a transfer_underlying_to transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  transfer_underlying_to: ({to, amount}: {to: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a underlying_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Retrieves the address of the underlying asset.
   * 
   * # Returns
   * 
   * The address of the underlying asset.
   * 
   */
  underlying_asset: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Retrieves the address of the pool.
   * 
   * # Returns
   * 
   * The address of the associated pool.
   * 
   */
  pool: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAADkFsbG93YW5jZVZhbHVlAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABA==",
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
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAHgAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAAAAAAAAAAAAA1VbmluaXRpYWxpemVkAAAAAAAAAQAAAAAAAAAGUGF1c2VkAAAAAAACAAAAAAAAAA5CZWxsb3dNaW5WYWx1ZQAAAAAAAwAAAAAAAAAQRXhjZWVkZWRNYXhWYWx1ZQAAAAQAAAAAAAAAC0dyYWNlUGVyaW9kAAAAAAUAAAAAAAAAD05vQWN0aXZlUmVzZXJ2ZQAAAABkAAAAAAAAABtSZXNlcnZlc01heENhcGFjaXR5RXhjZWVkZWQAAAAAZQAAAAAAAAAPTm9QcmljZUZvckFzc2V0AAAAAGYAAAAAAAAAEUludmFsaWRBc3NldFByaWNlAAAAAAAAZwAAAAAAAAAcTGlxdWlkYXRpb25PcmRlck11c3RCZVVuaXF1ZQAAAGgAAAAAAAAAC05vdEZ1bmdpYmxlAAAAAGkAAAAAAAAAHU5vdEVub3VnaEF2YWlsYWJsZVVzZXJCYWxhbmNlAAAAAAAAyAAAAAAAAAAJRGVidEVycm9yAAAAAAAAyQAAAAAAAAARQm9ycm93aW5nRGlzYWJsZWQAAAAAAAEsAAAAAAAAAAxHb29kUG9zaXRpb24AAAEtAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAABLgAAAAAAAAAXVmFsaWRhdGVCb3Jyb3dNYXRoRXJyb3IAAAABLwAAAAAAAAAYQ2FsY0FjY291bnREYXRhTWF0aEVycm9yAAABMAAAAAAAAAASTGlxdWlkYXRlTWF0aEVycm9yAAAAAAExAAAAAAAAABpNdXN0Tm90QmVJbkNvbGxhdGVyYWxBc3NldAAAAAABMgAAAAAAAAAWRmxhc2hMb2FuUmVjZWl2ZXJFcnJvcgAAAAABMwAAAAAAAAARTWF0aE92ZXJmbG93RXJyb3IAAAAAAAGQAAAAAAAAABlNdXN0QmVMdGVQZXJjZW50YWdlRmFjdG9yAAAAAAABkQAAAAAAAAAYTXVzdEJlTHRQZXJjZW50YWdlRmFjdG9yAAABkgAAAAAAAAAYTXVzdEJlR3RQZXJjZW50YWdlRmFjdG9yAAABkwAAAAAAAAARTXVzdEJlTm9uTmVnYXRpdmUAAAAAAAGUAAAAAAAAABRBY2NydWVkUmF0ZU1hdGhFcnJvcgAAAfQAAAAAAAAAGENvbGxhdGVyYWxDb2VmZk1hdGhFcnJvcgAAAfUAAAAAAAAAEkRlYnRDb2VmZk1hdGhFcnJvcgAAAAAB9g==",
        "AAAAAQAAAAAAAAAAAAAADkZsYXNoTG9hbkFzc2V0AAAAAAADAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAGYm9ycm93AAAAAAAB",
        "AAAAAgAAAAAAAAAAAAAAC09yYWNsZUFzc2V0AAAAAAIAAAABAAAAAAAAAAdTdGVsbGFyAAAAAAEAAAATAAAAAQAAAAAAAAAFT3RoZXIAAAAAAAABAAAAEQ==",
        "AAAAAQAAAAAAAAAAAAAACVBhdXNlSW5mbwAAAAAAAAMAAAAAAAAAEWdyYWNlX3BlcmlvZF9zZWNzAAAAAAAABgAAAAAAAAAGcGF1c2VkAAAAAAABAAAAAAAAAAt1bnBhdXNlZF9hdAAAAAAG",
        "AAAAAQAAAAAAAAAAAAAAClBvb2xDb25maWcAAAAAAA4AAAAAAAAAEmJhc2VfYXNzZXRfYWRkcmVzcwAAAAAAEwAAAAAAAAATYmFzZV9hc3NldF9kZWNpbWFscwAAAAAEAAAAAAAAAA5mbGFzaF9sb2FuX2ZlZQAAAAAABAAAAAAAAAAMZ3JhY2VfcGVyaW9kAAAABgAAAAAAAAAOaW5pdGlhbF9oZWFsdGgAAAAAAAQAAAAAAAAACGlyX2FscGhhAAAABAAAAAAAAAAPaXJfaW5pdGlhbF9yYXRlAAAAAAQAAAAAAAAAC2lyX21heF9yYXRlAAAAAAQAAAAAAAAAEGlyX3NjYWxpbmdfY29lZmYAAAAEAAAAAAAAABhsaXF1aWRhdGlvbl9wcm90b2NvbF9mZWUAAAAEAAAAAAAAABFtaW5fY29sbGF0X2Ftb3VudAAAAAAAAAsAAAAAAAAAD21pbl9kZWJ0X2Ftb3VudAAAAAALAAAAAAAAABB0aW1lc3RhbXBfd2luZG93AAAABgAAAAAAAAARdXNlcl9hc3NldHNfbGltaXQAAAAAAAAE",
        "AAAAAQAAAAAAAAAAAAAACVByaWNlRmVlZAAAAAAAAAYAAAAAAAAABGZlZWQAAAATAAAAAAAAAApmZWVkX2Fzc2V0AAAAAAfQAAAAC09yYWNsZUFzc2V0AAAAAAAAAAANZmVlZF9kZWNpbWFscwAAAAAAAAQAAAAAAAAAE21pbl90aW1lc3RhbXBfZGVsdGEAAAAABgAAAAAAAAATdGltZXN0YW1wX3ByZWNpc2lvbgAAAAfQAAAAElRpbWVzdGFtcFByZWNpc2lvbgAAAAAAAAAAAAx0d2FwX3JlY29yZHMAAAAE",
        "AAAAAQAAAAAAAAAAAAAAD1ByaWNlRmVlZENvbmZpZwAAAAAEAAAAAAAAAA5hc3NldF9kZWNpbWFscwAAAAAABAAAAAAAAAAFZmVlZHMAAAAAAAPqAAAH0AAAAAlQcmljZUZlZWQAAAAAAAAAAAAAGG1heF9zYW5pdHlfcHJpY2VfaW5fYmFzZQAAAAsAAAAAAAAAGG1pbl9zYW5pdHlfcHJpY2VfaW5fYmFzZQAAAAs=",
        "AAAAAQAAAAAAAAAAAAAAFFByaWNlRmVlZENvbmZpZ0lucHV0AAAABQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAA5hc3NldF9kZWNpbWFscwAAAAAABAAAAAAAAAAFZmVlZHMAAAAAAAPqAAAH0AAAAAlQcmljZUZlZWQAAAAAAAAAAAAAGG1heF9zYW5pdHlfcHJpY2VfaW5fYmFzZQAAAAsAAAAAAAAAGG1pbl9zYW5pdHlfcHJpY2VfaW5fYmFzZQAAAAs=",
        "AAAAAQAAAAAAAAAAAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAABgAAAAAAAAARYm9ycm93aW5nX2VuYWJsZWQAAAAAAAABAAAAaFNwZWNpZmllcyB3aGF0IGZyYWN0aW9uIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGNvdW50cyB0b3dhcmQKdGhlIHBvcnRmb2xpbyBjb2xsYXRlcmFsIHZhbHVlIFswJSwgMTAwJV0uAAAACGRpc2NvdW50AAAABAAAAAAAAAAJaXNfYWN0aXZlAAAAAAAAAQAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAsAAAAAAAAACXBlbl9vcmRlcgAAAAAAAAQAAAAAAAAACHV0aWxfY2FwAAAABA==",
        "AAAAAQAAAAAAAAAAAAAAC1Jlc2VydmVEYXRhAAAAAAgAAAAAAAAAC2JvcnJvd2VyX2FyAAAAAAsAAAAAAAAAC2JvcnJvd2VyX2lyAAAAAAsAAAAAAAAADWNvbmZpZ3VyYXRpb24AAAAAAAfQAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAARFRoZSBpZCBvZiB0aGUgcmVzZXJ2ZSAocG9zaXRpb24gaW4gdGhlIGxpc3Qgb2YgdGhlIGFjdGl2ZSByZXNlcnZlcykuAAAAAmlkAAAAAAPuAAAAAQAAAAAAAAAVbGFzdF91cGRhdGVfdGltZXN0YW1wAAAAAAAABgAAAAAAAAAJbGVuZGVyX2FyAAAAAAAACwAAAAAAAAAJbGVuZGVyX2lyAAAAAAAACwAAAAAAAAAMcmVzZXJ2ZV90eXBlAAAH0AAAAAtSZXNlcnZlVHlwZQA=",
        "AAAAAgAAAAAAAAAAAAAAC1Jlc2VydmVUeXBlAAAAAAIAAAABAAAAN0Z1bmdpYmxlIHJlc2VydmUgZm9yIHdoaWNoIGNyZWF0ZWQgc1Rva2VuIGFuZCBkZWJ0VG9rZW4AAAAACEZ1bmdpYmxlAAAAAgAAABMAAAATAAAAAAAAAAtSV0EgcmVzZXJ2ZQAAAAADUldBAA==",
        "AAAAAgAAAAAAAAAAAAAAElRpbWVzdGFtcFByZWNpc2lvbgAAAAAAAgAAAAAAAAAAAAAABE1zZWMAAAAAAAAAAAAAAANTZWMA",
        "AAAAAQAAAAAAAAAAAAAAEVVzZXJDb25maWd1cmF0aW9uAAAAAAAAAgAAAAAAAAABMAAAAAAAAAoAAAAAAAAAATEAAAAAAAAE",
        "AAAAAgAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAAAEAAAAAAAAAB1N0ZWxsYXIAAAAAAQAAABMAAAABAAAAAAAAAAVPdGhlcgAAAAAAAAEAAAAR",
        "AAAAAQAAAAAAAAAAAAAACVByaWNlRGF0YQAAAAAAAAIAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==",
        "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        upgrade: this.txFromJSON<null>,
        version: this.txFromJSON<u32>,
        allowance: this.txFromJSON<i128>,
        approve: this.txFromJSON<null>,
        balance: this.txFromJSON<i128>,
        spendable_balance: this.txFromJSON<i128>,
        authorized: this.txFromJSON<boolean>,
        transfer: this.txFromJSON<null>,
        transfer_from: this.txFromJSON<null>,
        burn_from: this.txFromJSON<null>,
        clawback: this.txFromJSON<null>,
        set_authorized: this.txFromJSON<null>,
        mint: this.txFromJSON<null>,
        burn: this.txFromJSON<null>,
        decimals: this.txFromJSON<u32>,
        name: this.txFromJSON<string>,
        symbol: this.txFromJSON<string>,
        total_supply: this.txFromJSON<i128>,
        transfer_on_liquidation: this.txFromJSON<null>,
        transfer_underlying_to: this.txFromJSON<null>,
        underlying_asset: this.txFromJSON<string>,
        pool: this.txFromJSON<string>
  }
}
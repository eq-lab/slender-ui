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
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDOWGSFIKIFAQ3S4AWMKAYD6CMBQ7GTLJS36Q5WJWO4CML4FY7VYOGC3",
  }
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "Reserves", values: void} | {tag: "ReserveAssetKey", values: readonly [string]} | {tag: "UserConfig", values: readonly [string]} | {tag: "PriceFeed", values: readonly [string]} | {tag: "Pause", values: void} | {tag: "TokenSupply", values: readonly [string]} | {tag: "TokenBalance", values: readonly [string, string]} | {tag: "PoolConfig", values: void} | {tag: "ProtocolFeeVault", values: readonly [string]};


export interface LiquidationAsset {
  asset: string;
  coeff: Option<i128>;
  comp_balance: i128;
  lp_balance: Option<i128>;
  reserve: ReserveData;
}


export interface LoanAsset {
  amount: i128;
  asset: string;
  borrow: boolean;
  premium: i128;
}


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
  0: {message:""},
  1: {message:""},
  2: {message:""},
  3: {message:""},
  4: {message:""},
  5: {message:""},
  100: {message:""},
  101: {message:""},
  102: {message:""},
  103: {message:""},
  104: {message:""},
  105: {message:""},
  200: {message:""},
  201: {message:""},
  300: {message:""},
  301: {message:""},
  302: {message:""},
  303: {message:""},
  304: {message:""},
  305: {message:""},
  306: {message:""},
  307: {message:""},
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


export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, pool_config}: {admin: string, pool_config: PoolConfig}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a upgrade_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade_token: ({asset, s_token, new_wasm_hash}: {asset: string, s_token: boolean, new_wasm_hash: Buffer}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

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
   * Construct and simulate a init_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  init_reserve: ({asset, reserve_type}: {asset: string, reserve_type: ReserveType}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a set_reserve_status transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_reserve_status: ({asset, is_active}: {asset: string, is_active: boolean}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a enable_borrowing_on_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  enable_borrowing_on_reserve: ({asset, enabled}: {asset: string, enabled: boolean}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a configure_as_collateral transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  configure_as_collateral: ({asset, params}: {asset: string, params: CollateralParamsInput}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_reserve: ({asset}: {asset: string}, options?: {
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
  }) => Promise<AssembledTransaction<Option<ReserveData>>>

  /**
   * Construct and simulate a collat_coeff transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  collat_coeff: ({asset}: {asset: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a debt_coeff transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  debt_coeff: ({asset}: {asset: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a set_pool_configuration transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_configuration: ({config}: {config: PoolConfig}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a pool_configuration transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pool_configuration: (options?: {
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
  }) => Promise<AssembledTransaction<Result<PoolConfig>>>

  /**
   * Construct and simulate a set_price_feeds transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_price_feeds: ({inputs}: {inputs: Array<PriceFeedConfigInput>}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a price_feeds transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  price_feeds: ({asset}: {asset: string}, options?: {
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
  }) => Promise<AssembledTransaction<Option<PriceFeedConfig>>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: ({who, asset, amount}: {who: string, asset: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a repay transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  repay: ({who, asset, amount}: {who: string, asset: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a finalize_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  finalize_transfer: ({asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply}: {asset: string, from: string, to: string, amount: i128, balance_from_before: i128, balance_to_before: i128, s_token_supply: i128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw: ({who, asset, amount, to}: {who: string, asset: string, amount: i128, to: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a borrow transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  borrow: ({who, asset, amount}: {who: string, asset: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a set_pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pause: ({value}: {value: boolean}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a pause_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pause_info: (options?: {
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
  }) => Promise<AssembledTransaction<PauseInfo>>

  /**
   * Construct and simulate a account_position transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  account_position: ({who}: {who: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<AccountPosition>>>

  /**
   * Construct and simulate a liquidate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  liquidate: ({liquidator, who}: {liquidator: string, who: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a set_as_collateral transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_as_collateral: ({who, asset, use_as_collateral}: {who: string, asset: string, use_as_collateral: boolean}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a user_configuration transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  user_configuration: ({who}: {who: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<UserConfiguration>>>

  /**
   * Construct and simulate a token_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  token_balance: ({token, account}: {token: string, account: string}, options?: {
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
   * Construct and simulate a token_total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  token_total_supply: ({token}: {token: string}, options?: {
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
   * Construct and simulate a flash_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  flash_loan: ({who, receiver, loan_assets, params}: {who: string, receiver: string, loan_assets: Array<FlashLoanAsset>, params: Buffer}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a twap_median_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  twap_median_price: ({asset, amount}: {asset: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a protocol_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  protocol_fee: ({asset}: {asset: string}, options?: {
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
   * Construct and simulate a claim_protocol_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  claim_protocol_fee: ({asset, recipient}: {asset: string, recipient: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAIUmVzZXJ2ZXMAAAABAAAAAAAAAA9SZXNlcnZlQXNzZXRLZXkAAAAAAQAAABMAAAABAAAAAAAAAApVc2VyQ29uZmlnAAAAAAABAAAAEwAAAAEAAAAAAAAACVByaWNlRmVlZAAAAAAAAAEAAAATAAAAAAAAAAAAAAAFUGF1c2UAAAAAAAABAAAAAAAAAAtUb2tlblN1cHBseQAAAAABAAAAEwAAAAEAAAAAAAAADFRva2VuQmFsYW5jZQAAAAIAAAATAAAAEwAAAAAAAAAAAAAAClBvb2xDb25maWcAAAAAAAEAAAAAAAAAEFByb3RvY29sRmVlVmF1bHQAAAABAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAEExpcXVpZGF0aW9uQXNzZXQAAAAFAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABWNvZWZmAAAAAAAD6AAAAAsAAAAAAAAADGNvbXBfYmFsYW5jZQAAAAsAAAAAAAAACmxwX2JhbGFuY2UAAAAAA+gAAAALAAAAAAAAAAdyZXNlcnZlAAAAB9AAAAALUmVzZXJ2ZURhdGEA",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAtwb29sX2NvbmZpZwAAAAfQAAAAClBvb2xDb25maWcAAAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAANdXBncmFkZV90b2tlbgAAAAAAAAMAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAHc190b2tlbgAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAHdmVyc2lvbgAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAMaW5pdF9yZXNlcnZlAAAAAgAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAxyZXNlcnZlX3R5cGUAAAfQAAAAC1Jlc2VydmVUeXBlAAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAASc2V0X3Jlc2VydmVfc3RhdHVzAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAACWlzX2FjdGl2ZQAAAAAAAAEAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAbZW5hYmxlX2JvcnJvd2luZ19vbl9yZXNlcnZlAAAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAHZW5hYmxlZAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAXY29uZmlndXJlX2FzX2NvbGxhdGVyYWwAAAAAAgAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZwYXJhbXMAAAAAB9AAAAAVQ29sbGF0ZXJhbFBhcmFtc0lucHV0AAAAAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAALZ2V0X3Jlc2VydmUAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+gAAAfQAAAAC1Jlc2VydmVEYXRhAA==",
        "AAAAAAAAAAAAAAAMY29sbGF0X2NvZWZmAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+kAAAALAAAAAw==",
        "AAAAAAAAAAAAAAAKZGVidF9jb2VmZgAAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+kAAAALAAAAAw==",
        "AAAAAAAAAAAAAAAWc2V0X3Bvb2xfY29uZmlndXJhdGlvbgAAAAAAAQAAAAAAAAAGY29uZmlnAAAAAAfQAAAAClBvb2xDb25maWcAAAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAScG9vbF9jb25maWd1cmF0aW9uAAAAAAAAAAAAAQAAA+kAAAfQAAAAClBvb2xDb25maWcAAAAAAAM=",
        "AAAAAAAAAAAAAAAPc2V0X3ByaWNlX2ZlZWRzAAAAAAEAAAAAAAAABmlucHV0cwAAAAAD6gAAB9AAAAAUUHJpY2VGZWVkQ29uZmlnSW5wdXQAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAALcHJpY2VfZmVlZHMAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+gAAAfQAAAAD1ByaWNlRmVlZENvbmZpZwA=",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAFcmVwYXkAAAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAARZmluYWxpemVfdHJhbnNmZXIAAAAAAAAHAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAABNiYWxhbmNlX2Zyb21fYmVmb3JlAAAAAAsAAAAAAAAAEWJhbGFuY2VfdG9fYmVmb3JlAAAAAAAACwAAAAAAAAAOc190b2tlbl9zdXBwbHkAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAEAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAnRvAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAGYm9ycm93AAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAJc2V0X3BhdXNlAAAAAAAAAQAAAAAAAAAFdmFsdWUAAAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAKcGF1c2VfaW5mbwAAAAAAAAAAAAEAAAfQAAAACVBhdXNlSW5mbwAAAA==",
        "AAAAAAAAAAAAAAAQYWNjb3VudF9wb3NpdGlvbgAAAAEAAAAAAAAAA3dobwAAAAATAAAAAQAAA+kAAAfQAAAAD0FjY291bnRQb3NpdGlvbgAAAAAD",
        "AAAAAAAAAAAAAAAJbGlxdWlkYXRlAAAAAAAAAgAAAAAAAAAKbGlxdWlkYXRvcgAAAAAAEwAAAAAAAAADd2hvAAAAABMAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAARc2V0X2FzX2NvbGxhdGVyYWwAAAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAABF1c2VfYXNfY29sbGF0ZXJhbAAAAAAAAAEAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAASdXNlcl9jb25maWd1cmF0aW9uAAAAAAABAAAAAAAAAAN3aG8AAAAAEwAAAAEAAAPpAAAH0AAAABFVc2VyQ29uZmlndXJhdGlvbgAAAAAAAAM=",
        "AAAAAAAAAAAAAAANdG9rZW5fYmFsYW5jZQAAAAAAAAIAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAASdG9rZW5fdG90YWxfc3VwcGx5AAAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAKZmxhc2hfbG9hbgAAAAAABAAAAAAAAAADd2hvAAAAABMAAAAAAAAACHJlY2VpdmVyAAAAEwAAAAAAAAALbG9hbl9hc3NldHMAAAAD6gAAB9AAAAAORmxhc2hMb2FuQXNzZXQAAAAAAAAAAAAGcGFyYW1zAAAAAAAOAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAARdHdhcF9tZWRpYW5fcHJpY2UAAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAPpAAAACwAAAAM=",
        "AAAAAAAAAAAAAAAMcHJvdG9jb2xfZmVlAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAASY2xhaW1fcHJvdG9jb2xfZmVlAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAACUxvYW5Bc3NldAAAAAAAAAQAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZib3Jyb3cAAAAAAAEAAAAAAAAAB3ByZW1pdW0AAAAACw==",
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
        "AAAAAQAAAAAAAAAAAAAACVByaWNlRGF0YQAAAAAAAAIAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<Result<void>>,
        upgrade: this.txFromJSON<Result<void>>,
        upgrade_token: this.txFromJSON<Result<void>>,
        version: this.txFromJSON<u32>,
        init_reserve: this.txFromJSON<Result<void>>,
        set_reserve_status: this.txFromJSON<Result<void>>,
        enable_borrowing_on_reserve: this.txFromJSON<Result<void>>,
        configure_as_collateral: this.txFromJSON<Result<void>>,
        get_reserve: this.txFromJSON<Option<ReserveData>>,
        collat_coeff: this.txFromJSON<Result<i128>>,
        debt_coeff: this.txFromJSON<Result<i128>>,
        set_pool_configuration: this.txFromJSON<Result<void>>,
        pool_configuration: this.txFromJSON<Result<PoolConfig>>,
        set_price_feeds: this.txFromJSON<Result<void>>,
        price_feeds: this.txFromJSON<Option<PriceFeedConfig>>,
        deposit: this.txFromJSON<Result<void>>,
        repay: this.txFromJSON<Result<void>>,
        finalize_transfer: this.txFromJSON<Result<void>>,
        withdraw: this.txFromJSON<Result<void>>,
        borrow: this.txFromJSON<Result<void>>,
        set_pause: this.txFromJSON<Result<void>>,
        pause_info: this.txFromJSON<PauseInfo>,
        account_position: this.txFromJSON<Result<AccountPosition>>,
        liquidate: this.txFromJSON<Result<void>>,
        set_as_collateral: this.txFromJSON<Result<void>>,
        user_configuration: this.txFromJSON<Result<UserConfiguration>>,
        token_balance: this.txFromJSON<i128>,
        token_total_supply: this.txFromJSON<i128>,
        flash_loan: this.txFromJSON<Result<void>>,
        twap_median_price: this.txFromJSON<Result<i128>>,
        protocol_fee: this.txFromJSON<i128>,
        claim_protocol_fee: this.txFromJSON<Result<void>>
  }
}
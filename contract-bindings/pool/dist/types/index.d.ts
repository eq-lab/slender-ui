/// <reference types="node" />
import * as SorobanClient from 'soroban-client';
import { ContractSpec, Address } from 'soroban-client';
import { Buffer } from "buffer";
import type { ResponseTypes, ClassOptions } from './method-options.js';
export * from './invoke.js';
export * from './method-options.js';
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
export { Address };
export interface Error_ {
    message: string;
}
export interface Result<T, E extends Error_> {
    unwrap(): T;
    unwrapErr(): E;
    isOk(): boolean;
    isErr(): boolean;
}
export declare class Ok<T, E extends Error_ = Error_> implements Result<T, E> {
    readonly value: T;
    constructor(value: T);
    unwrapErr(): E;
    unwrap(): T;
    isOk(): boolean;
    isErr(): boolean;
}
export declare class Err<E extends Error_ = Error_> implements Result<any, E> {
    readonly error: E;
    constructor(error: E);
    unwrapErr(): E;
    unwrap(): never;
    isOk(): boolean;
    isErr(): boolean;
}
export declare const networks: {
    readonly futurenet: {
        readonly networkPassphrase: "Test SDF Future Network ; October 2022";
        readonly contractId: "CDIXGNUT7L7FRAPDZSKXPU4UPONE4K2G47NGWJO73IYQ2AKR5JTHULFP";
    };
};
export type DataKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "BaseAsset";
    values: void;
} | {
    tag: "Reserves";
    values: void;
} | {
    tag: "ReserveAssetKey";
    values: readonly [Address];
} | {
    tag: "ReserveTimestampWindow";
    values: void;
} | {
    tag: "Treasury";
    values: void;
} | {
    tag: "IRParams";
    values: void;
} | {
    tag: "UserConfig";
    values: readonly [Address];
} | {
    tag: "PriceFeed";
    values: readonly [Address];
} | {
    tag: "Pause";
    values: void;
} | {
    tag: "FlashLoanFee";
    values: void;
} | {
    tag: "STokenUnderlyingBalance";
    values: readonly [Address];
} | {
    tag: "TokenSupply";
    values: readonly [Address];
} | {
    tag: "TokenBalance";
    values: readonly [Address, Address];
};
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
export declare class Contract {
    readonly options: ClassOptions;
    spec: ContractSpec;
    constructor(options: ClassOptions);
    initialize<R extends ResponseTypes = undefined>({ admin, treasury, flash_loan_fee, ir_params }: {
        admin: Address;
        treasury: Address;
        flash_loan_fee: u32;
        ir_params: IRParams;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    upgrade<R extends ResponseTypes = undefined>({ new_wasm_hash }: {
        new_wasm_hash: Buffer;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    upgradeSToken<R extends ResponseTypes = undefined>({ asset, new_wasm_hash }: {
        asset: Address;
        new_wasm_hash: Buffer;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    upgradeDebtToken<R extends ResponseTypes = undefined>({ asset, new_wasm_hash }: {
        asset: Address;
        new_wasm_hash: Buffer;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    version<R extends ResponseTypes = undefined>(options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `u32`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? number : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : number>;
    initReserve<R extends ResponseTypes = undefined>({ asset, input }: {
        asset: Address;
        input: InitReserveInput;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    setReserveStatus<R extends ResponseTypes = undefined>({ asset, is_active }: {
        asset: Address;
        is_active: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    setIrParams<R extends ResponseTypes = undefined>({ input }: {
        input: IRParams;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    reserveTimestampWindow<R extends ResponseTypes = undefined>(options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `u64`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? bigint : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : bigint>;
    setReserveTimestampWindow<R extends ResponseTypes = undefined>({ window }: {
        window: u64;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    irParams<R extends ResponseTypes = undefined>(options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Option<IRParams>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? IRParams : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : IRParams>;
    enableBorrowingOnReserve<R extends ResponseTypes = undefined>({ asset, enabled }: {
        asset: Address;
        enabled: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    configureAsCollateral<R extends ResponseTypes = undefined>({ asset, params }: {
        asset: Address;
        params: CollateralParamsInput;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    getReserve<R extends ResponseTypes = undefined>({ asset }: {
        asset: Address;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Option<ReserveData>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? ReserveData : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : ReserveData>;
    collatCoeff<R extends ResponseTypes = undefined>({ asset }: {
        asset: Address;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<i128> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<bigint, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<bigint, Error_>)>;
    debtCoeff<R extends ResponseTypes = undefined>({ asset }: {
        asset: Address;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<i128> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<bigint, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<bigint, Error_>)>;
    baseAsset<R extends ResponseTypes = undefined>(options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<BaseAssetConfig> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<BaseAssetConfig, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<BaseAssetConfig, Error_>)>;
    setBaseAsset<R extends ResponseTypes = undefined>({ asset, decimals }: {
        asset: Address;
        decimals: u32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    setPriceFeed<R extends ResponseTypes = undefined>({ inputs }: {
        inputs: Array<PriceFeedInput>;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    priceFeed<R extends ResponseTypes = undefined>({ asset }: {
        asset: Address;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Option<PriceFeedConfig>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? PriceFeedConfig : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : PriceFeedConfig>;
    deposit<R extends ResponseTypes = undefined>({ who, asset, amount }: {
        who: Address;
        asset: Address;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    repay<R extends ResponseTypes = undefined>({ who, asset, amount }: {
        who: Address;
        asset: Address;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    finalizeTransfer<R extends ResponseTypes = undefined>({ asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply }: {
        asset: Address;
        from: Address;
        to: Address;
        amount: i128;
        balance_from_before: i128;
        balance_to_before: i128;
        s_token_supply: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    withdraw<R extends ResponseTypes = undefined>({ who, asset, amount, to }: {
        who: Address;
        asset: Address;
        amount: i128;
        to: Address;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    borrow<R extends ResponseTypes = undefined>({ who, asset, amount }: {
        who: Address;
        asset: Address;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    setPause<R extends ResponseTypes = undefined>({ value }: {
        value: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    paused<R extends ResponseTypes = undefined>(options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `boolean`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? boolean : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : boolean>;
    treasury<R extends ResponseTypes = undefined>(options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Address`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? SorobanClient.Address : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : SorobanClient.Address>;
    accountPosition<R extends ResponseTypes = undefined>({ who }: {
        who: Address;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<AccountPosition> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<AccountPosition, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<AccountPosition, Error_>)>;
    liquidate<R extends ResponseTypes = undefined>({ liquidator, who, debt_asset, receive_stoken }: {
        liquidator: Address;
        who: Address;
        debt_asset: Address;
        receive_stoken: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    setAsCollateral<R extends ResponseTypes = undefined>({ who, asset, use_as_collateral }: {
        who: Address;
        asset: Address;
        use_as_collateral: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    userConfiguration<R extends ResponseTypes = undefined>({ who }: {
        who: Address;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<UserConfiguration> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<UserConfiguration, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<UserConfiguration, Error_>)>;
    stokenUnderlyingBalance<R extends ResponseTypes = undefined>({ stoken_address }: {
        stoken_address: Address;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? bigint : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : bigint>;
    tokenBalance<R extends ResponseTypes = undefined>({ token, account }: {
        token: Address;
        account: Address;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? bigint : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : bigint>;
    tokenTotalSupply<R extends ResponseTypes = undefined>({ token }: {
        token: Address;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? bigint : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : bigint>;
    setFlashLoanFee<R extends ResponseTypes = undefined>({ fee }: {
        fee: u32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
    flashLoanFee<R extends ResponseTypes = undefined>(options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `u32`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<R extends undefined ? number : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : number>;
    flashLoan<R extends ResponseTypes = undefined>({ who, receiver, loan_assets, params }: {
        who: Address;
        receiver: Address;
        loan_assets: Array<FlashLoanAsset>;
        params: Buffer;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R;
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number;
    }): Promise<Err<Error_> | (R extends undefined ? Err<Error_> | Ok<void, Error_> : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : Err<Error_> | Ok<void, Error_>)>;
}

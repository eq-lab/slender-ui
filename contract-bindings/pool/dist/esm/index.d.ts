/// <reference types="node" />
import { ContractSpec } from '@stellar/stellar-sdk';
import { Buffer } from "buffer";
import { AssembledTransaction, Ok, Err } from './assembled-tx.js';
import type { u32, u64, u128, i128, Option, Error_ } from './assembled-tx.js';
import type { ClassOptions } from './method-options.js';
export * from './assembled-tx.js';
export * from './method-options.js';
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CCRLT4DYOWQYDO3W33CL2F6SIURAY35QXSQAGGXFQLM4YHZQJPR6NFVR";
    };
};
/**
    
    */
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
    values: readonly [string];
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
    values: readonly [string];
} | {
    tag: "PriceFeed";
    values: readonly [string];
} | {
    tag: "Pause";
    values: void;
} | {
    tag: "FlashLoanFee";
    values: void;
} | {
    tag: "STokenUnderlyingBalance";
    values: readonly [string];
} | {
    tag: "TokenSupply";
    values: readonly [string];
} | {
    tag: "TokenBalance";
    values: readonly [string, string];
} | {
    tag: "InitialHealth";
    values: void;
};
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
export declare const Errors: {
    0: {
        message: string;
    };
    1: {
        message: string;
    };
    2: {
        message: string;
    };
    3: {
        message: string;
    };
    100: {
        message: string;
    };
    101: {
        message: string;
    };
    102: {
        message: string;
    };
    103: {
        message: string;
    };
    104: {
        message: string;
    };
    105: {
        message: string;
    };
    106: {
        message: string;
    };
    107: {
        message: string;
    };
    108: {
        message: string;
    };
    109: {
        message: string;
    };
    110: {
        message: string;
    };
    200: {
        message: string;
    };
    201: {
        message: string;
    };
    202: {
        message: string;
    };
    203: {
        message: string;
    };
    204: {
        message: string;
    };
    300: {
        message: string;
    };
    301: {
        message: string;
    };
    302: {
        message: string;
    };
    303: {
        message: string;
    };
    304: {
        message: string;
    };
    305: {
        message: string;
    };
    306: {
        message: string;
    };
    309: {
        message: string;
    };
    310: {
        message: string;
    };
    311: {
        message: string;
    };
    312: {
        message: string;
    };
    313: {
        message: string;
    };
    400: {
        message: string;
    };
    401: {
        message: string;
    };
    402: {
        message: string;
    };
    403: {
        message: string;
    };
    404: {
        message: string;
    };
    500: {
        message: string;
    };
    501: {
        message: string;
    };
    502: {
        message: string;
    };
};
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
export type OracleAsset = {
    tag: "Stellar";
    values: readonly [string];
} | {
    tag: "Other";
    values: readonly [string];
};
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
export type ReserveType = {
    tag: "Fungible";
    values: readonly [string, string];
} | {
    tag: "RWA";
    values: void;
};
/**
    Implements the bitmap logic to handle the user configuration.
    * Even positions is collateral flags and uneven is borrowing flags.
    */
export type UserConfiguration = readonly [u128];
/**
    
    */
export type Asset = {
    tag: "Stellar";
    values: readonly [string];
} | {
    tag: "Other";
    values: readonly [string];
};
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
export declare class Contract {
    readonly options: ClassOptions;
    spec: ContractSpec;
    constructor(options: ClassOptions);
    private readonly parsers;
    private txFromJSON;
    readonly fromJSON: {
        initialize: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        upgrade: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        upgradeSToken: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        upgradeDebtToken: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        version: (json: string) => AssembledTransaction<number>;
        initReserve: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        setReserveStatus: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        setIrParams: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        reserveTimestampWindow: (json: string) => AssembledTransaction<bigint>;
        setReserveTimestampWindow: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        irParams: (json: string) => AssembledTransaction<Option<IRParams>>;
        enableBorrowingOnReserve: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        configureAsCollateral: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        getReserve: (json: string) => AssembledTransaction<Option<ReserveData>>;
        collatCoeff: (json: string) => AssembledTransaction<Err<Error_> | Ok<bigint, Error_>>;
        debtCoeff: (json: string) => AssembledTransaction<Err<Error_> | Ok<bigint, Error_>>;
        baseAsset: (json: string) => AssembledTransaction<Err<Error_> | Ok<BaseAssetConfig, Error_>>;
        setBaseAsset: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        initialHealth: (json: string) => AssembledTransaction<Err<Error_> | Ok<number, Error_>>;
        setInitialHealth: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        setPriceFeeds: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        priceFeeds: (json: string) => AssembledTransaction<Option<PriceFeedConfig>>;
        deposit: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        repay: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        finalizeTransfer: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        withdraw: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        borrow: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        setPause: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        paused: (json: string) => AssembledTransaction<boolean>;
        treasury: (json: string) => AssembledTransaction<string>;
        accountPosition: (json: string) => AssembledTransaction<Err<Error_> | Ok<AccountPosition, Error_>>;
        liquidate: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        setAsCollateral: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        userConfiguration: (json: string) => AssembledTransaction<Err<Error_> | Ok<UserConfiguration, Error_>>;
        stokenUnderlyingBalance: (json: string) => AssembledTransaction<bigint>;
        tokenBalance: (json: string) => AssembledTransaction<bigint>;
        tokenTotalSupply: (json: string) => AssembledTransaction<bigint>;
        setFlashLoanFee: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        flashLoanFee: (json: string) => AssembledTransaction<number>;
        flashLoan: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        twapMedianPrice: (json: string) => AssembledTransaction<Err<Error_> | Ok<bigint, Error_>>;
    };
    /**
* Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    initialize: ({ admin, treasury, flash_loan_fee, initial_health, ir_params }: {
        admin: string;
        treasury: string;
        flash_loan_fee: u32;
        initial_health: u32;
        ir_params: IRParams;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    upgrade: ({ new_wasm_hash }: {
        new_wasm_hash: Buffer;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a upgrade_s_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    upgradeSToken: ({ asset, new_wasm_hash }: {
        asset: string;
        new_wasm_hash: Buffer;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a upgrade_debt_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    upgradeDebtToken: ({ asset, new_wasm_hash }: {
        asset: string;
        new_wasm_hash: Buffer;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a version transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    version: (options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<number>>;
    /**
* Construct and simulate a init_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    initReserve: ({ asset, reserve_type }: {
        asset: string;
        reserve_type: ReserveType;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a set_reserve_status transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setReserveStatus: ({ asset, is_active }: {
        asset: string;
        is_active: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a set_ir_params transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setIrParams: ({ input }: {
        input: IRParams;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a reserve_timestamp_window transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    reserveTimestampWindow: (options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<bigint>>;
    /**
* Construct and simulate a set_reserve_timestamp_window transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setReserveTimestampWindow: ({ window }: {
        window: u64;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a ir_params transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    irParams: (options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Option<IRParams>>>;
    /**
* Construct and simulate a enable_borrowing_on_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    enableBorrowingOnReserve: ({ asset, enabled }: {
        asset: string;
        enabled: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a configure_as_collateral transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    configureAsCollateral: ({ asset, params }: {
        asset: string;
        params: CollateralParamsInput;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a get_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    getReserve: ({ asset }: {
        asset: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Option<ReserveData>>>;
    /**
* Construct and simulate a collat_coeff transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    collatCoeff: ({ asset }: {
        asset: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<bigint, Error_>>>;
    /**
* Construct and simulate a debt_coeff transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    debtCoeff: ({ asset }: {
        asset: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<bigint, Error_>>>;
    /**
* Construct and simulate a base_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    baseAsset: (options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<BaseAssetConfig, Error_>>>;
    /**
* Construct and simulate a set_base_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setBaseAsset: ({ asset, decimals }: {
        asset: string;
        decimals: u32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a initial_health transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    initialHealth: (options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<number, Error_>>>;
    /**
* Construct and simulate a set_initial_health transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setInitialHealth: ({ value }: {
        value: u32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a set_price_feeds transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setPriceFeeds: ({ inputs }: {
        inputs: Array<PriceFeedConfigInput>;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a price_feeds transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    priceFeeds: ({ asset }: {
        asset: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Option<PriceFeedConfig>>>;
    /**
* Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    deposit: ({ who, asset, amount }: {
        who: string;
        asset: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a repay transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    repay: ({ who, asset, amount }: {
        who: string;
        asset: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a finalize_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    finalizeTransfer: ({ asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply }: {
        asset: string;
        from: string;
        to: string;
        amount: i128;
        balance_from_before: i128;
        balance_to_before: i128;
        s_token_supply: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    withdraw: ({ who, asset, amount, to }: {
        who: string;
        asset: string;
        amount: i128;
        to: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a borrow transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    borrow: ({ who, asset, amount }: {
        who: string;
        asset: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a set_pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setPause: ({ value }: {
        value: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    paused: (options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<boolean>>;
    /**
* Construct and simulate a treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    treasury: (options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<string>>;
    /**
* Construct and simulate a account_position transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    accountPosition: ({ who }: {
        who: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<AccountPosition, Error_>>>;
    /**
* Construct and simulate a liquidate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    liquidate: ({ liquidator, who, receive_stoken }: {
        liquidator: string;
        who: string;
        receive_stoken: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a set_as_collateral transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setAsCollateral: ({ who, asset, use_as_collateral }: {
        who: string;
        asset: string;
        use_as_collateral: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a user_configuration transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    userConfiguration: ({ who }: {
        who: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<UserConfiguration, Error_>>>;
    /**
* Construct and simulate a stoken_underlying_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    stokenUnderlyingBalance: ({ stoken_address }: {
        stoken_address: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<bigint>>;
    /**
* Construct and simulate a token_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    tokenBalance: ({ token, account }: {
        token: string;
        account: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<bigint>>;
    /**
* Construct and simulate a token_total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    tokenTotalSupply: ({ token }: {
        token: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<bigint>>;
    /**
* Construct and simulate a set_flash_loan_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setFlashLoanFee: ({ fee }: {
        fee: u32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number | undefined;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a flash_loan_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    flashLoanFee: (options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<number>>;
    /**
* Construct and simulate a flash_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    flashLoan: ({ who, receiver, loan_assets, params }: {
        who: string;
        receiver: string;
        loan_assets: Array<FlashLoanAsset>;
        params: Buffer;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a twap_median_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    twapMedianPrice: ({ asset, amount }: {
        asset: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<bigint, Error_>>>;
}

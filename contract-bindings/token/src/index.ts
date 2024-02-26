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
        contractId: "CBLEVLWUIQXNCW747N2JGYROZ7R2BSQRLG6PJKFHN7ESTILXSJZZSFVY",
    }
} as const

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
export type DataKey = {tag: "Allowance", values: readonly [AllowanceDataKey]} | {tag: "Balance", values: readonly [string]} | {tag: "Nonce", values: readonly [string]} | {tag: "State", values: readonly [string]} | {tag: "Admin", values: void};

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

/**
    
    */
export const Errors = {

}

export class Contract {
    spec: ContractSpec;
    constructor(public readonly options: ClassOptions) {
        this.spec = new ContractSpec([
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABAAAAAA",
        "AAAAAAAAAAAAAAAEbWludAAAAAIAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAJYWxsb3dhbmNlAAAAAAAAAgAAAAAAAAAEZnJvbQAAABMAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
        "AAAAAQAAAAAAAAAAAAAAEEFsbG93YW5jZURhdGFLZXkAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAAT",
        "AAAAAQAAAAAAAAAAAAAADkFsbG93YW5jZVZhbHVlAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAACUFsbG93YW5jZQAAAAAAAAEAAAfQAAAAEEFsbG93YW5jZURhdGFLZXkAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAAFTm9uY2UAAAAAAAABAAAAEwAAAAEAAAAAAAAABVN0YXRlAAAAAAAAAQAAABMAAAAAAAAAAAAAAAVBZG1pbgAAAA==",
        "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA="
        ]);
    }
    private readonly parsers = {
        initialize: () => {},
        mint: () => {},
        setAdmin: () => {},
        allowance: (result: XDR_BASE64): i128 => this.spec.funcResToNative("allowance", result),
        approve: () => {},
        balance: (result: XDR_BASE64): i128 => this.spec.funcResToNative("balance", result),
        transfer: () => {},
        transferFrom: () => {},
        burn: () => {},
        burnFrom: () => {},
        decimals: (result: XDR_BASE64): u32 => this.spec.funcResToNative("decimals", result),
        name: (result: XDR_BASE64): string => this.spec.funcResToNative("name", result),
        symbol: (result: XDR_BASE64): string => this.spec.funcResToNative("symbol", result)
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
        mint: this.txFromJSON<ReturnType<typeof this.parsers['mint']>>,
        setAdmin: this.txFromJSON<ReturnType<typeof this.parsers['setAdmin']>>,
        allowance: this.txFromJSON<ReturnType<typeof this.parsers['allowance']>>,
        approve: this.txFromJSON<ReturnType<typeof this.parsers['approve']>>,
        balance: this.txFromJSON<ReturnType<typeof this.parsers['balance']>>,
        transfer: this.txFromJSON<ReturnType<typeof this.parsers['transfer']>>,
        transferFrom: this.txFromJSON<ReturnType<typeof this.parsers['transferFrom']>>,
        burn: this.txFromJSON<ReturnType<typeof this.parsers['burn']>>,
        burnFrom: this.txFromJSON<ReturnType<typeof this.parsers['burnFrom']>>,
        decimals: this.txFromJSON<ReturnType<typeof this.parsers['decimals']>>,
        name: this.txFromJSON<ReturnType<typeof this.parsers['name']>>,
        symbol: this.txFromJSON<ReturnType<typeof this.parsers['symbol']>>
    }
        /**
    * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    initialize = async ({admin, decimal, name, symbol}: {admin: string, decimal: u32, name: string, symbol: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", {admin: new Address(admin), decimal, name, symbol}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['initialize'],
        });
    }


        /**
    * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
    * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setAdmin = async ({new_admin}: {new_admin: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_admin',
            args: this.spec.funcArgsToScVals("set_admin", {new_admin: new Address(new_admin)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setAdmin'],
        });
    }


        /**
    * Construct and simulate a allowance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
    * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
    * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
    * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
    * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
    * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    burn = async ({from, amount}: {from: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'burn',
            args: this.spec.funcArgsToScVals("burn", {from: new Address(from), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['burn'],
        });
    }


        /**
    * Construct and simulate a burn_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    burnFrom = async ({spender, from, amount}: {spender: string, from: string, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'burn_from',
            args: this.spec.funcArgsToScVals("burn_from", {spender: new Address(spender), from: new Address(from), amount}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['burnFrom'],
        });
    }


        /**
    * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
    * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
    * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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

}
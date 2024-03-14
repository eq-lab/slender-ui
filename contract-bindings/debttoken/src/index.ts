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
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CBELMBMWNFUQATXKIAXZCEVBLMIKHWUZJGDG4FUA62L6KPG6MIMCRN53",
    }
} as const

/**
    
    */
export type CommonDataKey = {tag: "Balance", values: readonly [string]} | {tag: "State", values: readonly [string]} | {tag: "Pool", values: void} | {tag: "TotalSupply", values: void};

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
            "AAAAAAAAAZ9Jbml0aWFsaXplcyB0aGUgRGVidCB0b2tlbiBjb250cmFjdC4KCiMgQXJndW1lbnRzCgotIG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgdG9rZW4uCi0gc3ltYm9sIC0gVGhlIHN5bWJvbCBvZiB0aGUgdG9rZW4uCi0gcG9vbCAtIFRoZSBhZGRyZXNzIG9mIHRoZSBwb29sIGNvbnRyYWN0LgotIHVuZGVybHlpbmdfYXNzZXQgLSBUaGUgYWRkcmVzcyBvZiB0aGUgdW5kZXJseWluZyBhc3NldCBhc3NvY2lhdGVkIHdpdGggdGhlIHRva2VuLgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgc3BlY2lmaWVkIGRlY2ltYWwgdmFsdWUgZXhjZWVkcyB0aGUgbWF4aW11bSB2YWx1ZSBvZiB1OC4KUGFuaWNzIGlmIHRoZSBjb250cmFjdCBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkLgpQYW5pY3MgaWYgbmFtZSBvciBzeW1ib2wgaXMgZW1wdHkKAAAAAAppbml0aWFsaXplAAAAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQAAAAAAAAAARwb29sAAAAEwAAAAAAAAAQdW5kZXJseWluZ19hc3NldAAAABMAAAAA",
        "AAAAAAAAAM5VcGdyYWRlcyB0aGUgZGVwbG95ZWQgY29udHJhY3Qgd2FzbSBwcmVzZXJ2aW5nIHRoZSBjb250cmFjdCBpZC4KCiMgQXJndW1lbnRzCgotIG5ld193YXNtX2hhc2ggLSBUaGUgbmV3IHZlcnNpb24gb2YgdGhlIFdBU00gaGFzaC4KCiMgUGFuaWNzCgpQYW5pY3MgaWYgdGhlIGNhbGxlciBpcyBub3QgdGhlIHBvb2wgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdG9rZW4uCgAAAAAAB3VwZ3JhZGUAAAAAAQAAAAAAAAANbmV3X3dhc21faGFzaAAAAAAAA+4AAAAgAAAAAA==",
        "AAAAAAAAACxSZXR1cm5zIHRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGNvbnRyYWN0LgAAAAd2ZXJzaW9uAAAAAAAAAAABAAAABA==",
        "AAAAAAAAAJ9SZXR1cm5zIHRoZSBiYWxhbmNlIG9mIHRva2VucyBmb3IgYSBzcGVjaWZpZWQgYGlkYC4KCiMgQXJndW1lbnRzCgotIGlkIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGFjY291bnQuCgojIFJldHVybnMKClRoZSBiYWxhbmNlIG9mIHRva2VucyBmb3IgdGhlIHNwZWNpZmllZCBgaWRgLgoAAAAAB2JhbGFuY2UAAAAAAQAAAAAAAAACaWQAAAAAABMAAAABAAAACw==",
        "AAAAAAAAAJcKIyBBcmd1bWVudHMKCi0gaWQgLSBUaGUgYWRkcmVzcyBvZiB0aGUgYWNjb3VudC4KCiMgUmV0dXJucwoKVGhlIHNwZW5kYWJsZSBiYWxhbmNlIG9mIHRva2VucyBmb3IgdGhlIHNwZWNpZmllZCBpZC4KCkN1cnJlbnRseSB0aGUgc2FtZSBhcyBgYmFsYW5jZShpZClgAAAAABFzcGVuZGFibGVfYmFsYW5jZQAAAAAAAAEAAAAAAAAAAmlkAAAAAAATAAAAAQAAAAs=",
        "AAAAAAAAALVDaGVja3Mgd2hldGhlciBhIHNwZWNpZmllZCBgaWRgIGlzIGF1dGhvcml6ZWQuCgojIEFyZ3VtZW50cwoKLSBpZCAtIFRoZSBhZGRyZXNzIHRvIGNoZWNrIGZvciBhdXRob3JpemF0aW9uLgoKIyBSZXR1cm5zCgpSZXR1cm5zIHRydWUgaWYgdGhlIGlkIGlzIGF1dGhvcml6ZWQsIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlAAAAAAAACmF1dGhvcml6ZWQAAAAAAAEAAAAAAAAAAmlkAAAAAAATAAAAAQAAAAE=",
        "AAAAAAAAAThCdXJucyBhIHNwZWNpZmllZCBhbW91bnQgb2YgdG9rZW5zIGZyb20gdGhlIGZyb20gYWNjb3VudC4KCiMgQXJndW1lbnRzCgotIGZyb20gLSBUaGUgYWRkcmVzcyBvZiB0aGUgdG9rZW4gaG9sZGVyIHRvIGJ1cm4gdG9rZW5zIGZyb20uCi0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiB0b2tlbnMgdG8gYnVybi4KCiMgUGFuaWNzCgpQYW5pY3MgaWYgdGhlIGFtb3VudCBpcyBuZWdhdGl2ZS4KUGFuaWNzIGlmIHRoZSBjYWxsZXIgaXMgbm90IHRoZSBwb29sIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHRva2VuLgpQYW5pY3MgaWYgb3ZlcmZsb3cgaGFwcGVucwoAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAIX3NwZW5kZXIAAAATAAAAAAAAAAVfZnJvbQAAAAAAABMAAAAAAAAAB19hbW91bnQAAAAACwAAAAA=",
        "AAAAAAAAASpTZXRzIHRoZSBhdXRob3JpemF0aW9uIHN0YXR1cyBmb3IgYSBzcGVjaWZpZWQgYGlkYC4KCiMgQXJndW1lbnRzCgotIGlkIC0gVGhlIGFkZHJlc3MgdG8gc2V0IHRoZSBhdXRob3JpemF0aW9uIHN0YXR1cyBmb3IuCi0gYXV0aG9yaXplIC0gQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0byBhdXRob3JpemUgKHRydWUpIG9yIGRlYXV0aG9yaXplIChmYWxzZSkgdGhlIGlkLgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgY2FsbGVyIGlzIG5vdCB0aGUgcG9vbCBhc3NvY2lhdGVkIHdpdGggdGhpcyB0b2tlbi4KAAAAAAAOc2V0X2F1dGhvcml6ZWQAAAAAAAIAAAAAAAAAAmlkAAAAAAATAAAAAAAAAAlhdXRob3JpemUAAAAAAAABAAAAAA==",
        "AAAAAAAAAQ1NaW50cyBhIHNwZWNpZmllZCBhbW91bnQgb2YgdG9rZW5zIGZvciBhIGdpdmVuIGBpZGAuCgojIEFyZ3VtZW50cwoKLSBpZCAtIFRoZSBhZGRyZXNzIG9mIHRoZSB1c2VyIHRvIG1pbnQgdG9rZW5zIGZvci4KLSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBtaW50LgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgYW1vdW50IGlzIG5lZ2F0aXZlLgpQYW5pY3MgaWYgdGhlIGNhbGxlciBpcyBub3QgdGhlIHBvb2wgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdG9rZW4uCgAAAAAAAARtaW50AAAAAgAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAURDbGF3YmFja3MgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRva2VucyBmcm9tIHRoZSBmcm9tIGFjY291bnQuCgojIEFyZ3VtZW50cwoKLSBmcm9tIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHRva2VuIGhvbGRlciB0byBjbGF3YmFjayB0b2tlbnMgZnJvbS4KLSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBjbGF3YmFjay4KCiMgUGFuaWNzCgpQYW5pY3MgaWYgdGhlIGFtb3VudCBpcyBuZWdhdGl2ZS4KUGFuaWNzIGlmIHRoZSBjYWxsZXIgaXMgbm90IHRoZSBwb29sIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHRva2VuLgpQYW5pY3MgaWYgb3ZlcmZsb3cgaGFwcGVucwoAAAAIY2xhd2JhY2sAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAFBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgdXNlZCBieSB0aGUgdG9rZW4uCgojIFJldHVybnMKClRoZSBudW1iZXIgbwAAAAhkZWNpbWFscwAAAAAAAAABAAAABA==",
        "AAAAAAAAAGJSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSB0b2tlbi4KCiMgUmV0dXJucwoKVGhlIG5hbWUgb2YgdGhlIHRva2VuIGFzIGEgYHNvcm9iYW5fc2RrOjpCeXRlc2AgdmFsdWUuCgAAAAAABG5hbWUAAAAAAAAAAQAAABA=",
        "AAAAAAAAAGZSZXR1cm5zIHRoZSBzeW1ib2wgb2YgdGhlIHRva2VuLgoKIyBSZXR1cm5zCgpUaGUgc3ltYm9sIG9mIHRoZSB0b2tlbiBhcyBhIGBzb3JvYmFuX3Nkazo6Qnl0ZXNgIHZhbHVlLgoAAAAAAAZzeW1ib2wAAAAAAAAAAAABAAAAEA==",
        "AAAAAAAAAExSZXR1cm5zIHRoZSB0b3RhbCBzdXBwbHkgb2YgdG9rZW5zLgoKIyBSZXR1cm5zCgpUaGUgdG90YWwgc3VwcGx5IG9mIHRva2Vucy4KAAAADHRvdGFsX3N1cHBseQAAAAAAAAABAAAACw==",
        "AAAAAgAAAAAAAAAAAAAADUNvbW1vbkRhdGFLZXkAAAAAAAAEAAAAAQAAAAAAAAAHQmFsYW5jZQAAAAABAAAAEwAAAAEAAAAAAAAABVN0YXRlAAAAAAAAAQAAABMAAAAAAAAAAAAAAARQb29sAAAAAAAAAAAAAAALVG90YWxTdXBwbHkA",
        "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA="
        ]);
    }
    private readonly parsers = {
        initialize: () => {},
        upgrade: () => {},
        version: (result: XDR_BASE64): u32 => this.spec.funcResToNative("version", result),
        balance: (result: XDR_BASE64): i128 => this.spec.funcResToNative("balance", result),
        spendableBalance: (result: XDR_BASE64): i128 => this.spec.funcResToNative("spendable_balance", result),
        authorized: (result: XDR_BASE64): boolean => this.spec.funcResToNative("authorized", result),
        burn: () => {},
        burnFrom: () => {},
        setAuthorized: () => {},
        mint: () => {},
        clawback: () => {},
        decimals: (result: XDR_BASE64): u32 => this.spec.funcResToNative("decimals", result),
        name: (result: XDR_BASE64): string => this.spec.funcResToNative("name", result),
        symbol: (result: XDR_BASE64): string => this.spec.funcResToNative("symbol", result),
        totalSupply: (result: XDR_BASE64): i128 => this.spec.funcResToNative("total_supply", result)
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
        balance: this.txFromJSON<ReturnType<typeof this.parsers['balance']>>,
        spendableBalance: this.txFromJSON<ReturnType<typeof this.parsers['spendableBalance']>>,
        authorized: this.txFromJSON<ReturnType<typeof this.parsers['authorized']>>,
        burn: this.txFromJSON<ReturnType<typeof this.parsers['burn']>>,
        burnFrom: this.txFromJSON<ReturnType<typeof this.parsers['burnFrom']>>,
        setAuthorized: this.txFromJSON<ReturnType<typeof this.parsers['setAuthorized']>>,
        mint: this.txFromJSON<ReturnType<typeof this.parsers['mint']>>,
        clawback: this.txFromJSON<ReturnType<typeof this.parsers['clawback']>>,
        decimals: this.txFromJSON<ReturnType<typeof this.parsers['decimals']>>,
        name: this.txFromJSON<ReturnType<typeof this.parsers['name']>>,
        symbol: this.txFromJSON<ReturnType<typeof this.parsers['symbol']>>,
        totalSupply: this.txFromJSON<ReturnType<typeof this.parsers['totalSupply']>>
    }
        /**
    * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Initializes the Debt token contract.
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
    * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Upgrades the deployed contract wasm preserving the contract id.
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
    * Construct and simulate a version transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Returns the current version of the contract.
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
    * Construct and simulate a spendable_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
    * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Burns a specified amount of tokens from the from account.
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
    * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Mints a specified amount of tokens for a given `id`.
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
    * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.Returns the number of decimal places used by the token.
    * 
    * # Returns
    * 
    * The number o
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

}
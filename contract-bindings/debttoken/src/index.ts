import * as SorobanClient from 'soroban-client';
import { ContractSpec, Address } from 'soroban-client';
import { Buffer } from "buffer";
import { invoke } from './invoke.js';
import type { ResponseTypes, Wallet, ClassOptions } from './method-options.js'

export * from './invoke.js'
export * from './method-options.js'

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
export {Address};

/// Error interface containing the error message
export interface Error_ { message: string };

export interface Result<T, E extends Error_> {
    unwrap(): T,
    unwrapErr(): E,
    isOk(): boolean,
    isErr(): boolean,
};

export class Ok<T, E extends Error_ = Error_> implements Result<T, E> {
    constructor(readonly value: T) { }
    unwrapErr(): E {
        throw new Error('No error');
    }
    unwrap(): T {
        return this.value;
    }

    isOk(): boolean {
        return true;
    }

    isErr(): boolean {
        return !this.isOk()
    }
}

export class Err<E extends Error_ = Error_> implements Result<any, E> {
    constructor(readonly error: E) { }
    unwrapErr(): E {
        return this.error;
    }
    unwrap(): never {
        throw new Error(this.error.message);
    }

    isOk(): boolean {
        return false;
    }

    isErr(): boolean {
        return !this.isOk()
    }
}

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}

const regex = /Error\(Contract, #(\d+)\)/;

function parseError(message: string): Err | undefined {
    const match = message.match(regex);
    if (!match) {
        return undefined;
    }
    if (Errors === undefined) {
        return undefined;
    }
    let i = parseInt(match[1], 10);
    let err = Errors[i];
    if (err) {
        return new Err(err);
    }
    return undefined;
}

export const networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "",
    }
} as const

export type CommonDataKey = {tag: "Balance", values: readonly [Address]} | {tag: "State", values: readonly [Address]} | {tag: "Pool", values: void} | {tag: "TotalSupply", values: void};

export interface TokenMetadata {
  decimal: u32;
  name: string;
  symbol: string;
}

const Errors = {

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
async initialize<R extends ResponseTypes = undefined>({name, symbol, pool, underlying_asset}: {name: string, symbol: string, pool: Address, underlying_asset: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", {name, symbol, pool, underlying_asset}),
            ...options,
            ...this.options,
            parseResultXdr: () => {},
        });
    }


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
async upgrade<R extends ResponseTypes = undefined>({new_wasm_hash}: {new_wasm_hash: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'upgrade',
            args: this.spec.funcArgsToScVals("upgrade", {new_wasm_hash}),
            ...options,
            ...this.options,
            parseResultXdr: () => {},
        });
    }


    /**
 * Returns the current version of the contract.
 */
async version<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `u32`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'version',
            args: this.spec.funcArgsToScVals("version", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): u32 => {
                return this.spec.funcResToNative("version", xdr);
            },
        });
    }


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
async balance<R extends ResponseTypes = undefined>({id}: {id: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'balance',
            args: this.spec.funcArgsToScVals("balance", {id}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): i128 => {
                return this.spec.funcResToNative("balance", xdr);
            },
        });
    }


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
async spendableBalance<R extends ResponseTypes = undefined>({id}: {id: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'spendable_balance',
            args: this.spec.funcArgsToScVals("spendable_balance", {id}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): i128 => {
                return this.spec.funcResToNative("spendable_balance", xdr);
            },
        });
    }


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
async authorized<R extends ResponseTypes = undefined>({id}: {id: Address}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `boolean`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'authorized',
            args: this.spec.funcArgsToScVals("authorized", {id}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): boolean => {
                return this.spec.funcResToNative("authorized", xdr);
            },
        });
    }


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
async burn<R extends ResponseTypes = undefined>({from, amount}: {from: Address, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'burn',
            args: this.spec.funcArgsToScVals("burn", {from, amount}),
            ...options,
            ...this.options,
            parseResultXdr: () => {},
        });
    }


    async burnFrom<R extends ResponseTypes = undefined>({_spender, _from, _amount}: {_spender: Address, _from: Address, _amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'burn_from',
            args: this.spec.funcArgsToScVals("burn_from", {_spender, _from, _amount}),
            ...options,
            ...this.options,
            parseResultXdr: () => {},
        });
    }


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
async setAuthorized<R extends ResponseTypes = undefined>({id, authorize}: {id: Address, authorize: boolean}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'set_authorized',
            args: this.spec.funcArgsToScVals("set_authorized", {id, authorize}),
            ...options,
            ...this.options,
            parseResultXdr: () => {},
        });
    }


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
async mint<R extends ResponseTypes = undefined>({to, amount}: {to: Address, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'mint',
            args: this.spec.funcArgsToScVals("mint", {to, amount}),
            ...options,
            ...this.options,
            parseResultXdr: () => {},
        });
    }


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
async clawback<R extends ResponseTypes = undefined>({from, amount}: {from: Address, amount: i128}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'clawback',
            args: this.spec.funcArgsToScVals("clawback", {from, amount}),
            ...options,
            ...this.options,
            parseResultXdr: () => {},
        });
    }


    /**
 * Returns the number of decimal places used by the token.
 * 
 * # Returns
 * 
 * The number o
 */
async decimals<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `u32`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'decimals',
            args: this.spec.funcArgsToScVals("decimals", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): u32 => {
                return this.spec.funcResToNative("decimals", xdr);
            },
        });
    }


    /**
 * Returns the name of the token.
 * 
 * # Returns
 * 
 * The name of the token as a `soroban_sdk::Bytes` value.
 * 
 */
async name<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `string`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'name',
            args: this.spec.funcArgsToScVals("name", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): string => {
                return this.spec.funcResToNative("name", xdr);
            },
        });
    }


    /**
 * Returns the symbol of the token.
 * 
 * # Returns
 * 
 * The symbol of the token as a `soroban_sdk::Bytes` value.
 * 
 */
async symbol<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `string`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'symbol',
            args: this.spec.funcArgsToScVals("symbol", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): string => {
                return this.spec.funcResToNative("symbol", xdr);
            },
        });
    }


    /**
 * Returns the total supply of tokens.
 * 
 * # Returns
 * 
 * The total supply of tokens.
 * 
 */
async totalSupply<R extends ResponseTypes = undefined>(options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number
        /**
         * What type of response to return.
         *
         *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
         *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
         *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
         */
        responseType?: R
        /**
         * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
         */
        secondsToWait?: number
    } = {}) {
                    return await invoke({
            method: 'total_supply',
            args: this.spec.funcArgsToScVals("total_supply", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr): i128 => {
                return this.spec.funcResToNative("total_supply", xdr);
            },
        });
    }

}
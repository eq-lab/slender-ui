"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.networks = exports.Err = exports.Ok = exports.Address = void 0;
const soroban_client_1 = require("soroban-client");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return soroban_client_1.Address; } });
const buffer_1 = require("buffer");
const invoke_js_1 = require("./invoke.js");
__exportStar(require("./invoke.js"), exports);
__exportStar(require("./method-options.js"), exports);
;
;
class Ok {
    value;
    constructor(value) {
        this.value = value;
    }
    unwrapErr() {
        throw new Error('No error');
    }
    unwrap() {
        return this.value;
    }
    isOk() {
        return true;
    }
    isErr() {
        return !this.isOk();
    }
}
exports.Ok = Ok;
class Err {
    error;
    constructor(error) {
        this.error = error;
    }
    unwrapErr() {
        return this.error;
    }
    unwrap() {
        throw new Error(this.error.message);
    }
    isOk() {
        return false;
    }
    isErr() {
        return !this.isOk();
    }
}
exports.Err = Err;
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || buffer_1.Buffer;
}
const regex = /Error\(Contract, #(\d+)\)/;
function parseError(message) {
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
exports.networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "",
    }
};
const Errors = {};
class Contract {
    options;
    spec;
    constructor(options) {
        this.options = options;
        this.spec = new soroban_client_1.ContractSpec([
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
    async initialize({ name, symbol, pool, underlying_asset }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", { name, symbol, pool, underlying_asset }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
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
    async upgrade({ new_wasm_hash }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'upgrade',
            args: this.spec.funcArgsToScVals("upgrade", { new_wasm_hash }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    /**
 * Returns the current version of the contract.
 */
    async version(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'version',
            args: this.spec.funcArgsToScVals("version", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
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
    async balance({ id }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'balance',
            args: this.spec.funcArgsToScVals("balance", { id }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
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
    async spendableBalance({ id }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'spendable_balance',
            args: this.spec.funcArgsToScVals("spendable_balance", { id }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
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
    async authorized({ id }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'authorized',
            args: this.spec.funcArgsToScVals("authorized", { id }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
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
    async burn({ from, amount }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'burn',
            args: this.spec.funcArgsToScVals("burn", { from, amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async burnFrom({ _spender, _from, _amount }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'burn_from',
            args: this.spec.funcArgsToScVals("burn_from", { _spender, _from, _amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
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
    async setAuthorized({ id, authorize }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'set_authorized',
            args: this.spec.funcArgsToScVals("set_authorized", { id, authorize }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
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
    async mint({ to, amount }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'mint',
            args: this.spec.funcArgsToScVals("mint", { to, amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
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
    async clawback({ from, amount }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'clawback',
            args: this.spec.funcArgsToScVals("clawback", { from, amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    /**
 * Returns the number of decimal places used by the token.
 *
 * # Returns
 *
 * The number o
 */
    async decimals(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'decimals',
            args: this.spec.funcArgsToScVals("decimals", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
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
    async name(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'name',
            args: this.spec.funcArgsToScVals("name", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
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
    async symbol(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'symbol',
            args: this.spec.funcArgsToScVals("symbol", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
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
    async totalSupply(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'total_supply',
            args: this.spec.funcArgsToScVals("total_supply", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("total_supply", xdr);
            },
        });
    }
}
exports.Contract = Contract;

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
exports.total_supply = exports.symbol = exports.name = exports.decimals = exports.clawback = exports.mint = exports.set_authorized = exports.burn_from = exports.burn = exports.authorized = exports.spendable_balance = exports.balance = exports.version = exports.upgrade = exports.initialize = exports.Err = exports.Ok = void 0;
const soroban_client_1 = require("soroban-client");
const buffer_1 = require("buffer");
const convert_js_1 = require("./convert.js");
const invoke_js_1 = require("./invoke.js");
__exportStar(require("./constants.js"), exports);
__exportStar(require("./server.js"), exports);
__exportStar(require("./invoke.js"), exports);
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
const regex = /ContractError\((\d+)\)/;
function getError(err) {
    const match = err.match(regex);
    if (!match) {
        return undefined;
    }
    if (Errors == undefined) {
        return undefined;
    }
    // @ts-ignore
    let i = parseInt(match[1], 10);
    if (i < Errors.length) {
        return new Err(Errors[i]);
    }
    return undefined;
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
async function initialize({ name, symbol, pool, underlying_asset }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'initialize',
        args: [((i) => soroban_client_1.xdr.ScVal.scvString(i))(name),
            ((i) => soroban_client_1.xdr.ScVal.scvString(i))(symbol),
            ((i) => (0, convert_js_1.addressToScVal)(i))(pool),
            ((i) => (0, convert_js_1.addressToScVal)(i))(underlying_asset)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.initialize = initialize;
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
async function upgrade({ new_wasm_hash }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'upgrade',
        args: [((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(new_wasm_hash)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.upgrade = upgrade;
/**
 * Returns the current version of the contract.
 */
async function version({ signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'version',
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.version = version;
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
async function balance({ id }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'balance',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(id)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.balance = balance;
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
async function spendable_balance({ id }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'spendable_balance',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(id)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.spendable_balance = spendable_balance;
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
async function authorized({ id }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'authorized',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(id)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.authorized = authorized;
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
async function burn({ from, amount }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'burn',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.burn = burn;
async function burn_from({ _spender, _from, _amount }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'burn_from',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(_spender),
            ((i) => (0, convert_js_1.addressToScVal)(i))(_from),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(_amount)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.burn_from = burn_from;
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
async function set_authorized({ id, authorize }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'set_authorized',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(id),
            ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(authorize)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.set_authorized = set_authorized;
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
async function mint({ to, amount }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'mint',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.mint = mint;
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
async function clawback({ from, amount }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'clawback',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.clawback = clawback;
/**
 * Returns the number of decimal places used by the token.
 *
 * # Returns
 *
 * The number o
 */
async function decimals({ signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'decimals',
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.decimals = decimals;
/**
 * Returns the name of the token.
 *
 * # Returns
 *
 * The name of the token as a `soroban_sdk::Bytes` value.
 *
 */
async function name({ signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'name',
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.name = name;
/**
 * Returns the symbol of the token.
 *
 * # Returns
 *
 * The symbol of the token as a `soroban_sdk::Bytes` value.
 *
 */
async function symbol({ signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'symbol',
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.symbol = symbol;
/**
 * Returns the total supply of tokens.
 *
 * # Returns
 *
 * The total supply of tokens.
 *
 */
async function total_supply({ signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'total_supply',
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.total_supply = total_supply;
function CommonDataKeyToXdr(commonDataKey) {
    if (!commonDataKey) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (commonDataKey.tag) {
        case "Balance":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Balance"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(commonDataKey.values[0]));
            break;
        case "State":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("State"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(commonDataKey.values[0]));
            break;
        case "Pool":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Pool"));
            break;
        case "TotalSupply":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("TotalSupply"));
            break;
    }
    return soroban_client_1.xdr.ScVal.scvVec(res);
}
function CommonDataKeyFromXdr(base64Xdr) {
    let [tag, values] = (0, convert_js_1.strToScVal)(base64Xdr).vec().map(convert_js_1.scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding CommonDataKey from XDR');
    }
    return { tag, values };
}
function TokenMetadataToXdr(tokenMetadata) {
    if (!tokenMetadata) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("decimal"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(tokenMetadata["decimal"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("name"), val: ((i) => soroban_client_1.xdr.ScVal.scvString(i))(tokenMetadata["name"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("symbol"), val: ((i) => soroban_client_1.xdr.ScVal.scvString(i))(tokenMetadata["symbol"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function TokenMetadataFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        decimal: (0, convert_js_1.scValToJs)(map.get("decimal")),
        name: (0, convert_js_1.scValToJs)(map.get("name")),
        symbol: (0, convert_js_1.scValToJs)(map.get("symbol"))
    };
}
const Errors = [];

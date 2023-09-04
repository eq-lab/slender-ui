import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValStrToJs, scValToJs, addressToScVal, i128ToScVal, strToScVal } from './convert.js';
import { invoke } from './invoke.js';
export * from './constants.js';
export * from './server.js';
export * from './invoke.js';
;
;
export class Ok {
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
export class Err {
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
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
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
export async function initialize({ name, symbol, pool, underlying_asset }, options = {}) {
    return await invoke({
        method: 'initialize',
        args: [((i) => xdr.ScVal.scvString(i))(name),
            ((i) => xdr.ScVal.scvString(i))(symbol),
            ((i) => addressToScVal(i))(pool),
            ((i) => addressToScVal(i))(underlying_asset)],
        ...options,
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
export async function upgrade({ new_wasm_hash }, options = {}) {
    return await invoke({
        method: 'upgrade',
        args: [((i) => xdr.ScVal.scvBytes(i))(new_wasm_hash)],
        ...options,
        parseResultXdr: () => { },
    });
}
/**
 * Returns the current version of the contract.
 */
export async function version(options = {}) {
    return await invoke({
        method: 'version',
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
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
export async function balance({ id }, options = {}) {
    return await invoke({
        method: 'balance',
        args: [((i) => addressToScVal(i))(id)],
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
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
export async function spendableBalance({ id }, options = {}) {
    return await invoke({
        method: 'spendable_balance',
        args: [((i) => addressToScVal(i))(id)],
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
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
export async function authorized({ id }, options = {}) {
    return await invoke({
        method: 'authorized',
        args: [((i) => addressToScVal(i))(id)],
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
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
export async function burn({ from, amount }, options = {}) {
    return await invoke({
        method: 'burn',
        args: [((i) => addressToScVal(i))(from),
            ((i) => i128ToScVal(i))(amount)],
        ...options,
        parseResultXdr: () => { },
    });
}
export async function burnFrom({ _spender, _from, _amount }, options = {}) {
    return await invoke({
        method: 'burn_from',
        args: [((i) => addressToScVal(i))(_spender),
            ((i) => addressToScVal(i))(_from),
            ((i) => i128ToScVal(i))(_amount)],
        ...options,
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
export async function setAuthorized({ id, authorize }, options = {}) {
    return await invoke({
        method: 'set_authorized',
        args: [((i) => addressToScVal(i))(id),
            ((i) => xdr.ScVal.scvBool(i))(authorize)],
        ...options,
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
export async function mint({ to, amount }, options = {}) {
    return await invoke({
        method: 'mint',
        args: [((i) => addressToScVal(i))(to),
            ((i) => i128ToScVal(i))(amount)],
        ...options,
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
export async function clawback({ from, amount }, options = {}) {
    return await invoke({
        method: 'clawback',
        args: [((i) => addressToScVal(i))(from),
            ((i) => i128ToScVal(i))(amount)],
        ...options,
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
export async function decimals(options = {}) {
    return await invoke({
        method: 'decimals',
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
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
export async function name(options = {}) {
    return await invoke({
        method: 'name',
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
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
export async function symbol(options = {}) {
    return await invoke({
        method: 'symbol',
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
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
export async function totalSupply(options = {}) {
    return await invoke({
        method: 'total_supply',
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
function CommonDataKeyToXdr(commonDataKey) {
    if (!commonDataKey) {
        return xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (commonDataKey.tag) {
        case "Balance":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Balance"));
            res.push(((i) => addressToScVal(i))(commonDataKey.values[0]));
            break;
        case "State":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("State"));
            res.push(((i) => addressToScVal(i))(commonDataKey.values[0]));
            break;
        case "Pool":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Pool"));
            break;
        case "TotalSupply":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("TotalSupply"));
            break;
    }
    return xdr.ScVal.scvVec(res);
}
function CommonDataKeyFromXdr(base64Xdr) {
    let [tag, values] = strToScVal(base64Xdr).vec().map(scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding CommonDataKey from XDR');
    }
    return { tag, values };
}
function TokenMetadataToXdr(tokenMetadata) {
    if (!tokenMetadata) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("decimal"), val: ((i) => xdr.ScVal.scvU32(i))(tokenMetadata["decimal"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("name"), val: ((i) => xdr.ScVal.scvString(i))(tokenMetadata["name"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("symbol"), val: ((i) => xdr.ScVal.scvString(i))(tokenMetadata["symbol"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function TokenMetadataFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        decimal: scValToJs(map.get("decimal")),
        name: scValToJs(map.get("name")),
        symbol: scValToJs(map.get("symbol"))
    };
}
const Errors = [];

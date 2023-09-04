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
exports.pool = exports.underlying_asset = exports.transfer_underlying_to = exports.transfer_on_liquidation = exports.total_supply = exports.symbol = exports.name = exports.decimals = exports.burn = exports.mint = exports.set_authorized = exports.clawback = exports.burn_from = exports.transfer_from = exports.transfer = exports.authorized = exports.spendable_balance = exports.balance = exports.approve = exports.allowance = exports.version = exports.upgrade = exports.initialize = exports.Err = exports.Ok = void 0;
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
function AllowanceValueToXdr(allowanceValue) {
    if (!allowanceValue) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("amount"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(allowanceValue["amount"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("expiration_ledger"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(allowanceValue["expiration_ledger"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function AllowanceValueFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        amount: (0, convert_js_1.scValToJs)(map.get("amount")),
        expiration_ledger: (0, convert_js_1.scValToJs)(map.get("expiration_ledger"))
    };
}
function AllowanceDataKeyToXdr(allowanceDataKey) {
    if (!allowanceDataKey) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("from"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(allowanceDataKey["from"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("spender"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(allowanceDataKey["spender"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function AllowanceDataKeyFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        from: (0, convert_js_1.scValToJs)(map.get("from")),
        spender: (0, convert_js_1.scValToJs)(map.get("spender"))
    };
}
function DataKeyToXdr(dataKey) {
    if (!dataKey) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (dataKey.tag) {
        case "Allowance":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Allowance"));
            res.push(((i) => AllowanceDataKeyToXdr(i))(dataKey.values[0]));
            break;
        case "UnderlyingAsset":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("UnderlyingAsset"));
            break;
    }
    return soroban_client_1.xdr.ScVal.scvVec(res);
}
function DataKeyFromXdr(base64Xdr) {
    let [tag, values] = (0, convert_js_1.strToScVal)(base64Xdr).vec().map(convert_js_1.scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding DataKey from XDR');
    }
    return { tag, values };
}
/**
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
async function allowance({ from, spender }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'allowance',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.addressToScVal)(i))(spender)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.allowance = allowance;
/**
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
async function approve({ from, spender, amount, expiration_ledger }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'approve',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.addressToScVal)(i))(spender),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount),
            ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(expiration_ledger)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.approve = approve;
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
async function transfer({ from, to, amount }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'transfer',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.transfer = transfer;
/**
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
async function transfer_from({ spender, from, to, amount }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'transfer_from',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(spender),
            ((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.transfer_from = transfer_from;
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
async function burn({ from, amount_to_burn, amount_to_withdraw, to }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'burn',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount_to_burn),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount_to_withdraw),
            ((i) => (0, convert_js_1.addressToScVal)(i))(to)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.burn = burn;
/**
 * Returns the number of decimal places used by the token.
 *
 * # Returns
 *
 * The number of decimal places used by the token.
 *
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
/**
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
async function transfer_on_liquidation({ from, to, amount }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'transfer_on_liquidation',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.transfer_on_liquidation = transfer_on_liquidation;
/**
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
async function transfer_underlying_to({ to, amount }, { signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'transfer_underlying_to',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount)],
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return;
}
exports.transfer_underlying_to = transfer_underlying_to;
/**
 * Retrieves the address of the underlying asset.
 *
 * # Returns
 *
 * The address of the underlying asset.
 *
 */
async function underlying_asset({ signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'underlying_asset',
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.underlying_asset = underlying_asset;
/**
 * Retrieves the address of the pool.
 *
 * # Returns
 *
 * The address of the associated pool.
 *
 */
async function pool({ signAndSend, fee } = { signAndSend: false, fee: 100 }) {
    let invokeArgs = {
        signAndSend,
        fee,
        method: 'pool',
    };
    // @ts-ignore Type does exist
    const response = await (0, invoke_js_1.invoke)(invokeArgs);
    return (0, convert_js_1.scValStrToJs)(response.xdr);
}
exports.pool = pool;
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
function ReserveConfigurationToXdr(reserveConfiguration) {
    if (!reserveConfiguration) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("borrowing_enabled"), val: ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(reserveConfiguration["borrowing_enabled"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("decimals"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(reserveConfiguration["decimals"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("discount"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(reserveConfiguration["discount"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("is_active"), val: ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(reserveConfiguration["is_active"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("liq_bonus"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(reserveConfiguration["liq_bonus"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("liq_cap"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(reserveConfiguration["liq_cap"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("util_cap"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(reserveConfiguration["util_cap"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function ReserveConfigurationFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        borrowing_enabled: (0, convert_js_1.scValToJs)(map.get("borrowing_enabled")),
        decimals: (0, convert_js_1.scValToJs)(map.get("decimals")),
        discount: (0, convert_js_1.scValToJs)(map.get("discount")),
        is_active: (0, convert_js_1.scValToJs)(map.get("is_active")),
        liq_bonus: (0, convert_js_1.scValToJs)(map.get("liq_bonus")),
        liq_cap: (0, convert_js_1.scValToJs)(map.get("liq_cap")),
        util_cap: (0, convert_js_1.scValToJs)(map.get("util_cap"))
    };
}
function IRParamsToXdr(irParams) {
    if (!irParams) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("alpha"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(irParams["alpha"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("initial_rate"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(irParams["initial_rate"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("max_rate"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(irParams["max_rate"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("scaling_coeff"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(irParams["scaling_coeff"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function IRParamsFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        alpha: (0, convert_js_1.scValToJs)(map.get("alpha")),
        initial_rate: (0, convert_js_1.scValToJs)(map.get("initial_rate")),
        max_rate: (0, convert_js_1.scValToJs)(map.get("max_rate")),
        scaling_coeff: (0, convert_js_1.scValToJs)(map.get("scaling_coeff"))
    };
}
function ReserveDataToXdr(reserveData) {
    if (!reserveData) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("borrower_ar"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(reserveData["borrower_ar"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("borrower_ir"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(reserveData["borrower_ir"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("configuration"), val: ((i) => ReserveConfigurationToXdr(i))(reserveData["configuration"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("debt_token_address"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(reserveData["debt_token_address"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("id"), val: ((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(reserveData["id"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("last_update_timestamp"), val: ((i) => soroban_client_1.xdr.ScVal.scvU64(soroban_client_1.xdr.Uint64.fromString(i.toString())))(reserveData["last_update_timestamp"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("lender_ar"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(reserveData["lender_ar"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("lender_ir"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(reserveData["lender_ir"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("s_token_address"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(reserveData["s_token_address"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function ReserveDataFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        borrower_ar: (0, convert_js_1.scValToJs)(map.get("borrower_ar")),
        borrower_ir: (0, convert_js_1.scValToJs)(map.get("borrower_ir")),
        configuration: (0, convert_js_1.scValToJs)(map.get("configuration")),
        debt_token_address: (0, convert_js_1.scValToJs)(map.get("debt_token_address")),
        id: (0, convert_js_1.scValToJs)(map.get("id")),
        last_update_timestamp: (0, convert_js_1.scValToJs)(map.get("last_update_timestamp")),
        lender_ar: (0, convert_js_1.scValToJs)(map.get("lender_ar")),
        lender_ir: (0, convert_js_1.scValToJs)(map.get("lender_ir")),
        s_token_address: (0, convert_js_1.scValToJs)(map.get("s_token_address"))
    };
}
function InitReserveInputToXdr(initReserveInput) {
    if (!initReserveInput) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("debt_token_address"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(initReserveInput["debt_token_address"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("s_token_address"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(initReserveInput["s_token_address"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function InitReserveInputFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        debt_token_address: (0, convert_js_1.scValToJs)(map.get("debt_token_address")),
        s_token_address: (0, convert_js_1.scValToJs)(map.get("s_token_address"))
    };
}
function CollateralParamsInputToXdr(collateralParamsInput) {
    if (!collateralParamsInput) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("discount"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(collateralParamsInput["discount"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("liq_bonus"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(collateralParamsInput["liq_bonus"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("liq_cap"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(collateralParamsInput["liq_cap"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("util_cap"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(collateralParamsInput["util_cap"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function CollateralParamsInputFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        discount: (0, convert_js_1.scValToJs)(map.get("discount")),
        liq_bonus: (0, convert_js_1.scValToJs)(map.get("liq_bonus")),
        liq_cap: (0, convert_js_1.scValToJs)(map.get("liq_cap")),
        util_cap: (0, convert_js_1.scValToJs)(map.get("util_cap"))
    };
}
function UserConfigurationToXdr(userConfiguration) {
    if (!userConfiguration) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        (i => (0, convert_js_1.u128ToScVal)(i))(userConfiguration[0])
    ];
    return soroban_client_1.xdr.ScVal.scvVec(arr);
}
function UserConfigurationFromXdr(base64Xdr) {
    return (0, convert_js_1.scValStrToJs)(base64Xdr);
}
const Errors = [
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" }
];
function AccountPositionToXdr(accountPosition) {
    if (!accountPosition) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("debt"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(accountPosition["debt"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("discounted_collateral"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(accountPosition["discounted_collateral"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("npv"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(accountPosition["npv"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function AccountPositionFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        debt: (0, convert_js_1.scValToJs)(map.get("debt")),
        discounted_collateral: (0, convert_js_1.scValToJs)(map.get("discounted_collateral")),
        npv: (0, convert_js_1.scValToJs)(map.get("npv"))
    };
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

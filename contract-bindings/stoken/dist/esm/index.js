import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValStrToJs, scValToJs, addressToScVal, u128ToScVal, i128ToScVal, strToScVal } from './convert.js';
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
function AllowanceValueToXdr(allowanceValue) {
    if (!allowanceValue) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("amount"), val: ((i) => i128ToScVal(i))(allowanceValue["amount"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("expiration_ledger"), val: ((i) => xdr.ScVal.scvU32(i))(allowanceValue["expiration_ledger"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function AllowanceValueFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        amount: scValToJs(map.get("amount")),
        expiration_ledger: scValToJs(map.get("expiration_ledger"))
    };
}
function AllowanceDataKeyToXdr(allowanceDataKey) {
    if (!allowanceDataKey) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("from"), val: ((i) => addressToScVal(i))(allowanceDataKey["from"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("spender"), val: ((i) => addressToScVal(i))(allowanceDataKey["spender"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function AllowanceDataKeyFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        from: scValToJs(map.get("from")),
        spender: scValToJs(map.get("spender"))
    };
}
function DataKeyToXdr(dataKey) {
    if (!dataKey) {
        return xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (dataKey.tag) {
        case "Allowance":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Allowance"));
            res.push(((i) => AllowanceDataKeyToXdr(i))(dataKey.values[0]));
            break;
        case "UnderlyingAsset":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("UnderlyingAsset"));
            break;
    }
    return xdr.ScVal.scvVec(res);
}
function DataKeyFromXdr(base64Xdr) {
    let [tag, values] = strToScVal(base64Xdr).vec().map(scValToJs);
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
export async function upgrade({ new_wasm_hash }, options = {}) {
    return await invoke({
        method: 'upgrade',
        args: [((i) => xdr.ScVal.scvBytes(i))(new_wasm_hash)],
        ...options,
        parseResultXdr: () => { },
    });
}
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
export async function allowance({ from, spender }, options = {}) {
    return await invoke({
        method: 'allowance',
        args: [((i) => addressToScVal(i))(from),
            ((i) => addressToScVal(i))(spender)],
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
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
export async function approve({ from, spender, amount, expiration_ledger }, options = {}) {
    return await invoke({
        method: 'approve',
        args: [((i) => addressToScVal(i))(from),
            ((i) => addressToScVal(i))(spender),
            ((i) => i128ToScVal(i))(amount),
            ((i) => xdr.ScVal.scvU32(i))(expiration_ledger)],
        ...options,
        parseResultXdr: () => { },
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
export async function transfer({ from, to, amount }, options = {}) {
    return await invoke({
        method: 'transfer',
        args: [((i) => addressToScVal(i))(from),
            ((i) => addressToScVal(i))(to),
            ((i) => i128ToScVal(i))(amount)],
        ...options,
        parseResultXdr: () => { },
    });
}
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
export async function transferFrom({ spender, from, to, amount }, options = {}) {
    return await invoke({
        method: 'transfer_from',
        args: [((i) => addressToScVal(i))(spender),
            ((i) => addressToScVal(i))(from),
            ((i) => addressToScVal(i))(to),
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
export async function burn({ from, amount_to_burn, amount_to_withdraw, to }, options = {}) {
    return await invoke({
        method: 'burn',
        args: [((i) => addressToScVal(i))(from),
            ((i) => i128ToScVal(i))(amount_to_burn),
            ((i) => i128ToScVal(i))(amount_to_withdraw),
            ((i) => addressToScVal(i))(to)],
        ...options,
        parseResultXdr: () => { },
    });
}
/**
 * Returns the number of decimal places used by the token.
 *
 * # Returns
 *
 * The number of decimal places used by the token.
 *
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
export async function transferOnLiquidation({ from, to, amount }, options = {}) {
    return await invoke({
        method: 'transfer_on_liquidation',
        args: [((i) => addressToScVal(i))(from),
            ((i) => addressToScVal(i))(to),
            ((i) => i128ToScVal(i))(amount)],
        ...options,
        parseResultXdr: () => { },
    });
}
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
export async function transferUnderlyingTo({ to, amount }, options = {}) {
    return await invoke({
        method: 'transfer_underlying_to',
        args: [((i) => addressToScVal(i))(to),
            ((i) => i128ToScVal(i))(amount)],
        ...options,
        parseResultXdr: () => { },
    });
}
/**
 * Retrieves the address of the underlying asset.
 *
 * # Returns
 *
 * The address of the underlying asset.
 *
 */
export async function underlyingAsset(options = {}) {
    return await invoke({
        method: 'underlying_asset',
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
/**
 * Retrieves the address of the pool.
 *
 * # Returns
 *
 * The address of the associated pool.
 *
 */
export async function pool(options = {}) {
    return await invoke({
        method: 'pool',
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
function ReserveConfigurationToXdr(reserveConfiguration) {
    if (!reserveConfiguration) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("borrowing_enabled"), val: ((i) => xdr.ScVal.scvBool(i))(reserveConfiguration["borrowing_enabled"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("decimals"), val: ((i) => xdr.ScVal.scvU32(i))(reserveConfiguration["decimals"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("discount"), val: ((i) => xdr.ScVal.scvU32(i))(reserveConfiguration["discount"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("is_active"), val: ((i) => xdr.ScVal.scvBool(i))(reserveConfiguration["is_active"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("is_base_asset"), val: ((i) => xdr.ScVal.scvBool(i))(reserveConfiguration["is_base_asset"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("liq_bonus"), val: ((i) => xdr.ScVal.scvU32(i))(reserveConfiguration["liq_bonus"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("liq_cap"), val: ((i) => i128ToScVal(i))(reserveConfiguration["liq_cap"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("util_cap"), val: ((i) => xdr.ScVal.scvU32(i))(reserveConfiguration["util_cap"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function ReserveConfigurationFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        borrowing_enabled: scValToJs(map.get("borrowing_enabled")),
        decimals: scValToJs(map.get("decimals")),
        discount: scValToJs(map.get("discount")),
        is_active: scValToJs(map.get("is_active")),
        is_base_asset: scValToJs(map.get("is_base_asset")),
        liq_bonus: scValToJs(map.get("liq_bonus")),
        liq_cap: scValToJs(map.get("liq_cap")),
        util_cap: scValToJs(map.get("util_cap"))
    };
}
function IRParamsToXdr(irParams) {
    if (!irParams) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("alpha"), val: ((i) => xdr.ScVal.scvU32(i))(irParams["alpha"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("initial_rate"), val: ((i) => xdr.ScVal.scvU32(i))(irParams["initial_rate"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("max_rate"), val: ((i) => xdr.ScVal.scvU32(i))(irParams["max_rate"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("scaling_coeff"), val: ((i) => xdr.ScVal.scvU32(i))(irParams["scaling_coeff"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function IRParamsFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        alpha: scValToJs(map.get("alpha")),
        initial_rate: scValToJs(map.get("initial_rate")),
        max_rate: scValToJs(map.get("max_rate")),
        scaling_coeff: scValToJs(map.get("scaling_coeff"))
    };
}
function ReserveDataToXdr(reserveData) {
    if (!reserveData) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("borrower_ar"), val: ((i) => i128ToScVal(i))(reserveData["borrower_ar"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("borrower_ir"), val: ((i) => i128ToScVal(i))(reserveData["borrower_ir"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("configuration"), val: ((i) => ReserveConfigurationToXdr(i))(reserveData["configuration"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("debt_token_address"), val: ((i) => addressToScVal(i))(reserveData["debt_token_address"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("id"), val: ((i) => xdr.ScVal.scvBytes(i))(reserveData["id"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("last_update_timestamp"), val: ((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(reserveData["last_update_timestamp"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("lender_ar"), val: ((i) => i128ToScVal(i))(reserveData["lender_ar"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("lender_ir"), val: ((i) => i128ToScVal(i))(reserveData["lender_ir"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("s_token_address"), val: ((i) => addressToScVal(i))(reserveData["s_token_address"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function ReserveDataFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        borrower_ar: scValToJs(map.get("borrower_ar")),
        borrower_ir: scValToJs(map.get("borrower_ir")),
        configuration: scValToJs(map.get("configuration")),
        debt_token_address: scValToJs(map.get("debt_token_address")),
        id: scValToJs(map.get("id")),
        last_update_timestamp: scValToJs(map.get("last_update_timestamp")),
        lender_ar: scValToJs(map.get("lender_ar")),
        lender_ir: scValToJs(map.get("lender_ir")),
        s_token_address: scValToJs(map.get("s_token_address"))
    };
}
function InitReserveInputToXdr(initReserveInput) {
    if (!initReserveInput) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("debt_token_address"), val: ((i) => addressToScVal(i))(initReserveInput["debt_token_address"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("s_token_address"), val: ((i) => addressToScVal(i))(initReserveInput["s_token_address"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function InitReserveInputFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        debt_token_address: scValToJs(map.get("debt_token_address")),
        s_token_address: scValToJs(map.get("s_token_address"))
    };
}
function CollateralParamsInputToXdr(collateralParamsInput) {
    if (!collateralParamsInput) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("discount"), val: ((i) => xdr.ScVal.scvU32(i))(collateralParamsInput["discount"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("liq_bonus"), val: ((i) => xdr.ScVal.scvU32(i))(collateralParamsInput["liq_bonus"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("liq_cap"), val: ((i) => i128ToScVal(i))(collateralParamsInput["liq_cap"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("util_cap"), val: ((i) => xdr.ScVal.scvU32(i))(collateralParamsInput["util_cap"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function CollateralParamsInputFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        discount: scValToJs(map.get("discount")),
        liq_bonus: scValToJs(map.get("liq_bonus")),
        liq_cap: scValToJs(map.get("liq_cap")),
        util_cap: scValToJs(map.get("util_cap"))
    };
}
function UserConfigurationToXdr(userConfiguration) {
    if (!userConfiguration) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        (i => u128ToScVal(i))(userConfiguration[0])
    ];
    return xdr.ScVal.scvVec(arr);
}
function UserConfigurationFromXdr(base64Xdr) {
    return scValStrToJs(base64Xdr);
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
    { message: "" },
    { message: "" }
];
function AccountPositionToXdr(accountPosition) {
    if (!accountPosition) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("debt"), val: ((i) => i128ToScVal(i))(accountPosition["debt"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("discounted_collateral"), val: ((i) => i128ToScVal(i))(accountPosition["discounted_collateral"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("npv"), val: ((i) => i128ToScVal(i))(accountPosition["npv"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function AccountPositionFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        debt: scValToJs(map.get("debt")),
        discounted_collateral: scValToJs(map.get("discounted_collateral")),
        npv: scValToJs(map.get("npv"))
    };
}
function AssetBalanceToXdr(assetBalance) {
    if (!assetBalance) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("asset"), val: ((i) => addressToScVal(i))(assetBalance["asset"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("balance"), val: ((i) => i128ToScVal(i))(assetBalance["balance"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function AssetBalanceFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        asset: scValToJs(map.get("asset")),
        balance: scValToJs(map.get("balance"))
    };
}
function FlashLoanAssetToXdr(flashLoanAsset) {
    if (!flashLoanAsset) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("amount"), val: ((i) => i128ToScVal(i))(flashLoanAsset["amount"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("asset"), val: ((i) => addressToScVal(i))(flashLoanAsset["asset"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("borrow"), val: ((i) => xdr.ScVal.scvBool(i))(flashLoanAsset["borrow"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function FlashLoanAssetFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        amount: scValToJs(map.get("amount")),
        asset: scValToJs(map.get("asset")),
        borrow: scValToJs(map.get("borrow"))
    };
}
function MintBurnToXdr(mintBurn) {
    if (!mintBurn) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("asset_balance"), val: ((i) => AssetBalanceToXdr(i))(mintBurn["asset_balance"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("mint"), val: ((i) => xdr.ScVal.scvBool(i))(mintBurn["mint"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("who"), val: ((i) => addressToScVal(i))(mintBurn["who"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function MintBurnFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        asset_balance: scValToJs(map.get("asset_balance")),
        mint: scValToJs(map.get("mint")),
        who: scValToJs(map.get("who"))
    };
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

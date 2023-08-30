import * as SorobanClient from 'soroban-client';
import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValStrToJs, scValToJs, addressToScVal, u128ToScVal, i128ToScVal, strToScVal } from './convert.js';
import { invoke, InvokeArgs } from './invoke.js';


export * from './constants.js'
export * from './server.js'
export * from './invoke.js'

export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Address = string;
export type Option<T> = T | undefined;
export type Typepoint = bigint;
export type Duration = bigint;

/// Error interface containing the error message
export interface Error_ { message: string };

export interface Result<T, E = Error_> {
    unwrap(): T,
    unwrapErr(): E,
    isOk(): boolean,
    isErr(): boolean,
};

export class Ok<T> implements Result<T> {
    constructor(readonly value: T) { }
    unwrapErr(): Error_ {
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

export class Err<T> implements Result<T> {
    constructor(readonly error: Error_) { }
    unwrapErr(): Error_ {
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

const regex = /ContractError\((\d+)\)/;

function getError(err: string): Err<Error_> | undefined {
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
        return new Err(Errors[i]!);
    }
    return undefined;
}

export interface AllowanceValue {
  amount: i128;
  expiration_ledger: u32;
}

function AllowanceValueToXdr(allowanceValue?: AllowanceValue): xdr.ScVal {
    if (!allowanceValue) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("amount"), val: ((i)=>i128ToScVal(i))(allowanceValue["amount"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("expiration_ledger"), val: ((i)=>xdr.ScVal.scvU32(i))(allowanceValue["expiration_ledger"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function AllowanceValueFromXdr(base64Xdr: string): AllowanceValue {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        amount: scValToJs(map.get("amount")) as unknown as i128,
        expiration_ledger: scValToJs(map.get("expiration_ledger")) as unknown as u32
    };
}

export interface AllowanceDataKey {
  from: Address;
  spender: Address;
}

function AllowanceDataKeyToXdr(allowanceDataKey?: AllowanceDataKey): xdr.ScVal {
    if (!allowanceDataKey) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("from"), val: ((i)=>addressToScVal(i))(allowanceDataKey["from"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("spender"), val: ((i)=>addressToScVal(i))(allowanceDataKey["spender"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function AllowanceDataKeyFromXdr(base64Xdr: string): AllowanceDataKey {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        from: scValToJs(map.get("from")) as unknown as Address,
        spender: scValToJs(map.get("spender")) as unknown as Address
    };
}

export type DataKey = {tag: "Allowance", values: [AllowanceDataKey]} | {tag: "UnderlyingAsset", values: void};

function DataKeyToXdr(dataKey?: DataKey): xdr.ScVal {
    if (!dataKey) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
    switch (dataKey.tag) {
        case "Allowance":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Allowance"));
            res.push(((i)=>AllowanceDataKeyToXdr(i))(dataKey.values[0]));
            break;
    case "UnderlyingAsset":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("UnderlyingAsset"));
            break;  
    }
    return xdr.ScVal.scvVec(res);
}

function DataKeyFromXdr(base64Xdr: string): DataKey {
    type Tag = DataKey["tag"];
    type Value = DataKey["values"];
    let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [Tag, Value];
    if (!tag) {
        throw new Error('Missing enum tag when decoding DataKey from XDR');
    }
    return { tag, values } as DataKey;
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
export async function initialize({name, symbol, pool, underlying_asset}: {name: string, symbol: string, pool: Address, underlying_asset: Address}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'initialize', 
        args: [((i) => xdr.ScVal.scvString(i))(name),
        ((i) => xdr.ScVal.scvString(i))(symbol),
        ((i) => addressToScVal(i))(pool),
        ((i) => addressToScVal(i))(underlying_asset)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
}

export async function upgrade({new_wasm_hash}: {new_wasm_hash: Buffer}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'upgrade', 
        args: [((i) => xdr.ScVal.scvBytes(i))(new_wasm_hash)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
}

export async function version( {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<u32> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'version', 
        
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as u32;
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
export async function allowance({from, spender}: {from: Address, spender: Address}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<i128> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'allowance', 
        args: [((i) => addressToScVal(i))(from),
        ((i) => addressToScVal(i))(spender)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as i128;
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
export async function approve({from, spender, amount, expiration_ledger}: {from: Address, spender: Address, amount: i128, expiration_ledger: u32}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'approve', 
        args: [((i) => addressToScVal(i))(from),
        ((i) => addressToScVal(i))(spender),
        ((i) => i128ToScVal(i))(amount),
        ((i) => xdr.ScVal.scvU32(i))(expiration_ledger)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
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
export async function balance({id}: {id: Address}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<i128> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'balance', 
        args: [((i) => addressToScVal(i))(id)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as i128;
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
export async function spendable_balance({id}: {id: Address}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<i128> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'spendable_balance', 
        args: [((i) => addressToScVal(i))(id)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as i128;
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
export async function authorized({id}: {id: Address}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<boolean> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'authorized', 
        args: [((i) => addressToScVal(i))(id)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as boolean;
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
export async function transfer({from, to, amount}: {from: Address, to: Address, amount: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'transfer', 
        args: [((i) => addressToScVal(i))(from),
        ((i) => addressToScVal(i))(to),
        ((i) => i128ToScVal(i))(amount)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
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
export async function transfer_from({spender, from, to, amount}: {spender: Address, from: Address, to: Address, amount: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'transfer_from', 
        args: [((i) => addressToScVal(i))(spender),
        ((i) => addressToScVal(i))(from),
        ((i) => addressToScVal(i))(to),
        ((i) => i128ToScVal(i))(amount)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
}

export async function burn_from({_spender, _from, _amount}: {_spender: Address, _from: Address, _amount: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'burn_from', 
        args: [((i) => addressToScVal(i))(_spender),
        ((i) => addressToScVal(i))(_from),
        ((i) => i128ToScVal(i))(_amount)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
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
export async function clawback({from, amount}: {from: Address, amount: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'clawback', 
        args: [((i) => addressToScVal(i))(from),
        ((i) => i128ToScVal(i))(amount)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
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
export async function set_authorized({id, authorize}: {id: Address, authorize: boolean}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'set_authorized', 
        args: [((i) => addressToScVal(i))(id),
        ((i) => xdr.ScVal.scvBool(i))(authorize)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
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
export async function mint({to, amount}: {to: Address, amount: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'mint', 
        args: [((i) => addressToScVal(i))(to),
        ((i) => i128ToScVal(i))(amount)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
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
export async function burn({from, amount_to_burn, amount_to_withdraw, to}: {from: Address, amount_to_burn: i128, amount_to_withdraw: i128, to: Address}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'burn', 
        args: [((i) => addressToScVal(i))(from),
        ((i) => i128ToScVal(i))(amount_to_burn),
        ((i) => i128ToScVal(i))(amount_to_withdraw),
        ((i) => addressToScVal(i))(to)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
}

/**
 * Returns the number of decimal places used by the token.
 * 
 * # Returns
 * 
 * The number of decimal places used by the token.
 * 
 */
export async function decimals( {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<u32> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'decimals', 
        
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as u32;
}

/**
 * Returns the name of the token.
 * 
 * # Returns
 * 
 * The name of the token as a `soroban_sdk::Bytes` value.
 * 
 */
export async function name( {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<string> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'name', 
        
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as string;
}

/**
 * Returns the symbol of the token.
 * 
 * # Returns
 * 
 * The symbol of the token as a `soroban_sdk::Bytes` value.
 * 
 */
export async function symbol( {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<string> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'symbol', 
        
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as string;
}

/**
 * Returns the total supply of tokens.
 * 
 * # Returns
 * 
 * The total supply of tokens.
 * 
 */
export async function total_supply( {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<i128> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'total_supply', 
        
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as i128;
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
export async function transfer_on_liquidation({from, to, amount}: {from: Address, to: Address, amount: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'transfer_on_liquidation', 
        args: [((i) => addressToScVal(i))(from),
        ((i) => addressToScVal(i))(to),
        ((i) => i128ToScVal(i))(amount)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
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
export async function transfer_underlying_to({to, amount}: {to: Address, amount: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'transfer_underlying_to', 
        args: [((i) => addressToScVal(i))(to),
        ((i) => i128ToScVal(i))(amount)], 
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return ;
}

/**
 * Retrieves the address of the underlying asset.
 * 
 * # Returns
 * 
 * The address of the underlying asset.
 * 
 */
export async function underlying_asset( {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Address> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'underlying_asset', 
        
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as Address;
}

/**
 * Retrieves the address of the pool.
 * 
 * # Returns
 * 
 * The address of the associated pool.
 * 
 */
export async function pool( {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<Address> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'pool', 
        
    };
    
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as Address;
}

export type CommonDataKey = {tag: "Balance", values: [Address]} | {tag: "State", values: [Address]} | {tag: "Pool", values: void} | {tag: "TotalSupply", values: void};

function CommonDataKeyToXdr(commonDataKey?: CommonDataKey): xdr.ScVal {
    if (!commonDataKey) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
    switch (commonDataKey.tag) {
        case "Balance":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Balance"));
            res.push(((i)=>addressToScVal(i))(commonDataKey.values[0]));
            break;
    case "State":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("State"));
            res.push(((i)=>addressToScVal(i))(commonDataKey.values[0]));
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

function CommonDataKeyFromXdr(base64Xdr: string): CommonDataKey {
    type Tag = CommonDataKey["tag"];
    type Value = CommonDataKey["values"];
    let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [Tag, Value];
    if (!tag) {
        throw new Error('Missing enum tag when decoding CommonDataKey from XDR');
    }
    return { tag, values } as CommonDataKey;
}

export interface ReserveConfiguration {
  borrowing_enabled: boolean;
  decimals: u32;
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

function ReserveConfigurationToXdr(reserveConfiguration?: ReserveConfiguration): xdr.ScVal {
    if (!reserveConfiguration) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("borrowing_enabled"), val: ((i)=>xdr.ScVal.scvBool(i))(reserveConfiguration["borrowing_enabled"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("decimals"), val: ((i)=>xdr.ScVal.scvU32(i))(reserveConfiguration["decimals"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("discount"), val: ((i)=>xdr.ScVal.scvU32(i))(reserveConfiguration["discount"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("is_active"), val: ((i)=>xdr.ScVal.scvBool(i))(reserveConfiguration["is_active"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("liq_bonus"), val: ((i)=>xdr.ScVal.scvU32(i))(reserveConfiguration["liq_bonus"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("liq_cap"), val: ((i)=>i128ToScVal(i))(reserveConfiguration["liq_cap"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("util_cap"), val: ((i)=>xdr.ScVal.scvU32(i))(reserveConfiguration["util_cap"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function ReserveConfigurationFromXdr(base64Xdr: string): ReserveConfiguration {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        borrowing_enabled: scValToJs(map.get("borrowing_enabled")) as unknown as boolean,
        decimals: scValToJs(map.get("decimals")) as unknown as u32,
        discount: scValToJs(map.get("discount")) as unknown as u32,
        is_active: scValToJs(map.get("is_active")) as unknown as boolean,
        liq_bonus: scValToJs(map.get("liq_bonus")) as unknown as u32,
        liq_cap: scValToJs(map.get("liq_cap")) as unknown as i128,
        util_cap: scValToJs(map.get("util_cap")) as unknown as u32
    };
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

function IRParamsToXdr(irParams?: IRParams): xdr.ScVal {
    if (!irParams) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("alpha"), val: ((i)=>xdr.ScVal.scvU32(i))(irParams["alpha"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("initial_rate"), val: ((i)=>xdr.ScVal.scvU32(i))(irParams["initial_rate"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("max_rate"), val: ((i)=>xdr.ScVal.scvU32(i))(irParams["max_rate"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("scaling_coeff"), val: ((i)=>xdr.ScVal.scvU32(i))(irParams["scaling_coeff"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function IRParamsFromXdr(base64Xdr: string): IRParams {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        alpha: scValToJs(map.get("alpha")) as unknown as u32,
        initial_rate: scValToJs(map.get("initial_rate")) as unknown as u32,
        max_rate: scValToJs(map.get("max_rate")) as unknown as u32,
        scaling_coeff: scValToJs(map.get("scaling_coeff")) as unknown as u32
    };
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

function ReserveDataToXdr(reserveData?: ReserveData): xdr.ScVal {
    if (!reserveData) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("borrower_ar"), val: ((i)=>i128ToScVal(i))(reserveData["borrower_ar"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("borrower_ir"), val: ((i)=>i128ToScVal(i))(reserveData["borrower_ir"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("configuration"), val: ((i)=>ReserveConfigurationToXdr(i))(reserveData["configuration"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("debt_token_address"), val: ((i)=>addressToScVal(i))(reserveData["debt_token_address"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("id"), val: ((i)=>xdr.ScVal.scvBytes(i))(reserveData["id"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("last_update_timestamp"), val: ((i)=>xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(reserveData["last_update_timestamp"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("lender_ar"), val: ((i)=>i128ToScVal(i))(reserveData["lender_ar"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("lender_ir"), val: ((i)=>i128ToScVal(i))(reserveData["lender_ir"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("s_token_address"), val: ((i)=>addressToScVal(i))(reserveData["s_token_address"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function ReserveDataFromXdr(base64Xdr: string): ReserveData {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        borrower_ar: scValToJs(map.get("borrower_ar")) as unknown as i128,
        borrower_ir: scValToJs(map.get("borrower_ir")) as unknown as i128,
        configuration: scValToJs(map.get("configuration")) as unknown as ReserveConfiguration,
        debt_token_address: scValToJs(map.get("debt_token_address")) as unknown as Address,
        id: scValToJs(map.get("id")) as unknown as Buffer,
        last_update_timestamp: scValToJs(map.get("last_update_timestamp")) as unknown as u64,
        lender_ar: scValToJs(map.get("lender_ar")) as unknown as i128,
        lender_ir: scValToJs(map.get("lender_ir")) as unknown as i128,
        s_token_address: scValToJs(map.get("s_token_address")) as unknown as Address
    };
}

export interface InitReserveInput {
  debt_token_address: Address;
  s_token_address: Address;
}

function InitReserveInputToXdr(initReserveInput?: InitReserveInput): xdr.ScVal {
    if (!initReserveInput) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("debt_token_address"), val: ((i)=>addressToScVal(i))(initReserveInput["debt_token_address"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("s_token_address"), val: ((i)=>addressToScVal(i))(initReserveInput["s_token_address"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function InitReserveInputFromXdr(base64Xdr: string): InitReserveInput {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        debt_token_address: scValToJs(map.get("debt_token_address")) as unknown as Address,
        s_token_address: scValToJs(map.get("s_token_address")) as unknown as Address
    };
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

function CollateralParamsInputToXdr(collateralParamsInput?: CollateralParamsInput): xdr.ScVal {
    if (!collateralParamsInput) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("discount"), val: ((i)=>xdr.ScVal.scvU32(i))(collateralParamsInput["discount"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("liq_bonus"), val: ((i)=>xdr.ScVal.scvU32(i))(collateralParamsInput["liq_bonus"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("liq_cap"), val: ((i)=>i128ToScVal(i))(collateralParamsInput["liq_cap"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("util_cap"), val: ((i)=>xdr.ScVal.scvU32(i))(collateralParamsInput["util_cap"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function CollateralParamsInputFromXdr(base64Xdr: string): CollateralParamsInput {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        discount: scValToJs(map.get("discount")) as unknown as u32,
        liq_bonus: scValToJs(map.get("liq_bonus")) as unknown as u32,
        liq_cap: scValToJs(map.get("liq_cap")) as unknown as i128,
        util_cap: scValToJs(map.get("util_cap")) as unknown as u32
    };
}

/**
 * Implements the bitmap logic to handle the user configuration.
 * Even positions is collateral flags and uneven is borrowing flags.
 */
export type UserConfiguration = [u128];

function UserConfigurationToXdr(userConfiguration?: UserConfiguration): xdr.ScVal {
    if (!userConfiguration) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        (i => u128ToScVal(i))(userConfiguration[0])
        ];
    return xdr.ScVal.scvVec(arr);
}


function UserConfigurationFromXdr(base64Xdr: string): UserConfiguration {
    return scValStrToJs(base64Xdr) as UserConfiguration;
}

const Errors = [ 
{message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""},
  {message:""}
]
export interface AccountPosition {
  debt: i128;
  discounted_collateral: i128;
  npv: i128;
}

function AccountPositionToXdr(accountPosition?: AccountPosition): xdr.ScVal {
    if (!accountPosition) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("debt"), val: ((i)=>i128ToScVal(i))(accountPosition["debt"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("discounted_collateral"), val: ((i)=>i128ToScVal(i))(accountPosition["discounted_collateral"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("npv"), val: ((i)=>i128ToScVal(i))(accountPosition["npv"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function AccountPositionFromXdr(base64Xdr: string): AccountPosition {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        debt: scValToJs(map.get("debt")) as unknown as i128,
        discounted_collateral: scValToJs(map.get("discounted_collateral")) as unknown as i128,
        npv: scValToJs(map.get("npv")) as unknown as i128
    };
}

export interface TokenMetadata {
  decimal: u32;
  name: string;
  symbol: string;
}

function TokenMetadataToXdr(tokenMetadata?: TokenMetadata): xdr.ScVal {
    if (!tokenMetadata) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("decimal"), val: ((i)=>xdr.ScVal.scvU32(i))(tokenMetadata["decimal"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("name"), val: ((i)=>xdr.ScVal.scvString(i))(tokenMetadata["name"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("symbol"), val: ((i)=>xdr.ScVal.scvString(i))(tokenMetadata["symbol"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function TokenMetadataFromXdr(base64Xdr: string): TokenMetadata {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        decimal: scValToJs(map.get("decimal")) as unknown as u32,
        name: scValToJs(map.get("name")) as unknown as string,
        symbol: scValToJs(map.get("symbol")) as unknown as string
    };
}

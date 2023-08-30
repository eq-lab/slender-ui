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

/**
 * Returns the current version of the contract.
 */
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
export async function burn({from, amount}: {from: Address, amount: i128}, {signAndSend, fee}: {signAndSend?: boolean, fee?: number} = {signAndSend: false, fee: 100}): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'burn', 
        args: [((i) => addressToScVal(i))(from),
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
 * Returns the number of decimal places used by the token.
 * 
 * # Returns
 * 
 * The number o
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

const Errors = [ 

]
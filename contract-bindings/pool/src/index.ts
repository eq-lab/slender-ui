import * as SorobanClient from 'soroban-client';
import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValStrToJs, scValToJs, addressToScVal, u128ToScVal, i128ToScVal, strToScVal } from './convert.js';
import { invoke } from './invoke.js';
import { ResponseTypes } from './method-options.js'

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

export type DataKey = {tag: "Admin", values: void} | {tag: "ReserveAssetKey", values: [Address]} | {tag: "Reserves", values: void} | {tag: "Treasury", values: void} | {tag: "IRParams", values: void} | {tag: "UserConfig", values: [Address]} | {tag: "PriceFeed", values: [Address]} | {tag: "Pause", values: void} | {tag: "FlashLoanFee", values: void} | {tag: "STokenUnderlyingBalance", values: [Address]} | {tag: "TokenBalance", values: [Address, Address]} | {tag: "TokenSupply", values: [Address]} | {tag: "Price", values: [Address]};

function DataKeyToXdr(dataKey?: DataKey): xdr.ScVal {
    if (!dataKey) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
    switch (dataKey.tag) {
        case "Admin":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Admin"));
            break;
    case "ReserveAssetKey":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("ReserveAssetKey"));
            res.push(((i)=>addressToScVal(i))(dataKey.values[0]));
            break;
    case "Reserves":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Reserves"));
            break;
    case "Treasury":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Treasury"));
            break;
    case "IRParams":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("IRParams"));
            break;
    case "UserConfig":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("UserConfig"));
            res.push(((i)=>addressToScVal(i))(dataKey.values[0]));
            break;
    case "PriceFeed":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("PriceFeed"));
            res.push(((i)=>addressToScVal(i))(dataKey.values[0]));
            break;
    case "Pause":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Pause"));
            break;
    case "FlashLoanFee":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("FlashLoanFee"));
            break;
    case "STokenUnderlyingBalance":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("STokenUnderlyingBalance"));
            res.push(((i)=>addressToScVal(i))(dataKey.values[0]));
            break;
    case "TokenBalance":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("TokenBalance"));
            res.push(((i)=>addressToScVal(i))(dataKey.values[0]));
            res.push(((i)=>addressToScVal(i))(dataKey.values[1]));
            break;
    case "TokenSupply":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("TokenSupply"));
            res.push(((i)=>addressToScVal(i))(dataKey.values[0]));
            break;
    case "Price":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Price"));
            res.push(((i)=>addressToScVal(i))(dataKey.values[0]));
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
 * Initializes the contract with the specified admin address.
 * 
 * # Arguments
 * 
 * - admin - The address of the admin for the contract.
 * - treasury - The address of the treasury contract.
 * - flash_loan_fee - Кepresents the fee paid by the flash loan borrowers.
 * - ir_params - The interest rate parameters to set.
 * 
 * # Panics
 * 
 * Panics with `AlreadyInitialized` if the admin key already exists in storage.
 * 
 */
export async function initialize<R extends ResponseTypes = undefined>({admin, treasury, flash_loan_fee, ir_params}: {admin: Address, treasury: Address, flash_loan_fee: u32, ir_params: IRParams}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        args: [((i) => addressToScVal(i))(admin),
        ((i) => addressToScVal(i))(treasury),
        ((i) => xdr.ScVal.scvU32(i))(flash_loan_fee),
        ((i) => IRParamsToXdr(i))(ir_params)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
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
 * - Panics with `Uninitialized` if the admin key is not exist in storage.
 * - Panics if the caller is not the admin.
 * 
 */
export async function upgrade<R extends ResponseTypes = undefined>({new_wasm_hash}: {new_wasm_hash: Buffer}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        args: [((i) => xdr.ScVal.scvBytes(i))(new_wasm_hash)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Upgrades the deployed s_token contract wasm preserving the contract id.
 * 
 * # Arguments
 * 
 * - new_wasm_hash - The new version of the WASM hash.
 * - asset - The address of the asset associated with the reserve.
 * 
 * # Panics
 * 
 * - Panics with `Uninitialized` if the admin key is not exist in storage.
 * - Panics with `NoReserveExistForAsset` if no reserve exists for the specified asset.
 * - Panics if the caller is not the admin.
 * 
 */
export async function upgradeSToken<R extends ResponseTypes = undefined>({asset, new_wasm_hash}: {asset: Address, new_wasm_hash: Buffer}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'upgrade_s_token',
        args: [((i) => addressToScVal(i))(asset),
        ((i) => xdr.ScVal.scvBytes(i))(new_wasm_hash)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Upgrades the deployed debt_token contract wasm preserving the contract id.
 * 
 * # Arguments
 * 
 * - new_wasm_hash - The new version of the WASM hash.
 * - asset - The address of the asset associated with the reserve.
 * 
 * # Panics
 * 
 * - Panics with `Uninitialized` if the admin key is not exist in storage.
 * - Panics with `NoReserveExistForAsset` if no reserve exists for the specified asset.
 * - Panics if the caller is not the admin.
 * 
 */
export async function upgradeDebtToken<R extends ResponseTypes = undefined>({asset, new_wasm_hash}: {asset: Address, new_wasm_hash: Buffer}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'upgrade_debt_token',
        args: [((i) => addressToScVal(i))(asset),
        ((i) => xdr.ScVal.scvBytes(i))(new_wasm_hash)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Returns the current version of the contract.
 */
export async function version<R extends ResponseTypes = undefined>(options: {
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
        ...options,
        parseResultXdr: (xdr): u32 => {
            return scValStrToJs(xdr);
        },
    });
}

/**
 * Initializes a reserve for a given asset.
 * 
 * # Arguments
 * 
 * - asset - The address of the asset associated with the reserve.
 * - input - The input parameters for initializing the reserve.
 * 
 * # Panics
 * 
 * - Panics with `Uninitialized` if the admin key is not exist in storage.
 * - Panics with `ReserveAlreadyInitialized` if the specified asset key already exists in storage.
 * - Panics with `MustBeLtePercentageFactor` if initial_rate or max_rate are invalid.
 * - Panics with `MustBeLtPercentageFactor` if scaling_coeff is invalid.
 * - Panics if the caller is not the admin.
 * 
 */
export async function initReserve<R extends ResponseTypes = undefined>({asset, input}: {asset: Address, input: InitReserveInput}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'init_reserve',
        args: [((i) => addressToScVal(i))(asset),
        ((i) => InitReserveInputToXdr(i))(input)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Activates/De-activates reserve for the specified asset.
 * 
 * # Arguments
 * 
 * - asset - address of the asset associated with the reserve
 * - is_active - flag indicating the reserve must be activeted or de-activated
 * 
 * # Panics
 * - Panics with `NoReserveExistForAsset` if no reserve exists for the specified asset.
 * - Panics if the caller is not the admin.
 * 
 */
export async function setReserveStatus<R extends ResponseTypes = undefined>({asset, is_active}: {asset: Address, is_active: boolean}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'set_reserve_status',
        args: [((i) => addressToScVal(i))(asset),
        ((i) => xdr.ScVal.scvBool(i))(is_active)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Updates an interest rate parameters.
 * 
 * # Arguments
 * 
 * - input - The interest rate parameters to set.
 * 
 * # Panics
 * 
 * - Panics with `Uninitialized` if the admin or ir_params key are not exist in storage.
 * - Panics with `MustBeLtePercentageFactor` if alpha or initial_rate are invalid.
 * - Panics with `MustBeGtPercentageFactor` if max_rate is invalid.
 * - Panics with `MustBeLtPercentageFactor` if scaling_coeff is invalid.
 * - Panics if the caller is not the admin.
 * 
 */
export async function setIrParams<R extends ResponseTypes = undefined>({input}: {input: IRParams}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'set_ir_params',
        args: [((i) => IRParamsToXdr(i))(input)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Retrieves the interest rate parameters.
 * 
 * # Returns
 * 
 * Returns the interest rate parameters if set, or None otherwise.
 * 
 */
export async function irParams<R extends ResponseTypes = undefined>(options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Option<IRParams>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'ir_params',
        ...options,
        parseResultXdr: (xdr): Option<IRParams> => {
            return scValStrToJs(xdr);
        },
    });
}

/**
 * Enable borrowing
 * 
 * # Arguments
 * 
 * - asset - target asset
 * - enabled - enable/disable borrow flag
 * 
 * # Errors
 * 
 * - NoReserveExistForAsset
 * 
 * # Panics
 * 
 * - If the caller is not the admin.
 * 
 */
export async function enableBorrowingOnReserve<R extends ResponseTypes = undefined>({asset, enabled}: {asset: Address, enabled: boolean}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'enable_borrowing_on_reserve',
        args: [((i) => addressToScVal(i))(asset),
        ((i) => xdr.ScVal.scvBool(i))(enabled)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Configures the reserve collateralization parameters
 * all the values are expressed in percentages with two decimals of precision.
 * 
 * # Arguments
 * 
 * - asset - The address of asset that should be set as collateral
 * - params - Collateral parameters
 * 
 * # Panics
 * 
 * - Panics with `MustBeLtePercentageFactor` if util_cap or discount is invalid.
 * - Panics with `MustBeGtPercentageFactor` if liq_bonus is invalid.
 * - Panics with `MustBePositive` if liq_cap is invalid.
 * - Panics with `NoReserveExistForAsset` if no reserve exists for the specified asset.
 * - Panics if the caller is not the admin.
 * 
 */
export async function configureAsCollateral<R extends ResponseTypes = undefined>({asset, params}: {asset: Address, params: CollateralParamsInput}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'configure_as_collateral',
        args: [((i) => addressToScVal(i))(asset),
        ((i) => CollateralParamsInputToXdr(i))(params)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Retrieves the reserve data for the specified asset.
 * 
 * # Arguments
 * 
 * - asset - The address of the asset associated with the reserve.
 * 
 * # Returns
 * 
 * Returns the reserve data for the specified asset if it exists, or None otherwise.
 * 
 */
export async function getReserve<R extends ResponseTypes = undefined>({asset}: {asset: Address}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Option<ReserveData>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'get_reserve',
        args: [((i) => addressToScVal(i))(asset)],
        ...options,
        parseResultXdr: (xdr): Option<ReserveData> => {
            return scValStrToJs(xdr);
        },
    });
}

/**
 * Returns collateral coefficient corrected on current time expressed as inner value of FixedI128
 * 
 * # Arguments
 * 
 * - asset - The address of underlying asset
 */
export async function collatCoeff<R extends ResponseTypes = undefined>({asset}: {asset: Address}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<i128> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'collat_coeff',
        args: [((i) => addressToScVal(i))(asset)],
        ...options,
        parseResultXdr: (xdr): Ok<i128> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Returns debt coefficient corrected on current time expressed as inner value of FixedI128.
 * The same as borrower accrued rate
 * 
 * # Arguments
 * 
 * - asset - The address of underlying asset
 */
export async function debtCoeff<R extends ResponseTypes = undefined>({asset}: {asset: Address}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<i128> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'debt_coeff',
        args: [((i) => addressToScVal(i))(asset)],
        ...options,
        parseResultXdr: (xdr): Ok<i128> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Sets the price feed oracle address for a given assets.
 * 
 * # Arguments
 * 
 * - feed - The contract address of the price feed oracle.
 * - assets - The collection of assets associated with the price feed.
 * 
 * # Panics
 * 
 * - Panics with `Uninitialized` if the admin key is not exist in storage.
 * - Panics if the caller is not the admin.
 * 
 */
export async function setPriceFeed<R extends ResponseTypes = undefined>({feed, assets}: {feed: Address, assets: Array<Address>}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'set_price_feed',
        args: [((i) => addressToScVal(i))(feed),
        ((i) => xdr.ScVal.scvVec(i.map((i)=>addressToScVal(i))))(assets)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Retrieves the price feed oracle address for a given asset.
 * 
 * # Arguments
 * 
 * - asset - The address of the asset associated with the price feed.
 * 
 * # Returns
 * 
 * Returns the price feed oracle contract id associated with the asset if set, or None otherwise.
 * 
 */
export async function priceFeed<R extends ResponseTypes = undefined>({asset}: {asset: Address}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Option<Address>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'price_feed',
        args: [((i) => addressToScVal(i))(asset)],
        ...options,
        parseResultXdr: (xdr): Option<Address> => {
            return scValStrToJs(xdr);
        },
    });
}

/**
 * Deposits a specified amount of an asset into the reserve associated with the asset.
 * Depositor receives s-tokens according to the current index value.
 * 
 * 
 * # Arguments
 * 
 * - who - The address of the user making the deposit.
 * - asset - The address of the asset to be deposited for lend.
 * - amount - The amount to be deposited.
 * 
 * # Errors
 * 
 * Returns `NoReserveExistForAsset` if no reserve exists for the specified asset.
 * Returns `MathOverflowError' if an overflow occurs when calculating the amount of tokens.
 * Returns `MustNotHaveDebt` if user already has debt.
 * 
 * # Panics
 * 
 * If the caller is not authorized.
 * If the deposit amount is invalid or does not meet the reserve requirements.
 * If the reserve data cannot be retrieved from storage.
 * 
 */
export async function deposit<R extends ResponseTypes = undefined>({who, asset, amount}: {who: Address, asset: Address, amount: i128}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'deposit',
        args: [((i) => addressToScVal(i))(who),
        ((i) => addressToScVal(i))(asset),
        ((i) => i128ToScVal(i))(amount)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Repays a borrowed amount on a specific reserve, burning the equivalent debt tokens owned.
 * 
 * 
 * # Arguments
 * 
 * - who - The address of the user making the repayment.
 * - asset - The address of the asset to be repayed.
 * - amount - The amount to be repayed. Use i128::MAX to repay the maximum available amount.
 * 
 * # Errors
 * 
 * Returns `NoReserveExistForAsset` if no reserve exists for the specified asset.
 * Returns `MathOverflowError' if an overflow occurs when calculating the amount of tokens.
 * 
 * # Panics
 * 
 * If the caller is not authorized.
 * If the deposit amount is invalid or does not meet the reserve requirements.
 * If the reserve data cannot be retrieved from storage.
 * 
 */
export async function repay<R extends ResponseTypes = undefined>({who, asset, amount}: {who: Address, asset: Address, amount: i128}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'repay',
        args: [((i) => addressToScVal(i))(who),
        ((i) => addressToScVal(i))(asset),
        ((i) => i128ToScVal(i))(amount)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Callback that should be called by s-token after transfer to ensure user have good position after transfer
 * 
 * # Arguments
 * 
 * - asset - underlying asset
 * - from - address of user who send s-token
 * - to - user who receive s-token
 * - amount - sended amount of s-token
 * - balance_from_before - amount of s-token before transfer on `from` user balance
 * - balance_to_before - amount of s-token before transfer on `to` user balance
 * 
 * # Panics
 * 
 * Panics if the caller is not the sToken contract.
 * 
 */
export async function finalizeTransfer<R extends ResponseTypes = undefined>({asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply}: {asset: Address, from: Address, to: Address, amount: i128, balance_from_before: i128, balance_to_before: i128, s_token_supply: i128}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'finalize_transfer',
        args: [((i) => addressToScVal(i))(asset),
        ((i) => addressToScVal(i))(from),
        ((i) => addressToScVal(i))(to),
        ((i) => i128ToScVal(i))(amount),
        ((i) => i128ToScVal(i))(balance_from_before),
        ((i) => i128ToScVal(i))(balance_to_before),
        ((i) => i128ToScVal(i))(s_token_supply)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Withdraws a specified amount of an asset from the reserve and transfers it to the caller.
 * Burn s-tokens from depositor according to the current index value.
 * 
 * # Arguments
 * 
 * - who - The address of the user making the withdrawal.
 * - asset - The address of the asset to be withdrawn.
 * - amount - The amount to be withdrawn. Use i128::MAX to withdraw the maximum available amount.
 * - to - The address of the recipient of the withdrawn asset.
 * 
 * # Errors
 * 
 * Returns `NoReserveExistForAsset` if no reserve exists for the specified asset.
 * Returns `UserConfigNotExists` if the user configuration does not exist in storage.
 * Returns `MathOverflowError' if an overflow occurs when calculating the amount of the s-token to be burned.
 * 
 * # Panics
 * 
 * Panics if the caller is not authorized.
 * Panics if the withdrawal amount is invalid or does not meet the reserve requirements.
 * 
 */
export async function withdraw<R extends ResponseTypes = undefined>({who, asset, amount, to}: {who: Address, asset: Address, amount: i128, to: Address}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'withdraw',
        args: [((i) => addressToScVal(i))(who),
        ((i) => addressToScVal(i))(asset),
        ((i) => i128ToScVal(i))(amount),
        ((i) => addressToScVal(i))(to)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Allows users to borrow a specific `amount` of the reserve underlying asset, provided that the borrower
 * already deposited enough collateral
 * 
 * # Arguments
 * - who The address of user performing borrowing
 * - asset The address of the underlying asset to borrow
 * - amount The amount to be borrowed
 * 
 * # Panics
 * - Panics when caller is not authorized as who
 * - Panics if user balance doesn't meet requirements for borrowing an amount of asset
 * - Panics with `MustNotBeInCollateralAsset` if there is a collateral in borrowing asset.
 * - Panics with `UtilizationCapExceeded` if utilization after borrow is above the limit.
 * 
 */
export async function borrow<R extends ResponseTypes = undefined>({who, asset, amount}: {who: Address, asset: Address, amount: i128}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'borrow',
        args: [((i) => addressToScVal(i))(who),
        ((i) => addressToScVal(i))(asset),
        ((i) => i128ToScVal(i))(amount)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

export async function setPause<R extends ResponseTypes = undefined>({value}: {value: boolean}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'set_pause',
        args: [((i) => xdr.ScVal.scvBool(i))(value)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

export async function paused<R extends ResponseTypes = undefined>(options: {
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
        method: 'paused',
        ...options,
        parseResultXdr: (xdr): boolean => {
            return scValStrToJs(xdr);
        },
    });
}

/**
 * Retrieves the address of the treasury.
 * 
 * # Returns
 * 
 * The address of the treasury.
 * 
 */
export async function treasury<R extends ResponseTypes = undefined>(options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Address`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'treasury',
        ...options,
        parseResultXdr: (xdr): Address => {
            return scValStrToJs(xdr);
        },
    });
}

/**
 * Retrieves the account position info.
 * 
 * # Arguments
 * - who The address for which the position info is getting
 * 
 * # Panics
 * - Panics if position can't be calculated
 * 
 * # Returns
 * 
 * Returns the position info.
 * 
 */
export async function accountPosition<R extends ResponseTypes = undefined>({who}: {who: Address}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<AccountPosition> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'account_position',
        args: [((i) => addressToScVal(i))(who)],
        ...options,
        parseResultXdr: (xdr): Ok<AccountPosition> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Liqudate a bad position with NPV less or equal to 0.
 * The caller (liquidator) covers amount of debt of the user getting liquidated, and receives
 * a proportionally amount of the `collateralAsset` plus a bonus to cover market risk.
 * 
 * # Arguments
 * 
 * - liquidator The caller, that covers debt and take collateral with bonus
 * - who The address of the user whose position will be liquidated
 * - receive_stoken `true` if the liquidators wants to receive the collateral sTokens, `false` if he wants
 * to receive the underlying asset
 */
export async function liquidate<R extends ResponseTypes = undefined>({liquidator, who, receive_stoken}: {liquidator: Address, who: Address, receive_stoken: boolean}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'liquidate',
        args: [((i) => addressToScVal(i))(liquidator),
        ((i) => addressToScVal(i))(who),
        ((i) => xdr.ScVal.scvBool(i))(receive_stoken)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Enables or disables asset for using as collateral.
 * User should not have the debt in asset.
 * If user has debt position it will be checked if position stays good after disabling collateral.
 * 
 * # Arguments
 * - who The address for collateral enabling/disabling
 * - asset The address of underlying asset
 * - use_as_collateral Enable/disable flag
 * 
 * # Errors
 * - UserConfigNotExists
 * - NoReserveExistForAsset
 * - MustNotHaveDebt
 * - Bad position
 * 
 */
export async function setAsCollateral<R extends ResponseTypes = undefined>({who, asset, use_as_collateral}: {who: Address, asset: Address, use_as_collateral: boolean}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'set_as_collateral',
        args: [((i) => addressToScVal(i))(who),
        ((i) => addressToScVal(i))(asset),
        ((i) => xdr.ScVal.scvBool(i))(use_as_collateral)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Retrieves the user configuration.
 * 
 * # Arguments
 * - who The address for which the configuration is getting
 * 
 * # Errors
 * - UserConfigNotExists
 * 
 * # Returns
 * 
 * Returns the user configuration:
 * bitmask where even/odd bits correspond to reserve indexes and indicate whether collateral/borrow is allowed for this reserve.
 * 
 */
export async function userConfiguration<R extends ResponseTypes = undefined>({who}: {who: Address}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<UserConfiguration> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'user_configuration',
        args: [((i) => addressToScVal(i))(who)],
        ...options,
        parseResultXdr: (xdr): Ok<UserConfiguration> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

export async function stokenUnderlyingBalance<R extends ResponseTypes = undefined>({stoken_address}: {stoken_address: Address}, options: {
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
        method: 'stoken_underlying_balance',
        args: [((i) => addressToScVal(i))(stoken_address)],
        ...options,
        parseResultXdr: (xdr): i128 => {
            return scValStrToJs(xdr);
        },
    });
}

export async function setPrice<R extends ResponseTypes = undefined>({_asset, _price}: {_asset: Address, _price: i128}, options: {
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
        method: 'set_price',
        args: [((i) => addressToScVal(i))(_asset),
        ((i) => i128ToScVal(i))(_price)],
        ...options,
        parseResultXdr: () => {},
    });
}

/**
 * Sets the flash loan fee.
 * 
 * # Arguments
 * 
 * - fee - The flash loan fee in base points.
 * 
 * # Panics
 * 
 * - Panics with `Uninitialized` if the admin key is not exist in storage.
 * - Panics if the caller is not the admin.
 * 
 */
export async function setFlashLoanFee<R extends ResponseTypes = undefined>({fee}: {fee: u32}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'set_flash_loan_fee',
        args: [((i) => xdr.ScVal.scvU32(i))(fee)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

/**
 * Retrieves the flash loan fee.
 * 
 * # Returns
 * 
 * Returns the flash loan fee in base points:
 * 
 */
export async function flashLoanFee<R extends ResponseTypes = undefined>(options: {
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
        method: 'flash_loan_fee',
        ...options,
        parseResultXdr: (xdr): u32 => {
            return scValStrToJs(xdr);
        },
    });
}

/**
 * Allows the end-users to borrow the assets within one transaction
 * ensuring the the amount taken + fee is returned.
 * 
 * # Arguments
 * - receiver - The contract address that implements the FlashLoanReceiverTrait
 * and receives the requested assets.
 * - assets - The assets being flash borrowed. If the `borrow` flag is set to true,
 * opens debt for the flash-borrowed amount to the `who` address.
 * - params - An extra information for the receiver.
 * 
 * # Panics
 * 
 */
export async function flashLoan<R extends ResponseTypes = undefined>({who, receiver, loan_assets, params}: {who: Address, receiver: Address, loan_assets: Array<FlashLoanAsset>, params: Buffer}, options: {
  /**
   * The fee to pay for the transaction. Default: 100.
   */
  fee?: number
  /**
   * What type of response to return.
   *
   *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
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
        method: 'flash_loan',
        args: [((i) => addressToScVal(i))(who),
        ((i) => addressToScVal(i))(receiver),
        ((i) => xdr.ScVal.scvVec(i.map((i)=>FlashLoanAssetToXdr(i))))(loan_assets),
        ((i) => xdr.ScVal.scvBytes(i))(params)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

export async function getPrice<R extends ResponseTypes = undefined>({_asset}: {_asset: Address}, options: {
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
        method: 'get_price',
        args: [((i) => addressToScVal(i))(_asset)],
        ...options,
        parseResultXdr: (xdr): i128 => {
            return scValStrToJs(xdr);
        },
    });
}

export interface Asset {
  amount: i128;
  asset: Address;
  premium: i128;
}

function AssetToXdr(asset?: Asset): xdr.ScVal {
    if (!asset) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("amount"), val: ((i)=>i128ToScVal(i))(asset["amount"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("asset"), val: ((i)=>addressToScVal(i))(asset["asset"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("premium"), val: ((i)=>i128ToScVal(i))(asset["premium"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function AssetFromXdr(base64Xdr: string): Asset {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        amount: scValToJs(map.get("amount")) as unknown as i128,
        asset: scValToJs(map.get("asset")) as unknown as Address,
        premium: scValToJs(map.get("premium")) as unknown as i128
    };
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
  is_base_asset: boolean;
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
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("is_base_asset"), val: ((i)=>xdr.ScVal.scvBool(i))(reserveConfiguration["is_base_asset"])}),
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
        is_base_asset: scValToJs(map.get("is_base_asset")) as unknown as boolean,
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

export interface AssetBalance {
  asset: Address;
  balance: i128;
}

function AssetBalanceToXdr(assetBalance?: AssetBalance): xdr.ScVal {
    if (!assetBalance) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("asset"), val: ((i)=>addressToScVal(i))(assetBalance["asset"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("balance"), val: ((i)=>i128ToScVal(i))(assetBalance["balance"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function AssetBalanceFromXdr(base64Xdr: string): AssetBalance {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        asset: scValToJs(map.get("asset")) as unknown as Address,
        balance: scValToJs(map.get("balance")) as unknown as i128
    };
}

export interface FlashLoanAsset {
  amount: i128;
  asset: Address;
  borrow: boolean;
}

function FlashLoanAssetToXdr(flashLoanAsset?: FlashLoanAsset): xdr.ScVal {
    if (!flashLoanAsset) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("amount"), val: ((i)=>i128ToScVal(i))(flashLoanAsset["amount"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("asset"), val: ((i)=>addressToScVal(i))(flashLoanAsset["asset"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("borrow"), val: ((i)=>xdr.ScVal.scvBool(i))(flashLoanAsset["borrow"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function FlashLoanAssetFromXdr(base64Xdr: string): FlashLoanAsset {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        amount: scValToJs(map.get("amount")) as unknown as i128,
        asset: scValToJs(map.get("asset")) as unknown as Address,
        borrow: scValToJs(map.get("borrow")) as unknown as boolean
    };
}

/**
 * Price data for an asset at a specific timestamp
 */
export interface PriceData {
  price: i128;
  timestamp: u64;
}

function PriceDataToXdr(priceData?: PriceData): xdr.ScVal {
    if (!priceData) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("price"), val: ((i)=>i128ToScVal(i))(priceData["price"])}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("timestamp"), val: ((i)=>xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(priceData["timestamp"])})
        ];
    return xdr.ScVal.scvMap(arr);
}


function PriceDataFromXdr(base64Xdr: string): PriceData {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        price: scValToJs(map.get("price")) as unknown as i128,
        timestamp: scValToJs(map.get("timestamp")) as unknown as u64
    };
}

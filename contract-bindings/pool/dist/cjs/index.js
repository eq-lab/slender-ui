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
exports.getPrice = exports.flashLoan = exports.flashLoanFee = exports.setFlashLoanFee = exports.setPrice = exports.stokenUnderlyingBalance = exports.userConfiguration = exports.setAsCollateral = exports.liquidate = exports.accountPosition = exports.treasury = exports.paused = exports.setPause = exports.borrow = exports.withdraw = exports.finalizeTransfer = exports.repay = exports.deposit = exports.priceFeed = exports.setPriceFeed = exports.debtCoeff = exports.collatCoeff = exports.getReserve = exports.configureAsCollateral = exports.enableBorrowingOnReserve = exports.irParams = exports.setIrParams = exports.setReserveStatus = exports.initReserve = exports.version = exports.upgradeDebtToken = exports.upgradeSToken = exports.upgrade = exports.initialize = exports.Err = exports.Ok = void 0;
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
function DataKeyToXdr(dataKey) {
    if (!dataKey) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (dataKey.tag) {
        case "Admin":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Admin"));
            break;
        case "ReserveAssetKey":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("ReserveAssetKey"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(dataKey.values[0]));
            break;
        case "Reserves":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Reserves"));
            break;
        case "Treasury":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Treasury"));
            break;
        case "IRParams":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("IRParams"));
            break;
        case "UserConfig":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("UserConfig"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(dataKey.values[0]));
            break;
        case "PriceFeed":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("PriceFeed"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(dataKey.values[0]));
            break;
        case "Pause":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Pause"));
            break;
        case "FlashLoanFee":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("FlashLoanFee"));
            break;
        case "STokenUnderlyingBalance":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("STokenUnderlyingBalance"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(dataKey.values[0]));
            break;
        case "TokenBalance":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("TokenBalance"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(dataKey.values[0]));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(dataKey.values[1]));
            break;
        case "TokenSupply":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("TokenSupply"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(dataKey.values[0]));
            break;
        case "Price":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Price"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(dataKey.values[0]));
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
function LiquidationCollateralToXdr(liquidationCollateral) {
    if (!liquidationCollateral) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("asset"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(liquidationCollateral["asset"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("asset_price"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(liquidationCollateral["asset_price"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("collat_coeff"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(liquidationCollateral["collat_coeff"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("reserve_data"), val: ((i) => ReserveDataToXdr(i))(liquidationCollateral["reserve_data"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("s_token_balance"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(liquidationCollateral["s_token_balance"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function LiquidationCollateralFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        asset: (0, convert_js_1.scValToJs)(map.get("asset")),
        asset_price: (0, convert_js_1.scValToJs)(map.get("asset_price")),
        collat_coeff: (0, convert_js_1.scValToJs)(map.get("collat_coeff")),
        reserve_data: (0, convert_js_1.scValToJs)(map.get("reserve_data")),
        s_token_balance: (0, convert_js_1.scValToJs)(map.get("s_token_balance"))
    };
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
async function initialize({ admin, treasury, flash_loan_fee, ir_params }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'initialize',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(admin),
            ((i) => (0, convert_js_1.addressToScVal)(i))(treasury),
            ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(flash_loan_fee),
            ((i) => IRParamsToXdr(i))(ir_params)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
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
 * - Panics with `Uninitialized` if the admin key is not exist in storage.
 * - Panics if the caller is not the admin.
 *
 */
async function upgrade({ new_wasm_hash }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'upgrade',
        args: [((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(new_wasm_hash)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.upgrade = upgrade;
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
async function upgradeSToken({ asset, new_wasm_hash }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'upgrade_s_token',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(new_wasm_hash)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.upgradeSToken = upgradeSToken;
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
async function upgradeDebtToken({ asset, new_wasm_hash }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'upgrade_debt_token',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(new_wasm_hash)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.upgradeDebtToken = upgradeDebtToken;
/**
 * Returns the current version of the contract.
 */
async function version(options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'version',
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.version = version;
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
async function initReserve({ asset, input }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'init_reserve',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => InitReserveInputToXdr(i))(input)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.initReserve = initReserve;
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
async function setReserveStatus({ asset, is_active }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'set_reserve_status',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(is_active)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.setReserveStatus = setReserveStatus;
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
async function setIrParams({ input }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'set_ir_params',
        args: [((i) => IRParamsToXdr(i))(input)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.setIrParams = setIrParams;
/**
 * Retrieves the interest rate parameters.
 *
 * # Returns
 *
 * Returns the interest rate parameters if set, or None otherwise.
 *
 */
async function irParams(options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'ir_params',
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.irParams = irParams;
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
async function enableBorrowingOnReserve({ asset, enabled }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'enable_borrowing_on_reserve',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(enabled)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.enableBorrowingOnReserve = enableBorrowingOnReserve;
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
async function configureAsCollateral({ asset, params }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'configure_as_collateral',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => CollateralParamsInputToXdr(i))(params)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.configureAsCollateral = configureAsCollateral;
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
async function getReserve({ asset }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'get_reserve',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset)],
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.getReserve = getReserve;
/**
 * Returns collateral coefficient corrected on current time expressed as inner value of FixedI128
 *
 * # Arguments
 *
 * - asset - The address of underlying asset
 */
async function collatCoeff({ asset }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'collat_coeff',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.collatCoeff = collatCoeff;
/**
 * Returns debt coefficient corrected on current time expressed as inner value of FixedI128.
 * The same as borrower accrued rate
 *
 * # Arguments
 *
 * - asset - The address of underlying asset
 */
async function debtCoeff({ asset }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'debt_coeff',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.debtCoeff = debtCoeff;
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
async function setPriceFeed({ feed, assets }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'set_price_feed',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(feed),
            ((i) => soroban_client_1.xdr.ScVal.scvVec(i.map((i) => (0, convert_js_1.addressToScVal)(i))))(assets)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.setPriceFeed = setPriceFeed;
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
async function priceFeed({ asset }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'price_feed',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset)],
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.priceFeed = priceFeed;
async function deposit({ who, asset, amount }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'deposit',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(who),
            ((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.deposit = deposit;
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
async function repay({ who, asset, amount }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'repay',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(who),
            ((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.repay = repay;
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
async function finalizeTransfer({ asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'finalize_transfer',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(balance_from_before),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(balance_to_before),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(s_token_supply)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.finalizeTransfer = finalizeTransfer;
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
async function withdraw({ who, asset, amount, to }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'withdraw',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(who),
            ((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount),
            ((i) => (0, convert_js_1.addressToScVal)(i))(to)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.withdraw = withdraw;
async function borrow({ who, asset, amount }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'borrow',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(who),
            ((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(amount)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.borrow = borrow;
async function setPause({ value }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'set_pause',
        args: [((i) => soroban_client_1.xdr.ScVal.scvBool(i))(value)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.setPause = setPause;
async function paused(options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'paused',
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.paused = paused;
/**
 * Retrieves the address of the treasury.
 *
 * # Returns
 *
 * The address of the treasury.
 *
 */
async function treasury(options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'treasury',
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.treasury = treasury;
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
async function accountPosition({ who }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'account_position',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(who)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.accountPosition = accountPosition;
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
async function liquidate({ liquidator, who, receive_stoken }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'liquidate',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(liquidator),
            ((i) => (0, convert_js_1.addressToScVal)(i))(who),
            ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(receive_stoken)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.liquidate = liquidate;
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
async function setAsCollateral({ who, asset, use_as_collateral }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'set_as_collateral',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(who),
            ((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(use_as_collateral)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.setAsCollateral = setAsCollateral;
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
async function userConfiguration({ who }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'user_configuration',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(who)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.userConfiguration = userConfiguration;
async function stokenUnderlyingBalance({ stoken_address }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'stoken_underlying_balance',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(stoken_address)],
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.stokenUnderlyingBalance = stokenUnderlyingBalance;
async function setPrice({ asset, price }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'set_price',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(price)],
        ...options,
        parseResultXdr: () => { },
    });
}
exports.setPrice = setPrice;
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
async function setFlashLoanFee({ fee }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'set_flash_loan_fee',
        args: [((i) => soroban_client_1.xdr.ScVal.scvU32(i))(fee)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.setFlashLoanFee = setFlashLoanFee;
/**
 * Retrieves the flash loan fee.
 *
 * # Returns
 *
 * Returns the flash loan fee in base points:
 *
 */
async function flashLoanFee(options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'flash_loan_fee',
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.flashLoanFee = flashLoanFee;
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
async function flashLoan({ who, receiver, loan_assets, params }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'flash_loan',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(who),
            ((i) => (0, convert_js_1.addressToScVal)(i))(receiver),
            ((i) => soroban_client_1.xdr.ScVal.scvVec(i.map((i) => FlashLoanAssetToXdr(i))))(loan_assets),
            ((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(params)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
exports.flashLoan = flashLoan;
async function getPrice({ asset }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'get_price',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(asset)],
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.getPrice = getPrice;
function AssetToXdr(asset) {
    if (!asset) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("amount"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(asset["amount"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("asset"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(asset["asset"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("premium"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(asset["premium"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function AssetFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        amount: (0, convert_js_1.scValToJs)(map.get("amount")),
        asset: (0, convert_js_1.scValToJs)(map.get("asset")),
        premium: (0, convert_js_1.scValToJs)(map.get("premium"))
    };
}
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
function AssetBalanceToXdr(assetBalance) {
    if (!assetBalance) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("asset"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(assetBalance["asset"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("balance"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(assetBalance["balance"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function AssetBalanceFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        asset: (0, convert_js_1.scValToJs)(map.get("asset")),
        balance: (0, convert_js_1.scValToJs)(map.get("balance"))
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
function FlashLoanAssetToXdr(flashLoanAsset) {
    if (!flashLoanAsset) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("amount"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(flashLoanAsset["amount"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("asset"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(flashLoanAsset["asset"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("borrow"), val: ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(flashLoanAsset["borrow"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function FlashLoanAssetFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        amount: (0, convert_js_1.scValToJs)(map.get("amount")),
        asset: (0, convert_js_1.scValToJs)(map.get("asset")),
        borrow: (0, convert_js_1.scValToJs)(map.get("borrow"))
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
function MintBurnToXdr(mintBurn) {
    if (!mintBurn) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("asset_balance"), val: ((i) => AssetBalanceToXdr(i))(mintBurn["asset_balance"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("mint"), val: ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(mintBurn["mint"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("who"), val: ((i) => (0, convert_js_1.addressToScVal)(i))(mintBurn["who"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function MintBurnFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        asset_balance: (0, convert_js_1.scValToJs)(map.get("asset_balance")),
        mint: (0, convert_js_1.scValToJs)(map.get("mint")),
        who: (0, convert_js_1.scValToJs)(map.get("who"))
    };
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
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("is_base_asset"), val: ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(reserveConfiguration["is_base_asset"]) }),
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
        is_base_asset: (0, convert_js_1.scValToJs)(map.get("is_base_asset")),
        liq_bonus: (0, convert_js_1.scValToJs)(map.get("liq_bonus")),
        liq_cap: (0, convert_js_1.scValToJs)(map.get("liq_cap")),
        util_cap: (0, convert_js_1.scValToJs)(map.get("util_cap"))
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
function PriceDataToXdr(priceData) {
    if (!priceData) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("price"), val: ((i) => (0, convert_js_1.i128ToScVal)(i))(priceData["price"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("timestamp"), val: ((i) => soroban_client_1.xdr.ScVal.scvU64(soroban_client_1.xdr.Uint64.fromString(i.toString())))(priceData["timestamp"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function PriceDataFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        price: (0, convert_js_1.scValToJs)(map.get("price")),
        timestamp: (0, convert_js_1.scValToJs)(map.get("timestamp"))
    };
}

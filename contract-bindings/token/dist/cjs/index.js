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
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABAAAAAA",
            "AAAAAAAAAAAAAAAEbWludAAAAAIAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAIY2xhd2JhY2sAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
            "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAJYWxsb3dhbmNlAAAAAAAAAgAAAAAAAAAEZnJvbQAAABMAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAEAAAAL",
            "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABAAAAAA=",
            "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
            "AAAAAAAAAAAAAAARc3BlbmRhYmxlX2JhbGFuY2UAAAAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
            "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
            "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
            "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
            "AAAAAQAAAAAAAAAAAAAAEEFsbG93YW5jZURhdGFLZXkAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAAT",
            "AAAAAQAAAAAAAAAAAAAADkFsbG93YW5jZVZhbHVlAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABA==",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAACUFsbG93YW5jZQAAAAAAAAEAAAfQAAAAEEFsbG93YW5jZURhdGFLZXkAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAAFTm9uY2UAAAAAAAABAAAAEwAAAAEAAAAAAAAABVN0YXRlAAAAAAAAAQAAABMAAAAAAAAAAAAAAAVBZG1pbgAAAA==",
            "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA="
        ]);
    }
    async initialize({ admin, decimal, name, symbol }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", { admin, decimal, name, symbol }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async mint({ to, amount }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'mint',
            args: this.spec.funcArgsToScVals("mint", { to, amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async clawback({ from, amount }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'clawback',
            args: this.spec.funcArgsToScVals("clawback", { from, amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async setAdmin({ new_admin }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'set_admin',
            args: this.spec.funcArgsToScVals("set_admin", { new_admin }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async allowance({ from, spender }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'allowance',
            args: this.spec.funcArgsToScVals("allowance", { from, spender }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("allowance", xdr);
            },
        });
    }
    async approve({ from, spender, amount, expiration_ledger }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'approve',
            args: this.spec.funcArgsToScVals("approve", { from, spender, amount, expiration_ledger }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
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
    async transfer({ from, to, amount }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'transfer',
            args: this.spec.funcArgsToScVals("transfer", { from, to, amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async transferFrom({ spender, from, to, amount }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'transfer_from',
            args: this.spec.funcArgsToScVals("transfer_from", { spender, from, to, amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async burn({ from, amount }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'burn',
            args: this.spec.funcArgsToScVals("burn", { from, amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async burnFrom({ spender, from, amount }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'burn_from',
            args: this.spec.funcArgsToScVals("burn_from", { spender, from, amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
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
}
exports.Contract = Contract;

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
        contractId: "CDIXGNUT7L7FRAPDZSKXPU4UPONE4K2G47NGWJO73IYQ2AKR5JTHULFP",
    }
};
const Errors = {
    0: { message: "" },
    1: { message: "" },
    2: { message: "" },
    3: { message: "" },
    100: { message: "" },
    101: { message: "" },
    102: { message: "" },
    103: { message: "" },
    104: { message: "" },
    105: { message: "" },
    106: { message: "" },
    107: { message: "" },
    200: { message: "" },
    201: { message: "" },
    202: { message: "" },
    203: { message: "" },
    204: { message: "" },
    300: { message: "" },
    301: { message: "" },
    302: { message: "" },
    303: { message: "" },
    304: { message: "" },
    305: { message: "" },
    306: { message: "" },
    307: { message: "" },
    308: { message: "" },
    309: { message: "" },
    310: { message: "" },
    311: { message: "" },
    312: { message: "" },
    313: { message: "" },
    400: { message: "" },
    401: { message: "" },
    402: { message: "" },
    403: { message: "" },
    404: { message: "" },
    500: { message: "" },
    501: { message: "" },
    502: { message: "" }
};
class Contract {
    options;
    spec;
    constructor(options) {
        this.options = options;
        this.spec = new soroban_client_1.ContractSpec([
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAADgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAJQmFzZUFzc2V0AAAAAAAAAAAAAAAAAAAIUmVzZXJ2ZXMAAAABAAAAAAAAAA9SZXNlcnZlQXNzZXRLZXkAAAAAAQAAABMAAAAAAAAAAAAAABZSZXNlcnZlVGltZXN0YW1wV2luZG93AAAAAAAAAAAAAAAAAAhUcmVhc3VyeQAAAAAAAAAAAAAACElSUGFyYW1zAAAAAQAAAAAAAAAKVXNlckNvbmZpZwAAAAAAAQAAABMAAAABAAAAAAAAAAlQcmljZUZlZWQAAAAAAAABAAAAEwAAAAAAAAAAAAAABVBhdXNlAAAAAAAAAAAAAAAAAAAMRmxhc2hMb2FuRmVlAAAAAQAAAAAAAAAXU1Rva2VuVW5kZXJseWluZ0JhbGFuY2UAAAAAAQAAABMAAAABAAAAAAAAAAtUb2tlblN1cHBseQAAAAABAAAAEwAAAAEAAAAAAAAADFRva2VuQmFsYW5jZQAAAAIAAAATAAAAEw==",
            "AAAAAQAAAAAAAAAAAAAAFUxpcXVpZGF0aW9uQ29sbGF0ZXJhbAAAAAAAAAYAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAMY29sbGF0X2NvZWZmAAAACwAAAAAAAAARY29tcG91bmRlZF9jb2xsYXQAAAAAAAALAAAAAAAAABJpc19sYXN0X2NvbGxhdGVyYWwAAAAAAAEAAAAAAAAADHJlc2VydmVfZGF0YQAAB9AAAAALUmVzZXJ2ZURhdGEAAAAAAAAAAA9zX3Rva2VuX2JhbGFuY2UAAAAACw==",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAh0cmVhc3VyeQAAABMAAAAAAAAADmZsYXNoX2xvYW5fZmVlAAAAAAAEAAAAAAAAAAlpcl9wYXJhbXMAAAAAAAfQAAAACElSUGFyYW1zAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
            "AAAAAAAAAAAAAAAPdXBncmFkZV9zX3Rva2VuAAAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAANbmV3X3dhc21faGFzaAAAAAAAA+4AAAAgAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAASdXBncmFkZV9kZWJ0X3Rva2VuAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAADW5ld193YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAAAAAAAAAAAAAHdmVyc2lvbgAAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAMaW5pdF9yZXNlcnZlAAAAAgAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAVpbnB1dAAAAAAAB9AAAAAQSW5pdFJlc2VydmVJbnB1dAAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAAAAAAAAAAAAASc2V0X3Jlc2VydmVfc3RhdHVzAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAACWlzX2FjdGl2ZQAAAAAAAAEAAAABAAAD6QAAA+0AAAAAAAAAAw==",
            "AAAAAAAAAAAAAAANc2V0X2lyX3BhcmFtcwAAAAAAAAEAAAAAAAAABWlucHV0AAAAAAAH0AAAAAhJUlBhcmFtcwAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAAAAAAAAAAAAAYcmVzZXJ2ZV90aW1lc3RhbXBfd2luZG93AAAAAAAAAAEAAAAG",
            "AAAAAAAAAAAAAAAcc2V0X3Jlc2VydmVfdGltZXN0YW1wX3dpbmRvdwAAAAEAAAAAAAAABndpbmRvdwAAAAAABgAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAAAAAAAAAAAAAJaXJfcGFyYW1zAAAAAAAAAAAAAAEAAAPoAAAH0AAAAAhJUlBhcmFtcw==",
            "AAAAAAAAAAAAAAAbZW5hYmxlX2JvcnJvd2luZ19vbl9yZXNlcnZlAAAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAHZW5hYmxlZAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAAXY29uZmlndXJlX2FzX2NvbGxhdGVyYWwAAAAAAgAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZwYXJhbXMAAAAAB9AAAAAVQ29sbGF0ZXJhbFBhcmFtc0lucHV0AAAAAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAALZ2V0X3Jlc2VydmUAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+gAAAfQAAAAC1Jlc2VydmVEYXRhAA==",
            "AAAAAAAAAAAAAAAMY29sbGF0X2NvZWZmAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+kAAAALAAAAAw==",
            "AAAAAAAAAAAAAAAKZGVidF9jb2VmZgAAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+kAAAALAAAAAw==",
            "AAAAAAAAAAAAAAAKYmFzZV9hc3NldAAAAAAAAAAAAAEAAAPpAAAH0AAAAA9CYXNlQXNzZXRDb25maWcAAAAAAw==",
            "AAAAAAAAAAAAAAAOc2V0X2Jhc2VfYXNzZXQAAAAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAIZGVjaW1hbHMAAAAEAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAAOc2V0X3ByaWNlX2ZlZWQAAAAAAAEAAAAAAAAABmlucHV0cwAAAAAD6gAAB9AAAAAOUHJpY2VGZWVkSW5wdXQAAAAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAAAAAAAAAAAAAKcHJpY2VfZmVlZAAAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAQAAA+gAAAfQAAAAD1ByaWNlRmVlZENvbmZpZwA=",
            "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
            "AAAAAAAAAAAAAAAFcmVwYXkAAAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
            "AAAAAAAAAAAAAAARZmluYWxpemVfdHJhbnNmZXIAAAAAAAAHAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAABNiYWxhbmNlX2Zyb21fYmVmb3JlAAAAAAsAAAAAAAAAEWJhbGFuY2VfdG9fYmVmb3JlAAAAAAAACwAAAAAAAAAOc190b2tlbl9zdXBwbHkAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
            "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAEAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAnRvAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAAGYm9ycm93AAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
            "AAAAAAAAAAAAAAAJc2V0X3BhdXNlAAAAAAAAAQAAAAAAAAAFdmFsdWUAAAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAAGcGF1c2VkAAAAAAAAAAAAAQAAAAE=",
            "AAAAAAAAAAAAAAAIdHJlYXN1cnkAAAAAAAAAAQAAABM=",
            "AAAAAAAAAAAAAAAQYWNjb3VudF9wb3NpdGlvbgAAAAEAAAAAAAAAA3dobwAAAAATAAAAAQAAA+kAAAfQAAAAD0FjY291bnRQb3NpdGlvbgAAAAAD",
            "AAAAAAAAAAAAAAAJbGlxdWlkYXRlAAAAAAAABAAAAAAAAAAKbGlxdWlkYXRvcgAAAAAAEwAAAAAAAAADd2hvAAAAABMAAAAAAAAACmRlYnRfYXNzZXQAAAAAABMAAAAAAAAADnJlY2VpdmVfc3Rva2VuAAAAAAABAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAARc2V0X2FzX2NvbGxhdGVyYWwAAAAAAAADAAAAAAAAAAN3aG8AAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAABF1c2VfYXNfY29sbGF0ZXJhbAAAAAAAAAEAAAABAAAD6QAAA+0AAAAAAAAAAw==",
            "AAAAAAAAAAAAAAASdXNlcl9jb25maWd1cmF0aW9uAAAAAAABAAAAAAAAAAN3aG8AAAAAEwAAAAEAAAPpAAAH0AAAABFVc2VyQ29uZmlndXJhdGlvbgAAAAAAAAM=",
            "AAAAAAAAAAAAAAAZc3Rva2VuX3VuZGVybHlpbmdfYmFsYW5jZQAAAAAAAAEAAAAAAAAADnN0b2tlbl9hZGRyZXNzAAAAAAATAAAAAQAAAAs=",
            "AAAAAAAAAAAAAAANdG9rZW5fYmFsYW5jZQAAAAAAAAIAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAs=",
            "AAAAAAAAAAAAAAASdG9rZW5fdG90YWxfc3VwcGx5AAAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAACw==",
            "AAAAAAAAAAAAAAASc2V0X2ZsYXNoX2xvYW5fZmVlAAAAAAABAAAAAAAAAANmZWUAAAAABAAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAAAAAAAAAAAAAOZmxhc2hfbG9hbl9mZWUAAAAAAAAAAAABAAAABA==",
            "AAAAAAAAAAAAAAAKZmxhc2hfbG9hbgAAAAAABAAAAAAAAAADd2hvAAAAABMAAAAAAAAACHJlY2VpdmVyAAAAEwAAAAAAAAALbG9hbl9hc3NldHMAAAAD6gAAB9AAAAAORmxhc2hMb2FuQXNzZXQAAAAAAAAAAAAGcGFyYW1zAAAAAAAOAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAQAAAAAAAAAAAAAABUFzc2V0AAAAAAAABAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABmJvcnJvdwAAAAAAAQAAAAAAAAAHcHJlbWl1bQAAAAAL",
            "AAAAAQAAAAAAAAAAAAAAD0FjY291bnRQb3NpdGlvbgAAAAADAAAAAAAAAARkZWJ0AAAACwAAAAAAAAAVZGlzY291bnRlZF9jb2xsYXRlcmFsAAAAAAAACwAAAAAAAAADbnB2AAAAAAs=",
            "AAAAAQAAAAAAAAAAAAAADEFzc2V0QmFsYW5jZQAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAHYmFsYW5jZQAAAAAL",
            "AAAAAQAAAAAAAAAAAAAAD0Jhc2VBc3NldENvbmZpZwAAAAACAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAACGRlY2ltYWxzAAAABA==",
            "AAAAAQAAABxDb2xsYXRlcmFsaXphdGlvbiBwYXJhbWV0ZXJzAAAAAAAAABVDb2xsYXRlcmFsUGFyYW1zSW5wdXQAAAAAAAAEAAAAaFNwZWNpZmllcyB3aGF0IGZyYWN0aW9uIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGNvdW50cyB0b3dhcmQKdGhlIHBvcnRmb2xpbyBjb2xsYXRlcmFsIHZhbHVlIFswJSwgMTAwJV0uAAAACGRpc2NvdW50AAAABAAAAJRUaGUgYm9udXMgbGlxdWlkYXRvcnMgcmVjZWl2ZSB0byBsaXF1aWRhdGUgdGhpcyBhc3NldC4gVGhlIHZhbHVlcyBpcyBhbHdheXMgYWJvdmUgMTAwJS4gQSB2YWx1ZSBvZiAxMDUlIG1lYW5zIHRoZSBsaXF1aWRhdG9yIHdpbGwgcmVjZWl2ZSBhIDUlIGJvbnVzAAAACWxpcV9ib251cwAAAAAAAAQAAABCVGhlIHRvdGFsIGFtb3VudCBvZiBhbiBhc3NldCB0aGUgcHJvdG9jb2wgYWNjZXB0cyBpbnRvIHRoZSBtYXJrZXQuAAAAAAAHbGlxX2NhcAAAAAALAAAAAAAAAAh1dGlsX2NhcAAAAAQ=",
            "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAJwAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAAAAAAAAAAAAA1VbmluaXRpYWxpemVkAAAAAAAAAQAAAAAAAAALTm9QcmljZUZlZWQAAAAAAgAAAAAAAAAGUGF1c2VkAAAAAAADAAAAAAAAABZOb1Jlc2VydmVFeGlzdEZvckFzc2V0AAAAAABkAAAAAAAAAA9Ob0FjdGl2ZVJlc2VydmUAAAAAZQAAAAAAAAANUmVzZXJ2ZUZyb3plbgAAAAAAAGYAAAAAAAAAG1Jlc2VydmVzTWF4Q2FwYWNpdHlFeGNlZWRlZAAAAABnAAAAAAAAAA9Ob1ByaWNlRm9yQXNzZXQAAAAAaAAAAAAAAAAZUmVzZXJ2ZUFscmVhZHlJbml0aWFsaXplZAAAAAAAAGkAAAAAAAAAEUludmFsaWRBc3NldFByaWNlAAAAAAAAagAAAAAAAAAXQmFzZUFzc2V0Tm90SW5pdGlhbGl6ZWQAAAAAawAAAAAAAAAWVXNlckNvbmZpZ0ludmFsaWRJbmRleAAAAAAAyAAAAAAAAAAdTm90RW5vdWdoQXZhaWxhYmxlVXNlckJhbGFuY2UAAAAAAADJAAAAAAAAABNVc2VyQ29uZmlnTm90RXhpc3RzAAAAAMoAAAAAAAAADE11c3RIYXZlRGVidAAAAMsAAAAAAAAAD011c3ROb3RIYXZlRGVidAAAAADMAAAAAAAAABNCb3Jyb3dpbmdOb3RFbmFibGVkAAAAASwAAAAAAAAAG0NvbGxhdGVyYWxOb3RDb3Zlck5ld0JvcnJvdwAAAAEtAAAAAAAAAAtCYWRQb3NpdGlvbgAAAAEuAAAAAAAAAAxHb29kUG9zaXRpb24AAAEvAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAABMAAAAAAAAAAXVmFsaWRhdGVCb3Jyb3dNYXRoRXJyb3IAAAABMQAAAAAAAAAYQ2FsY0FjY291bnREYXRhTWF0aEVycm9yAAABMgAAAAAAAAATQXNzZXRQcmljZU1hdGhFcnJvcgAAAAEzAAAAAAAAABNOb3RFbm91Z2hDb2xsYXRlcmFsAAAAATQAAAAAAAAAEkxpcXVpZGF0ZU1hdGhFcnJvcgAAAAABNQAAAAAAAAAaTXVzdE5vdEJlSW5Db2xsYXRlcmFsQXNzZXQAAAAAATYAAAAAAAAAFlV0aWxpemF0aW9uQ2FwRXhjZWVkZWQAAAAAATcAAAAAAAAADkxpcUNhcEV4Y2VlZGVkAAAAAAE4AAAAAAAAABZGbGFzaExvYW5SZWNlaXZlckVycm9yAAAAAAE5AAAAAAAAABFNYXRoT3ZlcmZsb3dFcnJvcgAAAAAAAZAAAAAAAAAAGU11c3RCZUx0ZVBlcmNlbnRhZ2VGYWN0b3IAAAAAAAGRAAAAAAAAABhNdXN0QmVMdFBlcmNlbnRhZ2VGYWN0b3IAAAGSAAAAAAAAABhNdXN0QmVHdFBlcmNlbnRhZ2VGYWN0b3IAAAGTAAAAAAAAAA5NdXN0QmVQb3NpdGl2ZQAAAAABlAAAAAAAAAAUQWNjcnVlZFJhdGVNYXRoRXJyb3IAAAH0AAAAAAAAABhDb2xsYXRlcmFsQ29lZmZNYXRoRXJyb3IAAAH1AAAAAAAAABJEZWJ0Q29lZmZNYXRoRXJyb3IAAAAAAfY=",
            "AAAAAQAAAAAAAAAAAAAADkZsYXNoTG9hbkFzc2V0AAAAAAADAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAGYm9ycm93AAAAAAAB",
            "AAAAAQAAAAAAAAAAAAAAEEluaXRSZXNlcnZlSW5wdXQAAAACAAAAAAAAABJkZWJ0X3Rva2VuX2FkZHJlc3MAAAAAABMAAAAAAAAAD3NfdG9rZW5fYWRkcmVzcwAAAAAT",
            "AAAAAQAAABhJbnRlcmVzdCByYXRlIHBhcmFtZXRlcnMAAAAAAAAACElSUGFyYW1zAAAABAAAAAAAAAAFYWxwaGEAAAAAAAAEAAAAAAAAAAxpbml0aWFsX3JhdGUAAAAEAAAAAAAAAAhtYXhfcmF0ZQAAAAQAAAAAAAAADXNjYWxpbmdfY29lZmYAAAAAAAAE",
            "AAAAAQAAAAAAAAAAAAAAD1ByaWNlRmVlZENvbmZpZwAAAAADAAAAAAAAAA5hc3NldF9kZWNpbWFscwAAAAAABAAAAAAAAAAEZmVlZAAAABMAAAAAAAAADWZlZWRfZGVjaW1hbHMAAAAAAAAE",
            "AAAAAQAAAAAAAAAAAAAADlByaWNlRmVlZElucHV0AAAAAAAEAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAADmFzc2V0X2RlY2ltYWxzAAAAAAAEAAAAAAAAAARmZWVkAAAAEwAAAAAAAAANZmVlZF9kZWNpbWFscwAAAAAAAAQ=",
            "AAAAAQAAAAAAAAAAAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAABgAAAAAAAAARYm9ycm93aW5nX2VuYWJsZWQAAAAAAAABAAAAaFNwZWNpZmllcyB3aGF0IGZyYWN0aW9uIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGNvdW50cyB0b3dhcmQKdGhlIHBvcnRmb2xpbyBjb2xsYXRlcmFsIHZhbHVlIFswJSwgMTAwJV0uAAAACGRpc2NvdW50AAAABAAAAAAAAAAJaXNfYWN0aXZlAAAAAAAAAQAAAAAAAAAJbGlxX2JvbnVzAAAAAAAABAAAAAAAAAAHbGlxX2NhcAAAAAALAAAAAAAAAAh1dGlsX2NhcAAAAAQ=",
            "AAAAAQAAAAAAAAAAAAAAC1Jlc2VydmVEYXRhAAAAAAkAAAAAAAAAC2JvcnJvd2VyX2FyAAAAAAsAAAAAAAAAC2JvcnJvd2VyX2lyAAAAAAsAAAAAAAAADWNvbmZpZ3VyYXRpb24AAAAAAAfQAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAAAAAAABJkZWJ0X3Rva2VuX2FkZHJlc3MAAAAAABMAAABEVGhlIGlkIG9mIHRoZSByZXNlcnZlIChwb3NpdGlvbiBpbiB0aGUgbGlzdCBvZiB0aGUgYWN0aXZlIHJlc2VydmVzKS4AAAACaWQAAAAAA+4AAAABAAAAAAAAABVsYXN0X3VwZGF0ZV90aW1lc3RhbXAAAAAAAAAGAAAAAAAAAAlsZW5kZXJfYXIAAAAAAAALAAAAAAAAAAlsZW5kZXJfaXIAAAAAAAALAAAAAAAAAA9zX3Rva2VuX2FkZHJlc3MAAAAAEw==",
            "AAAAAQAAAH9JbXBsZW1lbnRzIHRoZSBiaXRtYXAgbG9naWMgdG8gaGFuZGxlIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24uCkV2ZW4gcG9zaXRpb25zIGlzIGNvbGxhdGVyYWwgZmxhZ3MgYW5kIHVuZXZlbiBpcyBib3Jyb3dpbmcgZmxhZ3MuAAAAAAAAAAARVXNlckNvbmZpZ3VyYXRpb24AAAAAAAABAAAAAAAAAAEwAAAAAAAACg==",
            "AAAAAQAAAC9QcmljZSBkYXRhIGZvciBhbiBhc3NldCBhdCBhIHNwZWNpZmljIHRpbWVzdGFtcAAAAAAAAAAACVByaWNlRGF0YQAAAAAAAAIAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg=="
        ]);
    }
    async initialize({ admin, treasury, flash_loan_fee, ir_params }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'initialize',
                args: this.spec.funcArgsToScVals("initialize", { admin, treasury, flash_loan_fee, ir_params }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("initialize", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async upgrade({ new_wasm_hash }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'upgrade',
                args: this.spec.funcArgsToScVals("upgrade", { new_wasm_hash }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("upgrade", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async upgradeSToken({ asset, new_wasm_hash }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'upgrade_s_token',
                args: this.spec.funcArgsToScVals("upgrade_s_token", { asset, new_wasm_hash }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("upgrade_s_token", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async upgradeDebtToken({ asset, new_wasm_hash }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'upgrade_debt_token',
                args: this.spec.funcArgsToScVals("upgrade_debt_token", { asset, new_wasm_hash }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("upgrade_debt_token", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
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
    async initReserve({ asset, input }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'init_reserve',
                args: this.spec.funcArgsToScVals("init_reserve", { asset, input }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("init_reserve", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async setReserveStatus({ asset, is_active }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'set_reserve_status',
                args: this.spec.funcArgsToScVals("set_reserve_status", { asset, is_active }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("set_reserve_status", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async setIrParams({ input }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'set_ir_params',
                args: this.spec.funcArgsToScVals("set_ir_params", { input }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("set_ir_params", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async reserveTimestampWindow(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'reserve_timestamp_window',
            args: this.spec.funcArgsToScVals("reserve_timestamp_window", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("reserve_timestamp_window", xdr);
            },
        });
    }
    async setReserveTimestampWindow({ window }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'set_reserve_timestamp_window',
                args: this.spec.funcArgsToScVals("set_reserve_timestamp_window", { window }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("set_reserve_timestamp_window", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async irParams(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'ir_params',
            args: this.spec.funcArgsToScVals("ir_params", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("ir_params", xdr);
            },
        });
    }
    async enableBorrowingOnReserve({ asset, enabled }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'enable_borrowing_on_reserve',
                args: this.spec.funcArgsToScVals("enable_borrowing_on_reserve", { asset, enabled }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("enable_borrowing_on_reserve", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async configureAsCollateral({ asset, params }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'configure_as_collateral',
                args: this.spec.funcArgsToScVals("configure_as_collateral", { asset, params }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("configure_as_collateral", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async getReserve({ asset }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'get_reserve',
            args: this.spec.funcArgsToScVals("get_reserve", { asset }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("get_reserve", xdr);
            },
        });
    }
    async collatCoeff({ asset }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'collat_coeff',
                args: this.spec.funcArgsToScVals("collat_coeff", { asset }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("collat_coeff", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async debtCoeff({ asset }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'debt_coeff',
                args: this.spec.funcArgsToScVals("debt_coeff", { asset }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("debt_coeff", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async baseAsset(options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'base_asset',
                args: this.spec.funcArgsToScVals("base_asset", {}),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("base_asset", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async setBaseAsset({ asset, decimals }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'set_base_asset',
                args: this.spec.funcArgsToScVals("set_base_asset", { asset, decimals }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("set_base_asset", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async setPriceFeed({ inputs }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'set_price_feed',
                args: this.spec.funcArgsToScVals("set_price_feed", { inputs }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("set_price_feed", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async priceFeed({ asset }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'price_feed',
            args: this.spec.funcArgsToScVals("price_feed", { asset }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("price_feed", xdr);
            },
        });
    }
    async deposit({ who, asset, amount }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'deposit',
                args: this.spec.funcArgsToScVals("deposit", { who, asset, amount }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("deposit", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async repay({ who, asset, amount }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'repay',
                args: this.spec.funcArgsToScVals("repay", { who, asset, amount }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("repay", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async finalizeTransfer({ asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'finalize_transfer',
                args: this.spec.funcArgsToScVals("finalize_transfer", { asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("finalize_transfer", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async withdraw({ who, asset, amount, to }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'withdraw',
                args: this.spec.funcArgsToScVals("withdraw", { who, asset, amount, to }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("withdraw", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async borrow({ who, asset, amount }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'borrow',
                args: this.spec.funcArgsToScVals("borrow", { who, asset, amount }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("borrow", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async setPause({ value }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'set_pause',
                args: this.spec.funcArgsToScVals("set_pause", { value }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("set_pause", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async paused(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'paused',
            args: this.spec.funcArgsToScVals("paused", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("paused", xdr);
            },
        });
    }
    async treasury(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'treasury',
            args: this.spec.funcArgsToScVals("treasury", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("treasury", xdr);
            },
        });
    }
    async accountPosition({ who }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'account_position',
                args: this.spec.funcArgsToScVals("account_position", { who }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("account_position", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async liquidate({ liquidator, who, debt_asset, receive_stoken }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'liquidate',
                args: this.spec.funcArgsToScVals("liquidate", { liquidator, who, debt_asset, receive_stoken }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("liquidate", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async setAsCollateral({ who, asset, use_as_collateral }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'set_as_collateral',
                args: this.spec.funcArgsToScVals("set_as_collateral", { who, asset, use_as_collateral }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("set_as_collateral", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async userConfiguration({ who }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'user_configuration',
                args: this.spec.funcArgsToScVals("user_configuration", { who }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("user_configuration", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async stokenUnderlyingBalance({ stoken_address }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'stoken_underlying_balance',
            args: this.spec.funcArgsToScVals("stoken_underlying_balance", { stoken_address }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("stoken_underlying_balance", xdr);
            },
        });
    }
    async tokenBalance({ token, account }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'token_balance',
            args: this.spec.funcArgsToScVals("token_balance", { token, account }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("token_balance", xdr);
            },
        });
    }
    async tokenTotalSupply({ token }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'token_total_supply',
            args: this.spec.funcArgsToScVals("token_total_supply", { token }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("token_total_supply", xdr);
            },
        });
    }
    async setFlashLoanFee({ fee }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'set_flash_loan_fee',
                args: this.spec.funcArgsToScVals("set_flash_loan_fee", { fee }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("set_flash_loan_fee", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async flashLoanFee(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'flash_loan_fee',
            args: this.spec.funcArgsToScVals("flash_loan_fee", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("flash_loan_fee", xdr);
            },
        });
    }
    async flashLoan({ who, receiver, loan_assets, params }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'flash_loan',
                args: this.spec.funcArgsToScVals("flash_loan", { who, receiver, loan_assets, params }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("flash_loan", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
}
exports.Contract = Contract;

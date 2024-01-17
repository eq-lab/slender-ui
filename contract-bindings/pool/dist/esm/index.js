import { ContractSpec, Address } from 'stellar-sdk';
import { Buffer } from "buffer";
import { AssembledTransaction, Ok, Err } from './assembled-tx.js';
export * from './assembled-tx.js';
export * from './method-options.js';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "CAWOA5OINQDN7BAPPY5TLKEHZP7WDKDC5DWGW72LS5RQSCEE7U65AQMI",
    }
};
/**
    
    */
export const Errors = {
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
export class Contract {
    options;
    spec;
    constructor(options) {
        this.options = options;
        this.spec = new ContractSpec([
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
            "AAAAAQAAAAAAAAAAAAAACUxvYW5Bc3NldAAAAAAAAAQAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAAZib3Jyb3cAAAAAAAEAAAAAAAAAB3ByZW1pdW0AAAAACw==",
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
            "AAAAAQAAAC9QcmljZSBkYXRhIGZvciBhbiBhc3NldCBhdCBhIHNwZWNpZmljIHRpbWVzdGFtcAAAAAAAAAAACVByaWNlRGF0YQAAAAAAAAIAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==",
            "AAAAAgAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAAAEAAAAAAAAAB1N0ZWxsYXIAAAAAAQAAABMAAAABAAAAAAAAAAVPdGhlcgAAAAAAAAEAAAAR"
        ]);
    }
    parsers = {
        initialize: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("initialize", result));
        },
        upgrade: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("upgrade", result));
        },
        upgradeSToken: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("upgrade_s_token", result));
        },
        upgradeDebtToken: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("upgrade_debt_token", result));
        },
        version: (result) => this.spec.funcResToNative("version", result),
        initReserve: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("init_reserve", result));
        },
        setReserveStatus: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("set_reserve_status", result));
        },
        setIrParams: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("set_ir_params", result));
        },
        reserveTimestampWindow: (result) => this.spec.funcResToNative("reserve_timestamp_window", result),
        setReserveTimestampWindow: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("set_reserve_timestamp_window", result));
        },
        irParams: (result) => this.spec.funcResToNative("ir_params", result),
        enableBorrowingOnReserve: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("enable_borrowing_on_reserve", result));
        },
        configureAsCollateral: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("configure_as_collateral", result));
        },
        getReserve: (result) => this.spec.funcResToNative("get_reserve", result),
        collatCoeff: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("collat_coeff", result));
        },
        debtCoeff: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("debt_coeff", result));
        },
        baseAsset: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("base_asset", result));
        },
        setBaseAsset: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("set_base_asset", result));
        },
        setPriceFeed: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("set_price_feed", result));
        },
        priceFeed: (result) => this.spec.funcResToNative("price_feed", result),
        deposit: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("deposit", result));
        },
        repay: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("repay", result));
        },
        finalizeTransfer: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("finalize_transfer", result));
        },
        withdraw: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("withdraw", result));
        },
        borrow: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("borrow", result));
        },
        setPause: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("set_pause", result));
        },
        paused: (result) => this.spec.funcResToNative("paused", result),
        treasury: (result) => this.spec.funcResToNative("treasury", result),
        accountPosition: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("account_position", result));
        },
        liquidate: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("liquidate", result));
        },
        setAsCollateral: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("set_as_collateral", result));
        },
        userConfiguration: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("user_configuration", result));
        },
        stokenUnderlyingBalance: (result) => this.spec.funcResToNative("stoken_underlying_balance", result),
        tokenBalance: (result) => this.spec.funcResToNative("token_balance", result),
        tokenTotalSupply: (result) => this.spec.funcResToNative("token_total_supply", result),
        setFlashLoanFee: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("set_flash_loan_fee", result));
        },
        flashLoanFee: (result) => this.spec.funcResToNative("flash_loan_fee", result),
        flashLoan: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("flash_loan", result));
        }
    };
    txFromJSON = (json) => {
        const { method, ...tx } = JSON.parse(json);
        return AssembledTransaction.fromJSON({
            ...this.options,
            method,
            parseResultXdr: this.parsers[method],
        }, tx);
    };
    fromJSON = {
        initialize: (this.txFromJSON),
        upgrade: (this.txFromJSON),
        upgradeSToken: (this.txFromJSON),
        upgradeDebtToken: (this.txFromJSON),
        version: (this.txFromJSON),
        initReserve: (this.txFromJSON),
        setReserveStatus: (this.txFromJSON),
        setIrParams: (this.txFromJSON),
        reserveTimestampWindow: (this.txFromJSON),
        setReserveTimestampWindow: (this.txFromJSON),
        irParams: (this.txFromJSON),
        enableBorrowingOnReserve: (this.txFromJSON),
        configureAsCollateral: (this.txFromJSON),
        getReserve: (this.txFromJSON),
        collatCoeff: (this.txFromJSON),
        debtCoeff: (this.txFromJSON),
        baseAsset: (this.txFromJSON),
        setBaseAsset: (this.txFromJSON),
        setPriceFeed: (this.txFromJSON),
        priceFeed: (this.txFromJSON),
        deposit: (this.txFromJSON),
        repay: (this.txFromJSON),
        finalizeTransfer: (this.txFromJSON),
        withdraw: (this.txFromJSON),
        borrow: (this.txFromJSON),
        setPause: (this.txFromJSON),
        paused: (this.txFromJSON),
        treasury: (this.txFromJSON),
        accountPosition: (this.txFromJSON),
        liquidate: (this.txFromJSON),
        setAsCollateral: (this.txFromJSON),
        userConfiguration: (this.txFromJSON),
        stokenUnderlyingBalance: (this.txFromJSON),
        tokenBalance: (this.txFromJSON),
        tokenTotalSupply: (this.txFromJSON),
        setFlashLoanFee: (this.txFromJSON),
        flashLoanFee: (this.txFromJSON),
        flashLoan: (this.txFromJSON)
    };
    /**
* Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    initialize = async ({ admin, treasury, flash_loan_fee, ir_params }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", { admin: new Address(admin), treasury: new Address(treasury), flash_loan_fee, ir_params }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['initialize'],
        });
    };
    /**
* Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    upgrade = async ({ new_wasm_hash }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'upgrade',
            args: this.spec.funcArgsToScVals("upgrade", { new_wasm_hash }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['upgrade'],
        });
    };
    /**
* Construct and simulate a upgrade_s_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    upgradeSToken = async ({ asset, new_wasm_hash }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'upgrade_s_token',
            args: this.spec.funcArgsToScVals("upgrade_s_token", { asset: new Address(asset), new_wasm_hash }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['upgradeSToken'],
        });
    };
    /**
* Construct and simulate a upgrade_debt_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    upgradeDebtToken = async ({ asset, new_wasm_hash }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'upgrade_debt_token',
            args: this.spec.funcArgsToScVals("upgrade_debt_token", { asset: new Address(asset), new_wasm_hash }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['upgradeDebtToken'],
        });
    };
    /**
* Construct and simulate a version transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    version = async (options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'version',
            args: this.spec.funcArgsToScVals("version", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['version'],
        });
    };
    /**
* Construct and simulate a init_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    initReserve = async ({ asset, input }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'init_reserve',
            args: this.spec.funcArgsToScVals("init_reserve", { asset: new Address(asset), input }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['initReserve'],
        });
    };
    /**
* Construct and simulate a set_reserve_status transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setReserveStatus = async ({ asset, is_active }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_reserve_status',
            args: this.spec.funcArgsToScVals("set_reserve_status", { asset: new Address(asset), is_active }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setReserveStatus'],
        });
    };
    /**
* Construct and simulate a set_ir_params transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setIrParams = async ({ input }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_ir_params',
            args: this.spec.funcArgsToScVals("set_ir_params", { input }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setIrParams'],
        });
    };
    /**
* Construct and simulate a reserve_timestamp_window transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    reserveTimestampWindow = async (options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'reserve_timestamp_window',
            args: this.spec.funcArgsToScVals("reserve_timestamp_window", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['reserveTimestampWindow'],
        });
    };
    /**
* Construct and simulate a set_reserve_timestamp_window transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setReserveTimestampWindow = async ({ window }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_reserve_timestamp_window',
            args: this.spec.funcArgsToScVals("set_reserve_timestamp_window", { window }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setReserveTimestampWindow'],
        });
    };
    /**
* Construct and simulate a ir_params transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    irParams = async (options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'ir_params',
            args: this.spec.funcArgsToScVals("ir_params", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['irParams'],
        });
    };
    /**
* Construct and simulate a enable_borrowing_on_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    enableBorrowingOnReserve = async ({ asset, enabled }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'enable_borrowing_on_reserve',
            args: this.spec.funcArgsToScVals("enable_borrowing_on_reserve", { asset: new Address(asset), enabled }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['enableBorrowingOnReserve'],
        });
    };
    /**
* Construct and simulate a configure_as_collateral transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    configureAsCollateral = async ({ asset, params }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'configure_as_collateral',
            args: this.spec.funcArgsToScVals("configure_as_collateral", { asset: new Address(asset), params }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['configureAsCollateral'],
        });
    };
    /**
* Construct and simulate a get_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    getReserve = async ({ asset }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'get_reserve',
            args: this.spec.funcArgsToScVals("get_reserve", { asset: new Address(asset) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['getReserve'],
        });
    };
    /**
* Construct and simulate a collat_coeff transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    collatCoeff = async ({ asset }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'collat_coeff',
            args: this.spec.funcArgsToScVals("collat_coeff", { asset: new Address(asset) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['collatCoeff'],
        });
    };
    /**
* Construct and simulate a debt_coeff transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    debtCoeff = async ({ asset }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'debt_coeff',
            args: this.spec.funcArgsToScVals("debt_coeff", { asset: new Address(asset) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['debtCoeff'],
        });
    };
    /**
* Construct and simulate a base_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    baseAsset = async (options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'base_asset',
            args: this.spec.funcArgsToScVals("base_asset", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['baseAsset'],
        });
    };
    /**
* Construct and simulate a set_base_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setBaseAsset = async ({ asset, decimals }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_base_asset',
            args: this.spec.funcArgsToScVals("set_base_asset", { asset: new Address(asset), decimals }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setBaseAsset'],
        });
    };
    /**
* Construct and simulate a set_price_feed transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setPriceFeed = async ({ inputs }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_price_feed',
            args: this.spec.funcArgsToScVals("set_price_feed", { inputs }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setPriceFeed'],
        });
    };
    /**
* Construct and simulate a price_feed transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    priceFeed = async ({ asset }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'price_feed',
            args: this.spec.funcArgsToScVals("price_feed", { asset: new Address(asset) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['priceFeed'],
        });
    };
    /**
* Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    deposit = async ({ who, asset, amount }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'deposit',
            args: this.spec.funcArgsToScVals("deposit", { who: new Address(who), asset: new Address(asset), amount }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['deposit'],
        });
    };
    /**
* Construct and simulate a repay transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    repay = async ({ who, asset, amount }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'repay',
            args: this.spec.funcArgsToScVals("repay", { who: new Address(who), asset: new Address(asset), amount }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['repay'],
        });
    };
    /**
* Construct and simulate a finalize_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    finalizeTransfer = async ({ asset, from, to, amount, balance_from_before, balance_to_before, s_token_supply }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'finalize_transfer',
            args: this.spec.funcArgsToScVals("finalize_transfer", { asset: new Address(asset), from: new Address(from), to: new Address(to), amount, balance_from_before, balance_to_before, s_token_supply }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['finalizeTransfer'],
        });
    };
    /**
* Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    withdraw = async ({ who, asset, amount, to }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'withdraw',
            args: this.spec.funcArgsToScVals("withdraw", { who: new Address(who), asset: new Address(asset), amount, to: new Address(to) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['withdraw'],
        });
    };
    /**
* Construct and simulate a borrow transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    borrow = async ({ who, asset, amount }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'borrow',
            args: this.spec.funcArgsToScVals("borrow", { who: new Address(who), asset: new Address(asset), amount }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['borrow'],
        });
    };
    /**
* Construct and simulate a set_pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setPause = async ({ value }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_pause',
            args: this.spec.funcArgsToScVals("set_pause", { value }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setPause'],
        });
    };
    /**
* Construct and simulate a paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    paused = async (options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'paused',
            args: this.spec.funcArgsToScVals("paused", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['paused'],
        });
    };
    /**
* Construct and simulate a treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    treasury = async (options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'treasury',
            args: this.spec.funcArgsToScVals("treasury", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['treasury'],
        });
    };
    /**
* Construct and simulate a account_position transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    accountPosition = async ({ who }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'account_position',
            args: this.spec.funcArgsToScVals("account_position", { who: new Address(who) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['accountPosition'],
        });
    };
    /**
* Construct and simulate a liquidate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    liquidate = async ({ liquidator, who, debt_asset, receive_stoken }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'liquidate',
            args: this.spec.funcArgsToScVals("liquidate", { liquidator: new Address(liquidator), who: new Address(who), debt_asset: new Address(debt_asset), receive_stoken }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['liquidate'],
        });
    };
    /**
* Construct and simulate a set_as_collateral transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setAsCollateral = async ({ who, asset, use_as_collateral }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_as_collateral',
            args: this.spec.funcArgsToScVals("set_as_collateral", { who: new Address(who), asset: new Address(asset), use_as_collateral }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setAsCollateral'],
        });
    };
    /**
* Construct and simulate a user_configuration transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    userConfiguration = async ({ who }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'user_configuration',
            args: this.spec.funcArgsToScVals("user_configuration", { who: new Address(who) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['userConfiguration'],
        });
    };
    /**
* Construct and simulate a stoken_underlying_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    stokenUnderlyingBalance = async ({ stoken_address }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'stoken_underlying_balance',
            args: this.spec.funcArgsToScVals("stoken_underlying_balance", { stoken_address: new Address(stoken_address) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['stokenUnderlyingBalance'],
        });
    };
    /**
* Construct and simulate a token_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    tokenBalance = async ({ token, account }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'token_balance',
            args: this.spec.funcArgsToScVals("token_balance", { token: new Address(token), account: new Address(account) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['tokenBalance'],
        });
    };
    /**
* Construct and simulate a token_total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    tokenTotalSupply = async ({ token }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'token_total_supply',
            args: this.spec.funcArgsToScVals("token_total_supply", { token: new Address(token) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['tokenTotalSupply'],
        });
    };
    /**
* Construct and simulate a set_flash_loan_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    setFlashLoanFee = async ({ fee }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_flash_loan_fee',
            args: this.spec.funcArgsToScVals("set_flash_loan_fee", { fee }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setFlashLoanFee'],
        });
    };
    /**
* Construct and simulate a flash_loan_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    flashLoanFee = async (options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'flash_loan_fee',
            args: this.spec.funcArgsToScVals("flash_loan_fee", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['flashLoanFee'],
        });
    };
    /**
* Construct and simulate a flash_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    flashLoan = async ({ who, receiver, loan_assets, params }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'flash_loan',
            args: this.spec.funcArgsToScVals("flash_loan", { who: new Address(who), receiver: new Address(receiver), loan_assets, params }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['flashLoan'],
        });
    };
}

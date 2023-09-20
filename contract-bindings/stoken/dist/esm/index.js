import { ContractSpec, Address } from 'soroban-client';
import { Buffer } from "buffer";
import { invoke } from './invoke.js';
export * from './invoke.js';
export * from './method-options.js';
export { Address };
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
export const networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "",
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
            "AAAAAQAAAAAAAAAAAAAADkFsbG93YW5jZVZhbHVlAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABA==",
            "AAAAAQAAAAAAAAAAAAAAEEFsbG93YW5jZURhdGFLZXkAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAAT",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAACUFsbG93YW5jZQAAAAAAAAEAAAfQAAAAEEFsbG93YW5jZURhdGFLZXkAAAAAAAAAAAAAAA9VbmRlcmx5aW5nQXNzZXQA",
            "AAAAAAAAAaVJbml0aWFsaXplcyB0aGUgU3Rva2VuIGNvbnRyYWN0LgoKIyBBcmd1bWVudHMKCi0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSB0b2tlbi4KLSBzeW1ib2wgLSBUaGUgc3ltYm9sIG9mIHRoZSB0b2tlbi4KLSBwb29sIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHBvb2wgY29udHJhY3QuCi0gdW5kZXJseWluZ19hc3NldCAtIFRoZSBhZGRyZXNzIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGFzc29jaWF0ZWQgd2l0aCB0aGUgdG9rZW4uCgojIFBhbmljcwoKUGFuaWNzIHdpdGggaWYgdGhlIHNwZWNpZmllZCBkZWNpbWFsIHZhbHVlIGV4Y2VlZHMgdGhlIG1heGltdW0gdmFsdWUgb2YgdTguClBhbmljcyB3aXRoIGlmIHRoZSBjb250cmFjdCBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkLgpQYW5pY3MgaWYgbmFtZSBvciBzeW1ib2wgaXMgZW1wdHkKAAAAAAAACmluaXRpYWxpemUAAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABAAAAAAAAAABHBvb2wAAAATAAAAAAAAABB1bmRlcmx5aW5nX2Fzc2V0AAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
            "AAAAAAAAAAAAAAAHdmVyc2lvbgAAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAASNSZXR1cm5zIHRoZSBhbW91bnQgb2YgdG9rZW5zIHRoYXQgdGhlIGBzcGVuZGVyYCBpcyBhbGxvd2VkIHRvIHdpdGhkcmF3IGZyb20gdGhlIGBmcm9tYCBhZGRyZXNzLgoKIyBBcmd1bWVudHMKCi0gZnJvbSAtIFRoZSBhZGRyZXNzIG9mIHRoZSB0b2tlbiBvd25lci4KLSBzcGVuZGVyIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHNwZW5kZXIuCgojIFJldHVybnMKClRoZSBhbW91bnQgb2YgdG9rZW5zIHRoYXQgdGhlIGBzcGVuZGVyYCBpcyBhbGxvd2VkIHRvIHdpdGhkcmF3IGZyb20gdGhlIGBmcm9tYCBhZGRyZXNzLgoAAAAACWFsbG93YW5jZQAAAAAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAdzcGVuZGVyAAAAABMAAAABAAAACw==",
            "AAAAAAAAAdlTZXQgdGhlIGFsbG93YW5jZSBmb3IgYSBzcGVuZGVyIHRvIHdpdGhkcmF3IGZyb20gdGhlIGBmcm9tYCBhZGRyZXNzIGJ5IGEgc3BlY2lmaWVkIGFtb3VudCBvZiB0b2tlbnMuCgojIEFyZ3VtZW50cwoKLSBmcm9tIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHRva2VuIG93bmVyLgotIHNwZW5kZXIgLSBUaGUgYWRkcmVzcyBvZiB0aGUgc3BlbmRlci4KLSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBpbmNyZWFzZSB0aGUgYWxsb3dhbmNlIGJ5LgotIGV4cGlyYXRpb25fbGVkZ2VyIC0gVGhlIHRpbWUgd2hlbiBhbGxvd2FuY2Ugd2lsbCBiZSBleHBpcmVkLgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgY2FsbGVyIGlzIG5vdCBhdXRob3JpemVkLgpQYW5pY3MgaWYgdGhlIGFtb3VudCBpcyBuZWdhdGl2ZS4KUGFuaWNzIGlmIHRoZSB1cGRhdGVkIGFsbG93YW5jZSBleGNlZWRzIHRoZSBtYXhpbXVtIHZhbHVlIG9mIGkxMjguCgAAAAAAAAdhcHByb3ZlAAAAAAQAAAAAAAAABGZyb20AAAATAAAAAAAAAAdzcGVuZGVyAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAARZXhwaXJhdGlvbl9sZWRnZXIAAAAAAAAEAAAAAA==",
            "AAAAAAAAAJ9SZXR1cm5zIHRoZSBiYWxhbmNlIG9mIHRva2VucyBmb3IgYSBzcGVjaWZpZWQgYGlkYC4KCiMgQXJndW1lbnRzCgotIGlkIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGFjY291bnQuCgojIFJldHVybnMKClRoZSBiYWxhbmNlIG9mIHRva2VucyBmb3IgdGhlIHNwZWNpZmllZCBgaWRgLgoAAAAAB2JhbGFuY2UAAAAAAQAAAAAAAAACaWQAAAAAABMAAAABAAAACw==",
            "AAAAAAAAANNSZXR1cm5zIHRoZSBzcGVuZGFibGUgYmFsYW5jZSBvZiB0b2tlbnMgZm9yIGEgc3BlY2lmaWVkIGlkLgoKIyBBcmd1bWVudHMKCi0gaWQgLSBUaGUgYWRkcmVzcyBvZiB0aGUgYWNjb3VudC4KCiMgUmV0dXJucwoKVGhlIHNwZW5kYWJsZSBiYWxhbmNlIG9mIHRva2VucyBmb3IgdGhlIHNwZWNpZmllZCBpZC4KCkN1cnJlbnRseSB0aGUgc2FtZSBhcyBgYmFsYW5jZShpZClgAAAAABFzcGVuZGFibGVfYmFsYW5jZQAAAAAAAAEAAAAAAAAAAmlkAAAAAAATAAAAAQAAAAs=",
            "AAAAAAAAALVDaGVja3Mgd2hldGhlciBhIHNwZWNpZmllZCBgaWRgIGlzIGF1dGhvcml6ZWQuCgojIEFyZ3VtZW50cwoKLSBpZCAtIFRoZSBhZGRyZXNzIHRvIGNoZWNrIGZvciBhdXRob3JpemF0aW9uLgoKIyBSZXR1cm5zCgpSZXR1cm5zIHRydWUgaWYgdGhlIGlkIGlzIGF1dGhvcml6ZWQsIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlAAAAAAAACmF1dGhvcml6ZWQAAAAAAAEAAAAAAAAAAmlkAAAAAAATAAAAAQAAAAE=",
            "AAAAAAAAAUpUcmFuc2ZlcnMgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRva2VucyBmcm9tIG9uZSBhY2NvdW50IChgZnJvbWApIHRvIGFub3RoZXIgYWNjb3VudCAoYHRvYCkuCgojIEFyZ3VtZW50cwoKLSBmcm9tIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHRva2VuIHNlbmRlci4KLSB0byAtIFRoZSBhZGRyZXNzIG9mIHRoZSB0b2tlbiByZWNpcGllbnQuCi0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiB0b2tlbnMgdG8gdHJhbnNmZXIuCgojIFBhbmljcwoKUGFuaWNzIGlmIHRoZSBjYWxsZXIgKGBmcm9tYCkgaXMgbm90IGF1dGhvcml6ZWQuClBhbmljcyBpZiB0aGUgYW1vdW50IGlzIG5lZ2F0aXZlLgoAAAAAAAh0cmFuc2ZlcgAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
            "AAAAAAAAAdpUcmFuc2ZlcnMgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRva2VucyBmcm9tIHRoZSBmcm9tIGFjY291bnQgdG8gdGhlIHRvIGFjY291bnQgb24gYmVoYWxmIG9mIHRoZSBzcGVuZGVyIGFjY291bnQuCgojIEFyZ3VtZW50cwoKLSBzcGVuZGVyIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGFjY291bnQgdGhhdCBpcyBhdXRob3JpemVkIHRvIHNwZW5kIHRva2Vucy4KLSBmcm9tIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHRva2VuIHNlbmRlci4KLSB0byAtIFRoZSBhZGRyZXNzIG9mIHRoZSB0b2tlbiByZWNpcGllbnQuCi0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiB0b2tlbnMgdG8gdHJhbnNmZXIuCgojIFBhbmljcwoKUGFuaWNzIGlmIHRoZSBzcGVuZGVyIGlzIG5vdCBhdXRob3JpemVkLgpQYW5pY3MgaWYgdGhlIHNwZW5kZXIgaXMgbm90IGFsbG93ZWQgdG8gc3BlbmQgYGFtb3VudGAuClBhbmljcyBpZiB0aGUgYW1vdW50IGlzIG5lZ2F0aXZlLgoAAAAAAA10cmFuc2Zlcl9mcm9tAAAAAAAABAAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAIX3NwZW5kZXIAAAATAAAAAAAAAAVfZnJvbQAAAAAAABMAAAAAAAAAB19hbW91bnQAAAAACwAAAAA=",
            "AAAAAAAAAURDbGF3YmFja3MgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRva2VucyBmcm9tIHRoZSBmcm9tIGFjY291bnQuCgojIEFyZ3VtZW50cwoKLSBmcm9tIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHRva2VuIGhvbGRlciB0byBjbGF3YmFjayB0b2tlbnMgZnJvbS4KLSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBjbGF3YmFjay4KCiMgUGFuaWNzCgpQYW5pY3MgaWYgdGhlIGFtb3VudCBpcyBuZWdhdGl2ZS4KUGFuaWNzIGlmIHRoZSBjYWxsZXIgaXMgbm90IHRoZSBwb29sIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHRva2VuLgpQYW5pY3MgaWYgb3ZlcmZsb3cgaGFwcGVucwoAAAAIY2xhd2JhY2sAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
            "AAAAAAAAASpTZXRzIHRoZSBhdXRob3JpemF0aW9uIHN0YXR1cyBmb3IgYSBzcGVjaWZpZWQgYGlkYC4KCiMgQXJndW1lbnRzCgotIGlkIC0gVGhlIGFkZHJlc3MgdG8gc2V0IHRoZSBhdXRob3JpemF0aW9uIHN0YXR1cyBmb3IuCi0gYXV0aG9yaXplIC0gQSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0byBhdXRob3JpemUgKHRydWUpIG9yIGRlYXV0aG9yaXplIChmYWxzZSkgdGhlIGlkLgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgY2FsbGVyIGlzIG5vdCB0aGUgcG9vbCBhc3NvY2lhdGVkIHdpdGggdGhpcyB0b2tlbi4KAAAAAAAOc2V0X2F1dGhvcml6ZWQAAAAAAAIAAAAAAAAAAmlkAAAAAAATAAAAAAAAAAlhdXRob3JpemUAAAAAAAABAAAAAA==",
            "AAAAAAAAASVNaW50cyBhIHNwZWNpZmllZCBhbW91bnQgb2YgdG9rZW5zIGZvciBhIGdpdmVuIGBpZGAgYW5kIHJldHVybnMgdG90YWwgc3VwcGx5CgojIEFyZ3VtZW50cwoKLSBpZCAtIFRoZSBhZGRyZXNzIG9mIHRoZSB1c2VyIHRvIG1pbnQgdG9rZW5zIGZvci4KLSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBtaW50LgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgYW1vdW50IGlzIG5lZ2F0aXZlLgpQYW5pY3MgaWYgdGhlIGNhbGxlciBpcyBub3QgdGhlIHBvb2wgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdG9rZW4uCgAAAAAAAARtaW50AAAAAgAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAAblCdXJucyBhIHNwZWNpZmllZCBhbW91bnQgb2YgdG9rZW5zIGZyb20gdGhlIGZyb20gYWNjb3VudCBhbmQgcmV0dXJucyB0b3RhbCBzdXBwbHkKCiMgQXJndW1lbnRzCgotIGZyb20gLSBUaGUgYWRkcmVzcyBvZiB0aGUgdG9rZW4gaG9sZGVyIHRvIGJ1cm4gdG9rZW5zIGZyb20uCi0gYW1vdW50X3RvX2J1cm4gLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBidXJuLgotIGFtb3VudF90b193aXRoZHJhdyAtIFRoZSBhbW91bnQgb2YgdW5kZXJseWluZyB0b2tlbiB0byB3aXRoZHJhdy4KLSB0byAtIFRoZSBhZGRyZXNzIHdobyBhY2NlcHRzIHVuZGVybHlpbmcgdG9rZW4uCgojIFBhbmljcwoKUGFuaWNzIGlmIHRoZSBhbW91bnRfdG9fYnVybiBpcyBuZWdhdGl2ZS4KUGFuaWNzIGlmIHRoZSBjYWxsZXIgaXMgbm90IHRoZSBwb29sIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHRva2VuLgoAAAAAAAAEYnVybgAAAAQAAAAAAAAABGZyb20AAAATAAAAAAAAAA5hbW91bnRfdG9fYnVybgAAAAAACwAAAAAAAAASYW1vdW50X3RvX3dpdGhkcmF3AAAAAAALAAAAAAAAAAJ0bwAAAAAAEwAAAAA=",
            "AAAAAAAAAHRSZXR1cm5zIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgdXNlZCBieSB0aGUgdG9rZW4uCgojIFJldHVybnMKClRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgdXNlZCBieSB0aGUgdG9rZW4uCgAAAAhkZWNpbWFscwAAAAAAAAABAAAABA==",
            "AAAAAAAAAGJSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSB0b2tlbi4KCiMgUmV0dXJucwoKVGhlIG5hbWUgb2YgdGhlIHRva2VuIGFzIGEgYHNvcm9iYW5fc2RrOjpCeXRlc2AgdmFsdWUuCgAAAAAABG5hbWUAAAAAAAAAAQAAABA=",
            "AAAAAAAAAGZSZXR1cm5zIHRoZSBzeW1ib2wgb2YgdGhlIHRva2VuLgoKIyBSZXR1cm5zCgpUaGUgc3ltYm9sIG9mIHRoZSB0b2tlbiBhcyBhIGBzb3JvYmFuX3Nkazo6Qnl0ZXNgIHZhbHVlLgoAAAAAAAZzeW1ib2wAAAAAAAAAAAABAAAAEA==",
            "AAAAAAAAAExSZXR1cm5zIHRoZSB0b3RhbCBzdXBwbHkgb2YgdG9rZW5zLgoKIyBSZXR1cm5zCgpUaGUgdG90YWwgc3VwcGx5IG9mIHRva2Vucy4KAAAADHRvdGFsX3N1cHBseQAAAAAAAAABAAAACw==",
            "AAAAAAAAAN9UcmFuc2ZlcnMgdG9rZW5zIGR1cmluZyBhIGxpcXVpZGF0aW9uLgoKIyBBcmd1bWVudHMKCi0gZnJvbSAtIFRoZSBhZGRyZXNzIG9mIHRoZSBzZW5kZXIuCi0gdG8gLSBUaGUgYWRkcmVzcyBvZiB0aGUgcmVjaXBpZW50LgotIGFtb3VudCAtIFRoZSBhbW91bnQgb2YgdG9rZW5zIHRvIHRyYW5zZmVyLgoKIyBQYW5pY3MKClBhbmljcyBpZiBjYWxsZXIgaXMgbm90IGFzc29jaWF0ZWQgcG9vbC4KAAAAABd0cmFuc2Zlcl9vbl9saXF1aWRhdGlvbgAAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAAPtUcmFuc2ZlcnMgdGhlIHVuZGVybHlpbmcgYXNzZXQgdG8gdGhlIHNwZWNpZmllZCByZWNpcGllbnQuCgojIEFyZ3VtZW50cwoKLSB0byAtIFRoZSBhZGRyZXNzIG9mIHRoZSByZWNpcGllbnQuCi0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiB1bmRlcmx5aW5nIGFzc2V0IHRvIHRyYW5zZmVyLgoKIyBQYW5pY3MKClBhbmljcyBpZiB0aGUgYW1vdW50IGlzIG5lZ2F0aXZlLgpQYW5pY3MgaWYgY2FsbGVyIGlzIG5vdCBhc3NvY2lhdGVkIHBvb2wuCgAAAAAWdHJhbnNmZXJfdW5kZXJseWluZ190bwAAAAAAAgAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAAGBSZXRyaWV2ZXMgdGhlIGFkZHJlc3Mgb2YgdGhlIHVuZGVybHlpbmcgYXNzZXQuCgojIFJldHVybnMKClRoZSBhZGRyZXNzIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0LgoAAAAQdW5kZXJseWluZ19hc3NldAAAAAAAAAABAAAAEw==",
            "AAAAAAAAAFNSZXRyaWV2ZXMgdGhlIGFkZHJlc3Mgb2YgdGhlIHBvb2wuCgojIFJldHVybnMKClRoZSBhZGRyZXNzIG9mIHRoZSBhc3NvY2lhdGVkIHBvb2wuCgAAAAAEcG9vbAAAAAAAAAABAAAAEw==",
            "AAAAAgAAAAAAAAAAAAAADUNvbW1vbkRhdGFLZXkAAAAAAAAEAAAAAQAAAAAAAAAHQmFsYW5jZQAAAAABAAAAEwAAAAEAAAAAAAAABVN0YXRlAAAAAAAAAQAAABMAAAAAAAAAAAAAAARQb29sAAAAAAAAAAAAAAALVG90YWxTdXBwbHkA",
            "AAAAAQAAAAAAAAAAAAAAD0FjY291bnRQb3NpdGlvbgAAAAADAAAAAAAAAARkZWJ0AAAACwAAAAAAAAAVZGlzY291bnRlZF9jb2xsYXRlcmFsAAAAAAAACwAAAAAAAAADbnB2AAAAAAs=",
            "AAAAAQAAAAAAAAAAAAAADEFzc2V0QmFsYW5jZQAAAAIAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAHYmFsYW5jZQAAAAAL",
            "AAAAAQAAABxDb2xsYXRlcmFsaXphdGlvbiBwYXJhbWV0ZXJzAAAAAAAAABVDb2xsYXRlcmFsUGFyYW1zSW5wdXQAAAAAAAAEAAAAaFNwZWNpZmllcyB3aGF0IGZyYWN0aW9uIG9mIHRoZSB1bmRlcmx5aW5nIGFzc2V0IGNvdW50cyB0b3dhcmQKdGhlIHBvcnRmb2xpbyBjb2xsYXRlcmFsIHZhbHVlIFswJSwgMTAwJV0uAAAACGRpc2NvdW50AAAABAAAAJRUaGUgYm9udXMgbGlxdWlkYXRvcnMgcmVjZWl2ZSB0byBsaXF1aWRhdGUgdGhpcyBhc3NldC4gVGhlIHZhbHVlcyBpcyBhbHdheXMgYWJvdmUgMTAwJS4gQSB2YWx1ZSBvZiAxMDUlIG1lYW5zIHRoZSBsaXF1aWRhdG9yIHdpbGwgcmVjZWl2ZSBhIDUlIGJvbnVzAAAACWxpcV9ib251cwAAAAAAAAQAAABCVGhlIHRvdGFsIGFtb3VudCBvZiBhbiBhc3NldCB0aGUgcHJvdG9jb2wgYWNjZXB0cyBpbnRvIHRoZSBtYXJrZXQuAAAAAAAHbGlxX2NhcAAAAAALAAAAAAAAAAh1dGlsX2NhcAAAAAQ=",
            "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAJgAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAAAAAAAAAAAAA1VbmluaXRpYWxpemVkAAAAAAAAAQAAAAAAAAALTm9QcmljZUZlZWQAAAAAAgAAAAAAAAAGUGF1c2VkAAAAAAADAAAAAAAAABZOb1Jlc2VydmVFeGlzdEZvckFzc2V0AAAAAABkAAAAAAAAAA9Ob0FjdGl2ZVJlc2VydmUAAAAAZQAAAAAAAAANUmVzZXJ2ZUZyb3plbgAAAAAAAGYAAAAAAAAAG1Jlc2VydmVzTWF4Q2FwYWNpdHlFeGNlZWRlZAAAAABnAAAAAAAAAA9Ob1ByaWNlRm9yQXNzZXQAAAAAaAAAAAAAAAAZUmVzZXJ2ZUFscmVhZHlJbml0aWFsaXplZAAAAAAAAGkAAAAAAAAAEUludmFsaWRBc3NldFByaWNlAAAAAAAAagAAAAAAAAAWVXNlckNvbmZpZ0ludmFsaWRJbmRleAAAAAAAyAAAAAAAAAAdTm90RW5vdWdoQXZhaWxhYmxlVXNlckJhbGFuY2UAAAAAAADJAAAAAAAAABNVc2VyQ29uZmlnTm90RXhpc3RzAAAAAMoAAAAAAAAADE11c3RIYXZlRGVidAAAAMsAAAAAAAAAD011c3ROb3RIYXZlRGVidAAAAADMAAAAAAAAABNCb3Jyb3dpbmdOb3RFbmFibGVkAAAAASwAAAAAAAAAG0NvbGxhdGVyYWxOb3RDb3Zlck5ld0JvcnJvdwAAAAEtAAAAAAAAAAtCYWRQb3NpdGlvbgAAAAEuAAAAAAAAAAxHb29kUG9zaXRpb24AAAEvAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAABMAAAAAAAAAAXVmFsaWRhdGVCb3Jyb3dNYXRoRXJyb3IAAAABMQAAAAAAAAAYQ2FsY0FjY291bnREYXRhTWF0aEVycm9yAAABMgAAAAAAAAATQXNzZXRQcmljZU1hdGhFcnJvcgAAAAEzAAAAAAAAABNOb3RFbm91Z2hDb2xsYXRlcmFsAAAAATQAAAAAAAAAEkxpcXVpZGF0ZU1hdGhFcnJvcgAAAAABNQAAAAAAAAAaTXVzdE5vdEJlSW5Db2xsYXRlcmFsQXNzZXQAAAAAATYAAAAAAAAAFlV0aWxpemF0aW9uQ2FwRXhjZWVkZWQAAAAAATcAAAAAAAAADkxpcUNhcEV4Y2VlZGVkAAAAAAE4AAAAAAAAABZGbGFzaExvYW5SZWNlaXZlckVycm9yAAAAAAE5AAAAAAAAABFNYXRoT3ZlcmZsb3dFcnJvcgAAAAAAAZAAAAAAAAAAGU11c3RCZUx0ZVBlcmNlbnRhZ2VGYWN0b3IAAAAAAAGRAAAAAAAAABhNdXN0QmVMdFBlcmNlbnRhZ2VGYWN0b3IAAAGSAAAAAAAAABhNdXN0QmVHdFBlcmNlbnRhZ2VGYWN0b3IAAAGTAAAAAAAAAA5NdXN0QmVQb3NpdGl2ZQAAAAABlAAAAAAAAAAUQWNjcnVlZFJhdGVNYXRoRXJyb3IAAAH0AAAAAAAAABhDb2xsYXRlcmFsQ29lZmZNYXRoRXJyb3IAAAH1AAAAAAAAABJEZWJ0Q29lZmZNYXRoRXJyb3IAAAAAAfY=",
            "AAAAAQAAAAAAAAAAAAAADkZsYXNoTG9hbkFzc2V0AAAAAAADAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAABWFzc2V0AAAAAAAAEwAAAAAAAAAGYm9ycm93AAAAAAAB",
            "AAAAAQAAAAAAAAAAAAAAEEluaXRSZXNlcnZlSW5wdXQAAAACAAAAAAAAABJkZWJ0X3Rva2VuX2FkZHJlc3MAAAAAABMAAAAAAAAAD3NfdG9rZW5fYWRkcmVzcwAAAAAT",
            "AAAAAQAAABhJbnRlcmVzdCByYXRlIHBhcmFtZXRlcnMAAAAAAAAACElSUGFyYW1zAAAABAAAAAAAAAAFYWxwaGEAAAAAAAAEAAAAAAAAAAxpbml0aWFsX3JhdGUAAAAEAAAAAAAAAAhtYXhfcmF0ZQAAAAQAAAAAAAAADXNjYWxpbmdfY29lZmYAAAAAAAAE",
            "AAAAAQAAAAAAAAAAAAAACE1pbnRCdXJuAAAAAwAAAAAAAAANYXNzZXRfYmFsYW5jZQAAAAAAB9AAAAAMQXNzZXRCYWxhbmNlAAAAAAAAAARtaW50AAAAAQAAAAAAAAADd2hvAAAAABM=",
            "AAAAAQAAAAAAAAAAAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAACAAAAAAAAAARYm9ycm93aW5nX2VuYWJsZWQAAAAAAAABAAAAAAAAAAhkZWNpbWFscwAAAAQAAABoU3BlY2lmaWVzIHdoYXQgZnJhY3Rpb24gb2YgdGhlIHVuZGVybHlpbmcgYXNzZXQgY291bnRzIHRvd2FyZAp0aGUgcG9ydGZvbGlvIGNvbGxhdGVyYWwgdmFsdWUgWzAlLCAxMDAlXS4AAAAIZGlzY291bnQAAAAEAAAAAAAAAAlpc19hY3RpdmUAAAAAAAABAAAAAAAAAA1pc19iYXNlX2Fzc2V0AAAAAAAAAQAAAAAAAAAJbGlxX2JvbnVzAAAAAAAABAAAAAAAAAAHbGlxX2NhcAAAAAALAAAAAAAAAAh1dGlsX2NhcAAAAAQ=",
            "AAAAAQAAAAAAAAAAAAAAC1Jlc2VydmVEYXRhAAAAAAkAAAAAAAAAC2JvcnJvd2VyX2FyAAAAAAsAAAAAAAAAC2JvcnJvd2VyX2lyAAAAAAsAAAAAAAAADWNvbmZpZ3VyYXRpb24AAAAAAAfQAAAAFFJlc2VydmVDb25maWd1cmF0aW9uAAAAAAAAABJkZWJ0X3Rva2VuX2FkZHJlc3MAAAAAABMAAABEVGhlIGlkIG9mIHRoZSByZXNlcnZlIChwb3NpdGlvbiBpbiB0aGUgbGlzdCBvZiB0aGUgYWN0aXZlIHJlc2VydmVzKS4AAAACaWQAAAAAA+4AAAABAAAAAAAAABVsYXN0X3VwZGF0ZV90aW1lc3RhbXAAAAAAAAAGAAAAAAAAAAlsZW5kZXJfYXIAAAAAAAALAAAAAAAAAAlsZW5kZXJfaXIAAAAAAAALAAAAAAAAAA9zX3Rva2VuX2FkZHJlc3MAAAAAEw==",
            "AAAAAQAAAH9JbXBsZW1lbnRzIHRoZSBiaXRtYXAgbG9naWMgdG8gaGFuZGxlIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24uCkV2ZW4gcG9zaXRpb25zIGlzIGNvbGxhdGVyYWwgZmxhZ3MgYW5kIHVuZXZlbiBpcyBib3Jyb3dpbmcgZmxhZ3MuAAAAAAAAAAARVXNlckNvbmZpZ3VyYXRpb24AAAAAAAABAAAAAAAAAAEwAAAAAAAACg==",
            "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA="
        ]);
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
    async initialize({ name, symbol, pool, underlying_asset }, options = {}) {
        return await invoke({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", { name, symbol, pool, underlying_asset }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async upgrade({ new_wasm_hash }, options = {}) {
        return await invoke({
            method: 'upgrade',
            args: this.spec.funcArgsToScVals("upgrade", { new_wasm_hash }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async version(options = {}) {
        return await invoke({
            method: 'version',
            args: this.spec.funcArgsToScVals("version", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("version", xdr);
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
    async allowance({ from, spender }, options = {}) {
        return await invoke({
            method: 'allowance',
            args: this.spec.funcArgsToScVals("allowance", { from, spender }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("allowance", xdr);
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
    async approve({ from, spender, amount, expiration_ledger }, options = {}) {
        return await invoke({
            method: 'approve',
            args: this.spec.funcArgsToScVals("approve", { from, spender, amount, expiration_ledger }),
            ...options,
            ...this.options,
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
    async balance({ id }, options = {}) {
        return await invoke({
            method: 'balance',
            args: this.spec.funcArgsToScVals("balance", { id }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("balance", xdr);
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
    async spendableBalance({ id }, options = {}) {
        return await invoke({
            method: 'spendable_balance',
            args: this.spec.funcArgsToScVals("spendable_balance", { id }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("spendable_balance", xdr);
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
    async authorized({ id }, options = {}) {
        return await invoke({
            method: 'authorized',
            args: this.spec.funcArgsToScVals("authorized", { id }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("authorized", xdr);
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
    async transfer({ from, to, amount }, options = {}) {
        return await invoke({
            method: 'transfer',
            args: this.spec.funcArgsToScVals("transfer", { from, to, amount }),
            ...options,
            ...this.options,
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
    async transferFrom({ spender, from, to, amount }, options = {}) {
        return await invoke({
            method: 'transfer_from',
            args: this.spec.funcArgsToScVals("transfer_from", { spender, from, to, amount }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async burnFrom({ _spender, _from, _amount }, options = {}) {
        return await invoke({
            method: 'burn_from',
            args: this.spec.funcArgsToScVals("burn_from", { _spender, _from, _amount }),
            ...options,
            ...this.options,
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
    async clawback({ from, amount }, options = {}) {
        return await invoke({
            method: 'clawback',
            args: this.spec.funcArgsToScVals("clawback", { from, amount }),
            ...options,
            ...this.options,
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
    async setAuthorized({ id, authorize }, options = {}) {
        return await invoke({
            method: 'set_authorized',
            args: this.spec.funcArgsToScVals("set_authorized", { id, authorize }),
            ...options,
            ...this.options,
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
    async mint({ to, amount }, options = {}) {
        return await invoke({
            method: 'mint',
            args: this.spec.funcArgsToScVals("mint", { to, amount }),
            ...options,
            ...this.options,
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
    async burn({ from, amount_to_burn, amount_to_withdraw, to }, options = {}) {
        return await invoke({
            method: 'burn',
            args: this.spec.funcArgsToScVals("burn", { from, amount_to_burn, amount_to_withdraw, to }),
            ...options,
            ...this.options,
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
    async decimals(options = {}) {
        return await invoke({
            method: 'decimals',
            args: this.spec.funcArgsToScVals("decimals", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("decimals", xdr);
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
    async name(options = {}) {
        return await invoke({
            method: 'name',
            args: this.spec.funcArgsToScVals("name", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("name", xdr);
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
    async symbol(options = {}) {
        return await invoke({
            method: 'symbol',
            args: this.spec.funcArgsToScVals("symbol", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("symbol", xdr);
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
    async totalSupply(options = {}) {
        return await invoke({
            method: 'total_supply',
            args: this.spec.funcArgsToScVals("total_supply", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("total_supply", xdr);
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
    async transferOnLiquidation({ from, to, amount }, options = {}) {
        return await invoke({
            method: 'transfer_on_liquidation',
            args: this.spec.funcArgsToScVals("transfer_on_liquidation", { from, to, amount }),
            ...options,
            ...this.options,
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
    async transferUnderlyingTo({ to, amount }, options = {}) {
        return await invoke({
            method: 'transfer_underlying_to',
            args: this.spec.funcArgsToScVals("transfer_underlying_to", { to, amount }),
            ...options,
            ...this.options,
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
    async underlyingAsset(options = {}) {
        return await invoke({
            method: 'underlying_asset',
            args: this.spec.funcArgsToScVals("underlying_asset", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("underlying_asset", xdr);
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
    async pool(options = {}) {
        return await invoke({
            method: 'pool',
            args: this.spec.funcArgsToScVals("pool", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("pool", xdr);
            },
        });
    }
}

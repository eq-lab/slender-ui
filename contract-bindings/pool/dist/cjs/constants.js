"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPC_URL = exports.NETWORK_PASSPHRASE = exports.CONTRACT_ID_HEX = exports.CONTRACT_ID = void 0;
const soroban_client_1 = require("soroban-client");
/**
 * The Soroban contract ID for the @bindings/pool contract.
 */
exports.CONTRACT_ID = 'CAVSCGJKXNS5UW25N4FOC647I2GNQ66N47FND55L6TMDQ7OU5LIMDKGH';
/**
 * The Soroban contract ID for the @bindings/pool contract, in hex.
 * If {@link CONTRACT_ID} is a new-style `C…` string, you will need this hex
 * version when making calls to RPC for now.
 */
exports.CONTRACT_ID_HEX = new soroban_client_1.Contract(exports.CONTRACT_ID).contractId('hex');
/**
 * The Soroban network passphrase used to initialize this library.
 */
exports.NETWORK_PASSPHRASE = 'Test SDF Future Network ; October 2022';
/**
 * The Soroban RPC endpoint used to initialize this library.
 */
exports.RPC_URL = 'https://rpc-futurenet.stellar.org:443';

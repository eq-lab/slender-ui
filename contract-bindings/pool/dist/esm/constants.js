import { Contract } from 'soroban-client';
/**
 * The Soroban contract ID for the @bindings/pool contract.
 */
export const CONTRACT_ID = 'CAVSCGJKXNS5UW25N4FOC647I2GNQ66N47FND55L6TMDQ7OU5LIMDKGH';
/**
 * The Soroban contract ID for the @bindings/pool contract, in hex.
 * If {@link CONTRACT_ID} is a new-style `C…` string, you will need this hex
 * version when making calls to RPC for now.
 */
export const CONTRACT_ID_HEX = new Contract(CONTRACT_ID).contractId('hex');
/**
 * The Soroban network passphrase used to initialize this library.
 */
export const NETWORK_PASSPHRASE = 'Test SDF Future Network ; October 2022';
/**
 * The Soroban RPC endpoint used to initialize this library.
 */
export const RPC_URL = 'https://rpc-futurenet.stellar.org:443';

import { Contract } from 'soroban-client';
/**
 * The Soroban contract ID for the @bindings/token contract.
 */
export const CONTRACT_ID = 'CAZ2XLJZKWFNWRQAF5VE3HQMJGH3KDKT4PLJ6EEKUVJ4Y4C735FPWLO2';
/**
 * The Soroban contract ID for the @bindings/token contract, in hex.
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

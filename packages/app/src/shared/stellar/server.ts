import { Server } from '@stellar/stellar-sdk/rpc';
import { NETWORK_DETAILS } from './constants/networks';

const SERVER_URL = NETWORK_DETAILS.rpcUrl;

export const server = new Server(SERVER_URL, {
  allowHttp: SERVER_URL.startsWith('http://'),
});

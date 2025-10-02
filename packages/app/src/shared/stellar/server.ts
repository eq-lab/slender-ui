import { rpc } from '@stellar/stellar-sdk';
import { NETWORK_DETAILS } from './constants/networks';

const SERVER_URL = NETWORK_DETAILS.rpcUrl;

export const server = new rpc.Server(SERVER_URL, {
  allowHttp: SERVER_URL.startsWith('http://'),
});

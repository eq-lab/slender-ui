import * as SorobanClient from 'soroban-client';
import { NETWORK_DETAILS } from './constants/networks';

const SERVER_URL = NETWORK_DETAILS.rpcUrl;

export const server = new SorobanClient.Server(SERVER_URL, {
  allowHttp: SERVER_URL.startsWith('http://'),
});

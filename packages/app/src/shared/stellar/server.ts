import * as SorobanClient from 'soroban-client'
import { NETWORK_DETAILS } from './constants/networks'

export const server = new SorobanClient.Server(NETWORK_DETAILS.rpcUrl, {
  allowHttp: NETWORK_DETAILS.networkUrl.startsWith('http://'),
})

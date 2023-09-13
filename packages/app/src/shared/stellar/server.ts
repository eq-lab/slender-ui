import * as SorobanClient from 'soroban-client'
import { FUTURENET_NETWORK_DETAILS } from './constants/networks'

export const server = new SorobanClient.Server(FUTURENET_NETWORK_DETAILS.rpcUrl, {
  allowHttp: FUTURENET_NETWORK_DETAILS.networkUrl.startsWith('http://'),
})

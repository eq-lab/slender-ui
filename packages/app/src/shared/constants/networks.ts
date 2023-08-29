interface NetworkDetails {
  network: string
  networkName: string
  networkUrl: string
  networkPassphrase: string
  friendbotUrl?: string
}

export enum NETWORK_NAMES {
  TESTNET = 'Test Net',
  PUBNET = 'Main Net',
  FUTURENET = 'Future Net',
}

export enum NETWORKS {
  PUBLIC = 'PUBLIC',
  TESTNET = 'TESTNET',
  FUTURENET = 'FUTURENET',
}

export enum NETWORK_URLS {
  PUBLIC = 'https://horizon.stellar.org',
  TESTNET = 'https://horizon-testnet.stellar.org',
  FUTURENET = 'https://horizon-futurenet.stellar.org',
}

export enum FRIENDBOT_URLS {
  TESTNET = 'https://friendbot.stellar.org',
  FUTURENET = 'https://friendbot-futurenet.stellar.org',
}

export const SOROBAN_RPC_URLS = {
  FUTURENET: 'https://rpc-futurenet.stellar.org/',
}

export const FUTURENET_NETWORK_DETAILS: NetworkDetails = {
  network: NETWORKS.FUTURENET,
  networkName: NETWORK_NAMES.FUTURENET,
  networkUrl: NETWORK_URLS.FUTURENET,
  networkPassphrase: 'Test SDF Future Network ; October 2022',
  friendbotUrl: FRIENDBOT_URLS.FUTURENET,
}

enum NETWORK_NAMES {
  PUBNET = 'Main Net',
  TESTNET = 'Test Net',
  FUTURENET = 'Future Net',
}

enum NETWORKS {
  PUBLIC = 'PUBLIC',
  TESTNET = 'TESTNET',
  FUTURENET = 'FUTURENET',
}

enum NETWORK_URLS {
  PUBLIC = 'https://horizon.stellar.org',
  TESTNET = 'https://horizon-testnet.stellar.org',
  FUTURENET = 'https://horizon-futurenet.stellar.org',
}

enum FRIENDBOT_URLS {
  TESTNET = 'https://friendbot.stellar.org',
  FUTURENET = 'https://friendbot-futurenet.stellar.org',
}

const SOROBAN_RPC_URLS = {
  FUTURENET: 'https://rpc-futurenet.stellar.org/',
}

interface NetworkDetails {
  network: string
  networkName: string
  networkUrl: string
  networkPassphrase: string
  friendbotUrl?: string
  rpcUrl: string
}

export const FUTURENET_NETWORK_DETAILS: NetworkDetails = {
  network: NETWORKS.FUTURENET,
  networkName: NETWORK_NAMES.FUTURENET,
  networkUrl: NETWORK_URLS.FUTURENET,
  networkPassphrase: 'Test SDF Future Network ; October 2022',
  friendbotUrl: FRIENDBOT_URLS.FUTURENET,
  rpcUrl: SOROBAN_RPC_URLS.FUTURENET,
}

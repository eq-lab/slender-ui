enum NETWORK_NAME {
  PUBLIC = 'Main Net',
  TESTNET = 'Test Net',
  FUTURENET = 'Future Net',
}

enum NETWORK_URL {
  PUBLIC = 'https://horizon.stellar.org',
  TESTNET = 'https://horizon-testnet.stellar.org',
  FUTURENET = 'https://horizon-futurenet.stellar.org',
}

enum NETWORK_PASSPHRASE {
  PUBLIC = 'Public Global Stellar Network ; September 2015',
  TESTNET = 'Test SDF Network ; September 2015',
  FUTURENET = 'Test SDF Future Network ; October 2022',
}

const SOROBAN_RPC_URL = {
  PUBLIC: 'https://rpc.eu-central-1.gateway.fm/v4/soroban/non-archival/mainnet',
  TESTNET: 'https://soroban-testnet.stellar.org',
  FUTURENET: 'https://rpc-futurenet.stellar.org',
};

interface NetworkDetails {
  networkName: string;
  networkUrl: string;
  networkPassphrase: string;
  rpcUrl: string;
}

export const NETWORK_DETAILS: NetworkDetails = {
  networkName: NETWORK_NAME.PUBLIC,
  networkUrl: NETWORK_URL.PUBLIC,
  networkPassphrase: NETWORK_PASSPHRASE.PUBLIC,
  rpcUrl: SOROBAN_RPC_URL.PUBLIC,
};

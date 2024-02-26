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
  networkName: NETWORK_NAME.FUTURENET,
  networkUrl: NETWORK_URL.FUTURENET,
  networkPassphrase: NETWORK_PASSPHRASE.FUTURENET,
  rpcUrl: SOROBAN_RPC_URL.FUTURENET,
};

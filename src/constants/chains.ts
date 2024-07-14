const ENV = import.meta.env.VITE_APP_ENV;

const ENV_NETWORK_NAME = ENV === 'prod' ? 'mainnet' : 'testnet';

const CosmosChainsConfig = {
  mainnet: {
    archway: { chainId: 'archway-1', chainName: 'archway' },
    injective: { chainId: 'injective-1', chainName: 'injective' },
    neutron: { chainId: 'neutron-1', chainName: 'neturon' },
  },
  testnet: {
    archway: { chainId: 'constantine-3', chainName: 'archwaytestnet' },
    injective: { chainId: 'injective-888', chainName: 'injectivetestnet' },
    neutron: { chainId: 'pion-1', chainName: 'neutrontestnet' },
  },
};

export const CosmosChains = {
  archway: CosmosChainsConfig[ENV_NETWORK_NAME].archway,
  injective: CosmosChainsConfig[ENV_NETWORK_NAME].injective,
  neutron: CosmosChainsConfig[ENV_NETWORK_NAME].neutron,
};

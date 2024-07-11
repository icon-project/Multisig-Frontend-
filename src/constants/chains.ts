const ENV = import.meta.env.VITE_APP_ENV;

const ENV_NETWORK_NAME = ENV === 'prod' ? 'mainnet' : 'testnet';

const CosmosChainsConfig = {
  mainnet: {
    archway: 'archway-1',
    injective: 'injective-1',
    neutron: 'neutron-1',
  },
  testnet: {
    archway: 'constantine-3',
    injective: 'injective-888',
    neutron: 'pion-1',
  },
};

export const CosmosChains = {
  archway: CosmosChainsConfig[ENV_NETWORK_NAME].archway,
  injective: CosmosChainsConfig[ENV_NETWORK_NAME].injective,
  neutron: CosmosChainsConfig[ENV_NETWORK_NAME].neutron,
};

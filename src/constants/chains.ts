export type cosmosChainDetails = {
  chainId: string;
  chainName: string;
  name: string;
  networkType: string;
};

const archwayRpcUrl = import.meta.env.VITE_APP_ARCHWAY_RPC_URL;
const injectiveRpcUrl = import.meta.env.VITE_APP_INJECTIVE_RPC_URL;
const neutronRpcUrl = import.meta.env.VITE_APP_NEUTRON_RPC_URL;

export const CosmosChains = {
  archway: {
    chainId: 'archway-1',
    chainName: 'archway',
    name: 'archway',
    networkType: 'mainnet',
    rpcUrl: archwayRpcUrl,
  },
  injective: {
    chainId: 'injective-1',
    chainName: 'injective',
    name: 'injective',
    networkType: 'mainnet',
    rpcUrl: injectiveRpcUrl,
  },
  neutron: {
    chainId: 'neutron-1',
    chainName: 'neturon',
    name: 'neturon',
    networkType: 'mainnet',
    rpcUrl: neutronRpcUrl,
  },
  archwaytestnet: {
    chainId: 'constantine-3',
    chainName: 'archwaytestnet',
    name: 'archway',
    networkType: 'testnet',
    rpcUrl: archwayRpcUrl,
  },
  injectivetestnet: {
    chainId: 'injective-888',
    chainName: 'injectivetestnet',
    name: 'injective',
    networkType: 'testnet',
    rpcUrl: injectiveRpcUrl,
  },
  neutrontestnet: {
    chainId: 'pion-1',
    chainName: 'neutrontestnet',
    name: 'neturon',
    networkType: 'testnet',
    rpcUrl: neutronRpcUrl,
  },
};

export const getCosmosChain = (chain: keyof typeof CosmosChains): cosmosChainDetails | undefined => {
  return CosmosChains[chain];
};

export type ethereumChainDetails = {
  chainId: string;
  chainName: string;
  name: string;
  networkType: string;
};

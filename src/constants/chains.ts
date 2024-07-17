export type cosmosChainDetails = {
  chainId: string;
  chainName: string;
  name: string;
  networkType: string;
};

export const CosmosChains = {
  archway: { chainId: 'archway-1', chainName: 'archway', name: 'archway', networkType: 'mainnet' },
  injective: { chainId: 'injective-1', chainName: 'injective', name: 'injective', networkType: 'mainnet' },
  neutron: { chainId: 'neutron-1', chainName: 'neturon', name: 'neturon', networkType: 'mainnet' },
  archwaytestnet: { chainId: 'constantine-3', chainName: 'archwaytestnet', name: 'archway', networkType: 'testnet' },
  injectivetestnet: { chainId: 'injective-888', chainName: 'injectivetestnet', name: 'injective', networkType: 'testnet' },
  neutrontestnet: { chainId: 'pion-1', chainName: 'neutrontestnet', name: 'neturon', networkType: 'testnet' },
};

export const getCosmosChain = (chain: keyof typeof CosmosChains): cosmosChainDetails | undefined => {
  return CosmosChains[chain];
};

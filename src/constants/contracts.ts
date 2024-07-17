const ARCHWAY_CONTRACT_ADDRESS = import.meta.env.VITE_APP_ARCHWAY_CONTRACT_ADDRESS;
const INJECTIVE_CONTRACT_ADDRESS = import.meta.env.VITE_APP_INJECTIVE_CONTRACT_ADDRESS;
const NEUTRON_CONTRACT_ADDRESS = import.meta.env.VITE_APP_NEUTRON_CONTRACT_ADDRESS;

type CosmosContracts = {
  archway: string;
  injective: string;
  neutron: string;
  // Testnets
  archwaytestnet: string;
  injectivetestnet: string;
  neutrontestnet: string;
};

export const CosmosContracts: CosmosContracts = {
  archway: ARCHWAY_CONTRACT_ADDRESS,
  injective: INJECTIVE_CONTRACT_ADDRESS,
  neutron: NEUTRON_CONTRACT_ADDRESS,
  archwaytestnet: ARCHWAY_CONTRACT_ADDRESS,
  injectivetestnet: INJECTIVE_CONTRACT_ADDRESS,
  neutrontestnet: NEUTRON_CONTRACT_ADDRESS,
};

export const getCosmosContractByChain = (chain: string): string | undefined => {
  if (chain in CosmosContracts) {
    return CosmosContracts[chain as keyof CosmosContracts];
  }
};

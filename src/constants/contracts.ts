const ARCHWAY_CONTRACT_ADDRESS = import.meta.env.VITE_APP_ARCHWAY_CONTRACT_ADDRESS;
const INJECTIVE_CONTRACT_ADDRESS = import.meta.env.VITE_APP_INJECTIVE_CONTRACT_ADDRESS;
const NEUTRON_CONTRACT_ADDRESS = import.meta.env.VITE_APP_NEUTRON_CONTRACT_ADDRESS;

const ARCHWAY_MULTISIG_MEMBER_CONTRACT_ADDRESS = import.meta.env.VITE_APP_ARCHWAY_MULTISIG_MEMBER_CONTRACT_ADDRESS;
const INJECTIVE_MULTISIG_MEMBER_CONTRACT_ADDRESS = import.meta.env.VITE_APP_INJECTIVE_MULTISIG_MEMBER_CONTRACT_ADDRESS;
const NEUTRON_MULTISIG_MEMBER_CONTRACT_ADDRESS = import.meta.env.VITE_APP_NEUTRON_MULTISIG_MEMBER_CONTRACT_ADDRESS;

const ETHEREUM_CONTRACT_ADDRESS = import.meta.env.VITE_APP_ETHEREUM_CONTRACT_ADDRESS;
const ARBITRUM_CONTRACT_ADDRESS = import.meta.env.VITE_APP_ARBITRUM_CONTRACT_ADDRESS;
const BASE_CONTRACT_ADDRESS = import.meta.env.VITE_APP_BASE_CONTRACT_ADDRESS;
const AVALANCHE_CONTRACT_ADDRESS = import.meta.env.VITE_APP_AVALANCHE_CONTRACT_ADDRESS;
const OPTIMISM_CONTRACT_ADDRESS = import.meta.env.VITE_APP_OPTIMISM_CONTRACT_ADDRESS;

type CosmosContracts = {
  archway: string;
  injective: string;
  neutron: string;
  // Testnets
  archwaytestnet: string;
  injectivetestnet: string;
  neutrontestnet: string;
};

type EthereumContractsType = {
  [chainId: string]: string;
};

export const CosmosContracts: CosmosContracts = {
  archway: ARCHWAY_CONTRACT_ADDRESS,
  injective: INJECTIVE_CONTRACT_ADDRESS,
  neutron: NEUTRON_CONTRACT_ADDRESS,
  archwaytestnet: ARCHWAY_CONTRACT_ADDRESS,
  injectivetestnet: INJECTIVE_CONTRACT_ADDRESS,
  neutrontestnet: NEUTRON_CONTRACT_ADDRESS,
};

export const CosmosMultiSigMemberContracts: CosmosContracts = {
  archway: ARCHWAY_MULTISIG_MEMBER_CONTRACT_ADDRESS,
  injective: INJECTIVE_MULTISIG_MEMBER_CONTRACT_ADDRESS,
  neutron: NEUTRON_MULTISIG_MEMBER_CONTRACT_ADDRESS,
  archwaytestnet: ARCHWAY_MULTISIG_MEMBER_CONTRACT_ADDRESS,
  injectivetestnet: INJECTIVE_MULTISIG_MEMBER_CONTRACT_ADDRESS,
  neutrontestnet: NEUTRON_MULTISIG_MEMBER_CONTRACT_ADDRESS,
}

export const EthereumContracts: EthereumContractsType = {
  '1': ETHEREUM_CONTRACT_ADDRESS,
  '42161': ARBITRUM_CONTRACT_ADDRESS,
  '8453': BASE_CONTRACT_ADDRESS,
  '10': OPTIMISM_CONTRACT_ADDRESS,
  '43114': AVALANCHE_CONTRACT_ADDRESS,
  // Testnets
  '11155111': ETHEREUM_CONTRACT_ADDRESS,
  '421614': ARBITRUM_CONTRACT_ADDRESS,
  '84532': BASE_CONTRACT_ADDRESS,
  '11155420': OPTIMISM_CONTRACT_ADDRESS,
  '43113': AVALANCHE_CONTRACT_ADDRESS,
};

export const getCosmosContractByChain = (chain: string): string | undefined => {
  if (chain in CosmosContracts) {
    return CosmosContracts[chain as keyof CosmosContracts];
  }
};

export const getCosmosMultiSigMemberContractByChain = (chain: string): string | undefined => {
  if (chain in CosmosMultiSigMemberContracts) {
    return CosmosMultiSigMemberContracts[chain as keyof CosmosContracts];
  }
};

export const getEthereumContractByChain = (chainId: string): string => {
  return EthereumContracts[chainId];
};

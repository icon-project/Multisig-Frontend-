// services/getContract.ts
import { ethers } from 'ethers';
import { abi } from '../abi/SAFE_ABI';
import { useEthersSigner } from '../utils/ethers';
// import { useEthersSigner } from '...; // Ensure this is correctly imported and used

export const getContract = async (contractAddress: string) => {
  const signer = useEthersSigner(); // This should be called within a React component or hook context
  if (!signer) throw new Error('Signer not available');

  return new ethers.Contract(contractAddress, abi, signer);
};

import { ConnectButton } from '@rainbow-me/rainbowkit';

import React, { useState, useEffect } from 'react';
import { useEthersSigner } from '../utils/ethers';
import { ethers } from 'ethers';
import { abi } from '../abi/SAFE_ABI';
// import { getEthersSigner } from '../EtherJs/ethers';
import { config } from '../config';
import { getChainId } from '@wagmi/core';

import { EthereumContracts } from '../constants/contracts';

const EVMManagerPage = () => {
  const [proposalId, setProposalId] = useState('');
  const signer = useEthersSigner();
  const chainId = getChainId(config); // account, chainid, metamask

  // console.log(chainslist[0].chainId);

  const contractList = {
    '84532': EthereumContracts.BASE_SEPOLIA_SAFE,
    '11155111': EthereumContracts.SEPOLIA_SAFE,
    '43113': EthereumContracts.FUJI_SAFE,
    '43114': EthereumContracts.AVALANCHE,
    '421614': EthereumContracts.ARBITRUM_SEPOLIA_SAFE,
    '11155420': EthereumContracts.OPTIMISM_SEPOLIA_SAFE,
    '42161': EthereumContracts.ARBITRUM,
    '10': EthereumContracts.OPTIMISM,
    '8453': EthereumContracts.BASE,
  };

  const handleChange = (e) => {
    setProposalId(e.target.value);
  };

  const handleSubmit = async () => {
    if (!signer) {
      console.error('Signer is undefined. Check initialization.');
      return;
    }

    console.log('Signer:', signer);

    try {
      let contract = new ethers.Contract(contractList[chainId], abi, signer);
      // const bytes32proposal = ethers.utils.formatBytes32String(proposalId);
      console.log(contract, 'contracts');
      const bytes32proposal = proposalId;
      // console.log(bytes32proposal, 'changed to bytes32');
      const tx = await contract.approveHash(bytes32proposal);
      // const tx = await contract.approvedHashes();

      // Wait for the transaction to be mined
      await tx.wait();
      console.log('Transaction confirmed:', tx.hash);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log('Proposal ID:', proposalId);
  }, [proposalId]);

  useEffect(() => {
    console.log('Current chain ID:', chainId);
    let address = contractList[chainId];
    console.log('Contract address:', address);
  }, [chainId]);

  return (
    <div className="evm-manager-page">
      <div>
        <ConnectButton />
        <div className="pl-32 pt-10">
          <p className="text-xl">Enter proposal hash to approve the proposal.</p>
          <div className="flex flex-row pt-7">
            <div>
              <input
                type="text"
                id="hash"
                name="hash"
                className="pl-3 border border-gray-400 h-10 w-96"
                value={proposalId}
                onChange={handleChange}
              />
            </div>
            <div className="pl-3">
              <button
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={handleSubmit}
              >
                Approve proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EVMManagerPage;

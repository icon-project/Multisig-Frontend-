import { ConnectButton } from '@rainbow-me/rainbowkit';

import React, { useState, useEffect } from 'react';
import { useEthersSigner } from '../utils/ethers';
import { ethers } from 'ethers';
import { abi } from '../abi/SAFE_ABI';
// import { getEthersSigner } from '../EtherJs/ethers';
import { config } from '../config';
import { getChainId } from '@wagmi/core';
import proposal_data from '../../scripts/proposal_data.json';

// import { Proposals } from '../components/ProposalsList/Proposals';

import { EthereumContracts } from '../constants/contracts';

const EVMManagerPage = () => {
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

  const handleSubmit = async (hash) => {
    console.log('');
    if (!signer) {
      console.error('Signer is undefined. Check initialization.');
      return;
    }

    console.log('Signer:', signer);

    try {
      let contract = new ethers.Contract(contractList[chainId], abi, signer);
      // const bytes32proposal = ethers.utils.formatBytes32String(proposalId);
      console.log(contract, 'contracts');

      const tx = await contract.approveHash(hash);
      // const tx = await contract.approvedHashes();

      // Wait for the transaction to be mined
      await tx.wait();
      console.log('Transaction confirmed:', tx.hash);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log('Current chain ID:', chainId);
    let address = contractList[chainId];
    console.log('Contract address:', address);
  }, [chainId]);

  return (
    <div className="evm-manager-page">
      <div>
        <ConnectButton />
        {/* <div className="pl-32 pt-10">
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
          </div>
        </div> */}
      </div>
      {/* //proposals List */}
      <div>
        <h1 className="pt-10">List of proposals</h1>

        <div>
          <table className="mt-2  ">
            <thead>
              <tr className="border border-black">
                <th className="border border-black h-16">Title </th>
                <th className="border border-black h-16">Proposal </th>

                <th className="border border-black">Approve</th>
              </tr>
            </thead>

            {proposal_data.map((proposal) => (
              <tr className="border border-black">
                <td className="border border-black h-16 pl-3">{proposal.remark}</td>
                <td className="border border-black h-16 pl-3">{proposal.proposal}</td>

                <td>
                  <div className="pl-3 w-64 ">
                    <button
                      className="bg-transparent  hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-10 border border-blue-500 hover:border-transparent rounded"
                      onClick={() => {
                        handleSubmit(proposal.proposal);
                      }}
                    >
                      Approve proposal
                    </button>
                  </div>{' '}
                </td>
              </tr>
            ))}
            {/* {!isComplete ? <SpinningCircles fill="black" className="w-20 h-10 inline fixed top-20 right-96 pl-3" /> : ''} */}
          </table>
        </div>
      </div>
    </div>
  );
};

export default EVMManagerPage;

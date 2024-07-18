import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useEthersSigner } from '../utils/ethers';
import { ethers } from 'ethers';
import { abi } from '../abi/SAFE_ABI';
// import { getEthersSigner } from '../EtherJs/ethers';
import { config } from '../config';
import { getChainId } from '@wagmi/core';
import { loadProposalData } from '../utils/loadproposaldata';

// import { Proposals } from '../components/ProposalsList/Proposals';

import { EthereumContracts } from '../constants/contracts';

const EVMManagerPage = () => {
  const signer = useEthersSigner();
  const chainId = getChainId(config); // account, chainid, metamask
  const [proposal_data, setProposalData] = useState<any[]>([]);
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

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await loadProposalData(); // Load proposals
        console.log('Printing the data from Firebase', data.length);
        setProposalData(data); // Update proposal_data state with fetched data
        console.log(proposal_data); // Example log, ensure data is correctly fetched
      } catch (error) {
        console.error('Error fetching proposal data:', error);
      }
    }

    fetchData();
  }, []);

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
        <Link to="/createProposal">
          <button
            className="bg-transparent border-blue-700 p-5  text-blue-700 font-semibold hover:text-white py-2 m-3 border hover:border-transparent hover:bg-blue-700 rounded absolute top-32 right-64"
            // onClick={}
          >
            {' '}
            Create a Proposal{' '}
          </button>
        </Link>

        <div>
          <table className="mt-2  ">
            <thead>
              <tr className="border border-black">
                <th className="border border-black h-16">Title </th>
                <th className="border border-black h-16">Proposal </th>

                <th className="border border-black">Approve</th>
              </tr>
            </thead>
            <tbody>
              {proposal_data[0].map((proposal, index) => (
                <tr key={index} className="border border-black">
                  <td className="border border-black h-16 pl-3">{proposal.remark}</td>
                  <td className="border border-black h-16 pl-3 m-3">{proposal.proposal}</td>
                  <td>
                    <div className="pl-3">
                      <button
                        className="bg-transparent text-blue-700 font-semibold py-2 m-3 border hover:border-transparent rounded"
                        onClick={() => {
                          handleSubmit(proposal.proposal);
                        }}
                      >
                        Approve proposal
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* {!isComplete ? <SpinningCircles fill="black" className="w-20 h-10 inline fixed top-20 right-96 pl-3" /> : ''} */}
          </table>
        </div>
      </div>
    </div>
  );
};

export default EVMManagerPage;
